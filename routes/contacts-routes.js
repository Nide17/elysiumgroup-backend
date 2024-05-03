const express = require("express")
const {getAllContacts, addContact, updateContact, getOneContact, deleteContact } = require("../controllers/contacts-controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllContacts)
router.post("/", addContact)
router.put("/:contactID", updateContact)
router.get("/:contactID", getOneContact)
router.delete("/:contactID", deleteContact)

module.exports = router
