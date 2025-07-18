document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('identify-form');
    const responseOutput = document.getElementById('response-output');
    const errorMessage = document.getElementById('error-message');

    // The URL of your hosted backend service
    const apiUrl = 'https://bitespeed-backend-task-pyoush-madan.onrender.com/identify';

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Clear previous results and errors
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        responseOutput.textContent = 'Loading...';

        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;

        // Basic validation: at least one field must be filled
        if (!email && !phoneNumber) {
            responseOutput.textContent = 'Awaiting submission...';
            errorMessage.textContent = 'Please provide either an email or a phone number.';
            errorMessage.style.display = 'block';
            return;
        }
        
        // Construct the request body
        const body = {
            email: email || null,
            phoneNumber: phoneNumber || null
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle HTTP errors like 400 or 500
                throw new Error(data.error || `HTTP error! Status: ${response.status}`);
            }

            // Format the JSON response for pretty printing and display it
            responseOutput.textContent = JSON.stringify(data, null, 2);

        } catch (error) {
            console.error('API Call Failed:', error);
            responseOutput.textContent = 'Failed to fetch response.';
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });
});