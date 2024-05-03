const express = require("express")
const {getAllClients, addClient, addClientLogo, updateClient, getOneClient, deleteClient } = require("../controllers/clients-controller")
const upload = require("../middlewares/multer")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllClients)
router.post("/", addClient)
router.put("/:clientID", updateClient)
router.get("/:clientID", getOneClient)
router.delete("/:clientID", deleteClient)
router.put("/add-logo/:clientID", upload.single("clientLogo"), addClientLogo)

module.exports = router
