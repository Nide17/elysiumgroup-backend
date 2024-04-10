import express from "express";
import {
  getAllProjectTypes,
  addProjectType,
  updateProjectType,
  deleteProjectType,
} from "../controllers/projectType-controller";

import { isAuthenticated } from "../middlewares/authentication";

const projectTypeRouter = express.Router();

projectTypeRouter.get("/", isAuthenticated, getAllProjectTypes);
projectTypeRouter.post("/add", isAuthenticated, addProjectType);
projectTypeRouter.put("/update/:id", isAuthenticated, updateProjectType);
projectTypeRouter.delete("/:id", isAuthenticated, deleteProjectType);

export default projectTypeRouter;
