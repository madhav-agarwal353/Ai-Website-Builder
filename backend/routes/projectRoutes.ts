import express from "express";
import { protect } from "../middlewares/auth.js";
import { deleteProject, getProjectPreview, getpublishProjects, makeChanges, publishProject, rollbacktoVersion, saveProject } from "../controller/projectController.js";

const projectRouter = express.Router();

projectRouter.post(
    "/changes/:projectId", protect, makeChanges);
projectRouter.put(
    "/save/:projectId", protect, saveProject);
projectRouter.post(
    "/rollback/:projectId/:versionId", protect, rollbacktoVersion);
projectRouter.delete(
    "/:projectId", protect, deleteProject);
projectRouter.get(
    "/preview/:projectId", protect, getProjectPreview);
projectRouter.get(
    "/published", getpublishProjects);
projectRouter.put(
    "/published/:projectId", protect, publishProject);;


export default projectRouter;


