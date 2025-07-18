import { PrismaClient, Contact, LinkPrecedence } from '../generated/prisma';

const prisma = new PrismaClient();

// Helper function to format the final response
const formatResponse = (primaryContact: Contact, secondaryContacts: Contact[]) => {
    const emails = [primaryContact.email, ...secondaryContacts.map(c => c.email)];
    const phoneNumbers = [primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)];

    return {
        contact: {
            primaryContatctId: primaryContact.id,
            emails: [...new Set(emails.filter(Boolean))], // Unique, non-null emails
            phoneNumbers: [...new Set(phoneNumbers.filter(Boolean))], // Unique, non-null phone numbers
            secondaryContactIds: secondaryContacts.map(c => c.id),
        },
    };
};

export const identifyContact = async (email?: string, phoneNumber?: string) => {
    // 1. Find existing contacts by email or phone number
    const matchingContacts = await prisma.contact.findMany({
        where: {
            OR: [{ email: email || undefined }, { phoneNumber: phoneNumber || undefined }],
            deletedAt: null,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    // Case 1: No existing contacts found -> Create a new primary contact
    if (matchingContacts.length === 0) {
        const newContact = await prisma.contact.create({
            data: {
                email: email,
                phoneNumber: phoneNumber,
                linkPrecedence: LinkPrecedence.primary,
            },
        });
        return formatResponse(newContact, []);
    }

    // Identify the primary contact and all related contacts
    let primaryContact = matchingContacts.find(c => c.linkPrecedence === 'primary') || matchingContacts[0];
    if (primaryContact.linkedId) {
        // If the oldest contact found is a secondary, find its true primary
        const rootPrimary = await prisma.contact.findUnique({ where: { id: primaryContact.linkedId }});
        if (rootPrimary) primaryContact = rootPrimary;
    }
    
    const allRelatedContactIds = new Set<number>([primaryContact.id]);
    matchingContacts.forEach(c => {
        allRelatedContactIds.add(c.id);
        if (c.linkedId) allRelatedContactIds.add(c.linkedId);
    });

    const allContacts = await prisma.contact.findMany({
        where: { 
            OR: [
                { id: { in: Array.from(allRelatedContactIds) } },
                { linkedId: { in: Array.from(allRelatedContactIds) } },
            ]
        },
         orderBy: { createdAt: 'asc' },
    });

    const primaryContacts = allContacts.filter(c => c.linkPrecedence === 'primary');
    
    // Case 2: Multiple primary contacts found -> Merge them
    if (primaryContacts.length > 1) {
        const oldestPrimary = primaryContacts[0];
        const otherPrimaries = primaryContacts.slice(1);
        
        await prisma.$transaction(
            otherPrimaries.map(p => 
                prisma.contact.update({
                    where: { id: p.id },
                    data: {
                        linkedId: oldestPrimary.id,
                        linkPrecedence: LinkPrecedence.secondary,
                    }
                })
            )
        );
        // Refresh all contacts after merge
        allContacts.forEach(c => {
           if (otherPrimaries.some(p => p.id === c.id || p.id === c.linkedId)) {
               c.linkedId = oldestPrimary.id;
               if(c.id !== oldestPrimary.id) c.linkPrecedence = "secondary";
           }
        });
        primaryContact = oldestPrimary;
    }


    // Case 3: Check if new information needs to be added as a new secondary contact
    const hasEmail = allContacts.some(c => c.email === email);
    const hasPhone = allContacts.some(c => c.phoneNumber === phoneNumber);

    if ((email && !hasEmail) || (phoneNumber && !hasPhone)) {
        const newSecondaryContact = await prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: LinkPrecedence.secondary,
            },
        });
        allContacts.push(newSecondaryContact);
    }
    
    // Final response generation
    const finalPrimaryContact = primaryContact;
    const finalSecondaryContacts = allContacts.filter(c => c.id !== finalPrimaryContact.id);

    return formatResponse(finalPrimaryContact, finalSecondaryContacts);
};