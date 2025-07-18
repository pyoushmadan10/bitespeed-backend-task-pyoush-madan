import express from 'express';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bitespeed Identity Service is running!');
});

app.use('/', contactRoutes);

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});