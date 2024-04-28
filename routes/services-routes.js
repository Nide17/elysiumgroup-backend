import express from "express"
import { getAllServices, addServices, updateService, deleteService } from "../controllers/services-controller.js"
import { isAuthenticated } from "../middlewares/authentication.js"

const router = express.Router()

router.get("/", isAuthenticated, getAllServices)
router.post("/", isAuthenticated, addServices)
router.put("/:id", isAuthenticated, updateService)
router.delete("/:id", isAuthenticated, deleteService)

export default router
