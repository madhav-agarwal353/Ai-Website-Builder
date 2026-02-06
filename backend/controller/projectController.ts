import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import openai from "../config/openai.js";

export const makeChanges = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const projectId = req.params.projectId as string;
        console.log(projectId);
        const { message } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userId || !user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (user.credits < 5) {
            return res.status(403).json({ error: "Insufficient credits" });
        }
        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message cannot be empty" });
        }
        const currentProject = await prisma.websiteProject.findUnique({
            where: { id: projectId },
            include: { versions: true }
        });
        if (!currentProject) {
            return res.status(404).json({ error: "Project not found" });
        }
        await prisma.conversation.create({
            data: {
                role: "user",
                content: message,
                projectId: projectId,
            },
        });
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 5 } },

        });
        //enhnace ypur promt
        const promptEnhnaceResponse = await openai.chat.completions.create({
            model: "upstage/solar-pro-3:free",
            messages: [
                {
                    role: "system",
                    content: `You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

Enhance this prompt by:

1. Adding specific design details (layout, color scheme, typography)

2. Specifying key sections and features

3. Describing the user experience and interactions

4. Including modern web design best practices

5. Mentioning responsive design requirements

6. Adding any missing but important elements

Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max)`
                },
                { role: "user", content: `User request: ${message}` }
            ]
        });

        const enhancedPrompt = promptEnhnaceResponse.choices[0].message.content;
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `I enhanced the prompt: ${enhancedPrompt}`,
                projectId: projectId,
            },
        });
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `Now making changes to the website`,
                projectId: projectId,
            },
        });

        const codeGenerationResponse = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages: [
                {
                    role: "system",
                    content: `You are an expert web developer. 

    CRITICAL REQUIREMENTS:
    - Return ONLY the complete updated HTML code with the requested changes.
    - Use Tailwind CSS for ALL styling (NO custom CSS).
    - Use Tailwind utility classes for all styling changes.
    - Include all JavaScript in <script> tags before closing </body>
    - Make sure it's a complete, standalone HTML document with Tailwind CSS
    - Return the HTML Code Only, nothing else

    Apply the requested changes while maintaining the Tailwind CSS styling approach.`
                },
                { role: "user", content: `Here is the current website code:: ${currentProject.current_code} The user wants to make the following changes: ${message}` }
            ],
        });
        const updatedCode = codeGenerationResponse.choices[0].message.content || '';
        const version = await prisma.version.create({
            data: {
                code: updatedCode.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim(),
                description: `Changes made: ${message}`,
                projectId: projectId,
            },
        });

        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `Here is the
                          updated code with the requested changes.`,
                projectId: projectId,
            },
        });

        await prisma.websiteProject.update({
            where: { id: projectId },
            data: {
                current_code: updatedCode.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim(),
                current_version_index: version.id,
            },
        });
        res.json({ message: "Website updated successfully" });

    } catch (error: any) {
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: 5 } },
        });

        console.error("Error updating website:", error);
        res.status(500).json({ error: "Failed to update website" });
    }
};
export const rollbacktoVersion = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const projectId = req.params.projectId as string;
        const versionId = req.params.versionId as string;
        const project = await prisma.websiteProject.findUnique({
            where: { id: projectId },
            include: { versions: true },
        });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        const version = project.versions.find(version => version.id === versionId);
        if (!version) {
            return res.status(404).json({ error: "Version not found" });
        }
        await prisma.websiteProject.update({
            where: { id: projectId, userId },
            data: {
                current_code: version.code,
                current_version_index: version.id,
            },
        });

        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `Website rolled back to selected version.`,
                projectId: projectId,
            }
        });

        res.json({ message: "Website rolled back to the selected version" });
    } catch (error: any) {
        console.error("Error rolling back website:", error);
        res.status(500).json({ error: "Failed to rollback website" });
    }
};
export const deleteProject = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const projectId = req.params.projectId as string;

        await prisma.websiteProject.deleteMany({
            where: { id: projectId, userId },
        });
        res.json({ message: "Project deleted successfully" });
    }
    catch (error: any) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project" });
    }
}
export const getProjectPreview = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const projectId = req.params.projectId as string;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const project = await prisma.websiteProject.findFirst({
            where: { id: projectId, userId },
            include: { versions: true },
        });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        console.error("Error fetching project preview:", error);
        res.status(500).json({ error: "Failed to fetch project preview" });
    }
}
export const getpublishProjects = async (req: Request, res: Response) => {
    try {
        const project = await prisma.websiteProject.findMany({
            where: { isPublished: true },
            include: { user: true },
        });
        res.json(project);
    } catch (error) {
        console.error("Error fetching published projects:", error);
        res.status(500).json({ error: "Failed to fetch published projects" });
    }
}
export const publishProject = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const projectId = req.params.projectId as string;
        const project = await prisma.websiteProject.findFirst({
            where: { id: projectId, userId },
        });
        if (!project || !project?.current_code) {
            return res.status(404).json({ error: "Project not found" });
        }
        await prisma.websiteProject.update({
            where: { id: projectId, userId },
            data: { isPublished: !project.isPublished },
        });
        res.json({ message: project.isPublished ? "Project unpublished successfully" : "Project published successfully" });
    } catch (error: any) {
        console.error("Error publishing project:", error);
        res.status(500).json({ error: "Failed to publish project" });
    }
}
export const saveProject = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const projectId = req.params.projectId as string;
        const { code } = req.body;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!code || code.trim() === "") {
            return res.status(400).json({ error: "Code cannot be empty" });
        }
        const project = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
        });

        if (!project || !project?.current_code) {
            return res.status(404).json({ error: "Project not found" });
        }
        await prisma.websiteProject.update({
            where: { id: projectId, userId },
            data: {
                current_code: code,
                current_version_index: ''
            },
        });
        res.json({ message: "Project saved successfully" });
    } catch (error: any) {
        console.error("Error saving project:", error);
        res.status(500).json({ error: "Failed to save project" });
    }
}

