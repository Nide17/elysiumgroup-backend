import express from "express";
import {
  getAllProjects,
  addProject,
  updateProject,
  getOneProject,
  deleteProject,
  getByUserId,
} from "../controllers/project-controller";

import { isAuthenticated } from "../middlewares/authentication"; // Import the isAuthenticated middleware
import upload from "../middlewares/multer";

const projectRouter = express.Router();

// Apply isAuthenticated middleware to routes that require authentication
projectRouter.get("/", isAuthenticated, getAllProjects);
// projectRouter.post("/add", isAuthenticated, addProject);
projectRouter.put("/update/:id", isAuthenticated, updateProject);
projectRouter.get("/:id", isAuthenticated, getOneProject);
projectRouter.delete("/:id", isAuthenticated, deleteProject);
projectRouter.get("/user/:id", isAuthenticated, getByUserId);
projectRouter.post("/add", upload.single("pGallery"), addProject);

export default projectRouter;
