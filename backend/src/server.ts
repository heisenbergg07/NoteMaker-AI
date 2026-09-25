import express, { Request, Response } from 'express';
import { env } from "./config/env.js";
import { prisma } from './config/database.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/health', (req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to NoteMaker AI"
    })
});

app.get('/test', async (req: Request, res: Response) => {
   try {
    const notes = await prisma.note.findMany();
    res.status(200).json({
        success: true,
        message: notes
    })
   } catch (error){
    console.log(error)
   }
});

app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
