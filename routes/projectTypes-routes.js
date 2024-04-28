import express from "express"
import { getAllProjectTypes, addProjectType, updateProjectType, deleteProjectType } from "../controllers/projectTypes-controller.js"
import { isAuthenticated } from "../middlewares/authentication.js"

const router = express.Router()

router.get("/", isAuthenticated, getAllProjectTypes)
router.post("/", isAuthenticated, addProjectType)
router.put("/:id", isAuthenticated, updateProjectType)
router.delete("/:id", isAuthenticated, deleteProjectType)

export default router
