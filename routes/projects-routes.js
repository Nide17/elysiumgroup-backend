const express = require("express")
const {getAllProjects, addProject, addProjectImages, deleteProjectImage, updateProject, getOneProject, deleteProject, getByUserId, getFeaturedProjects } = require("../controllers/projects-controller")
const { isAuthenticated } = require("../middlewares/authentication")
const upload = require("../middlewares/multer")

const router = express.Router()

// Apply isAuthenticated middleware to routes that require authentication
router.get("/", getAllProjects)
router.get("/:projectID", getOneProject)
router.get("/createdBy/:userID", getFeaturedProjects)
// router.post("/", upload.single("pGallery"), addProject)
router.post("/", upload.array("pGallery"), addProject)
router.put("/:projectID", updateProject)
router.put("/add-images/:projectID", upload.array("pGallery"), addProjectImages)
router.delete("/delete-image/:projectID/:imageID", deleteProjectImage)
router.get("/user/:projectID", getByUserId)
router.delete("/:projectID", deleteProject)

module.exports = router
