import { Router } from "express";
import { prisma } from "../config/database.js";

// health check routes 

const healthRouter = Router();

healthRouter.get('/', (req, res) => {
    res.status(200).json({
    success: true,
    message: "NoteMaker AI API is running"
  });
})

healthRouter.get('/db', async (req, res) => {
   try {
    const notes = await prisma.note.findMany();
    res.status(200).json({
      success: true,
      data: notes
    })
   } catch (error){
    console.log(error);
   }
})

export default healthRouter;
