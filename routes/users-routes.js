const express = require("express")
const {getAllUsers, loadUser, login, logout, signup, verifyOTP, updateUser, deleteUser, forgotPassword, resetPassword, updateProfilePicture, deleteProfilePicture, updateUserPlatformSettings } = require("../controllers/users-controller")
const { isAuthenticated } = require("../middlewares/authentication")
const upload = require("../middlewares/multer")

const router = express.Router()

router.get("/", getAllUsers)
router.get("/loadUser", loadUser)
router.post("/login", login)
router.post("/signup", signup)
router.post("/verifyOTP", verifyOTP)
router.post("/forgotPassword", forgotPassword)
router.post("/resetPassword", resetPassword)
router.post("/logout", logout)
router.put("/updateProfilePicture/:userID", upload.single("profilePicture"), updateProfilePicture)
router.delete("/deleteProfilePicture/:userID", deleteProfilePicture)
router.put("/updateUserPlatformSettings/:userID", updateUserPlatformSettings)
router.put("/:userID", updateUser)
// router.delete("/:userID", deleteUser)

module.exports = router
