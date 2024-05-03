const express = require("express")
const {getAllClients, addClient, updateClient, getOneClient, deleteClient } = require("../controllers/clients-controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllClients)
router.post("/", addClient)
router.put("/:clientID", updateClient)
router.get("/:clientID", getOneClient)
router.delete("/:clientID", deleteClient)

module.exports = router
