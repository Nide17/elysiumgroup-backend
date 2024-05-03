const express = require("express")
const {getAllProjectTypes, addProjectType, updateProjectType, deleteProjectType } = require("../controllers/projectTypes-controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllProjectTypes)
router.post("/", addProjectType)
router.put("/:pTypeID", updateProjectType)
router.delete("/:pTypeID", deleteProjectType)

module.exports = router
