import express from "express"
import { getAllProjects, addProject, updateProject, getOneProject, deleteProject, getByUserId } from "../controllers/projects-controller.js"
import { isAuthenticated } from "../middlewares/authentication.js"
import upload from "../middlewares/multer.js"

const router = express.Router()

// Apply isAuthenticated middleware to routes that require authentication
router.get("/", isAuthenticated, getAllProjects)
// router.post("/add", isAuthenticated, addProject)
router.put("/:id", isAuthenticated, updateProject)
router.get("/:id", isAuthenticated, getOneProject)
router.delete("/:id", isAuthenticated, deleteProject)
router.get("/user/:id", isAuthenticated, getByUserId)
router.post("/add", upload.single("pGallery"), addProject)

export default router
