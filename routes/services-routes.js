const express = require("express")
const {getAllServices, addService, updateService, deleteService } = require("../controllers/services-controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllServices)
router.post("/", addService)
router.put("/:id", updateService)
router.delete("/:id", deleteService)

module.exports = router
