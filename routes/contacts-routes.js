import express from "express"
import { getAllContacts, addContact, updateContact, getOneContact, deleteContact } from "../controllers/contacts-controller.js"
import { isAuthenticated } from "../middlewares/authentication.js"

const router = express.Router()

router.get("/", getAllContacts)
router.post("/", addContact)
router.put("/:id", isAuthenticated, updateContact)
router.get("/:id", isAuthenticated, getOneContact)
router.delete("/:id", isAuthenticated, deleteContact)

export default router
