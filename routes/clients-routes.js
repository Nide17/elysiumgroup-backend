import express from "express"
import { getAllClients, addClient, updateClient, getOneClient, deleteClient } from "../controllers/clients-controller.js"
import { isAuthenticated } from "../middlewares/authentication.js"

const router = express.Router()

router.get("/", isAuthenticated, getAllClients)
router.post("/add", isAuthenticated, addClient)
router.put("/update/:id", isAuthenticated, updateClient)
router.get("/:id", isAuthenticated, getOneClient)
router.delete("/:id", deleteClient)

export default router
