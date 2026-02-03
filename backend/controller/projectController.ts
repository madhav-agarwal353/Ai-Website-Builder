import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const makeChanges = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const { projectId } = req.params;
        const { message } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });


        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }


    } catch (error) {

    }


} 