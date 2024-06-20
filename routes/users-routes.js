const express = require("express")
const {getAllUsers, loadUser, login, logout, signup, verifyOTP, updateUser, deleteUser } = require("../controllers/users-controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllUsers)
router.get("/loadUser", loadUser)
router.post("/login", login)
router.post("/signup", signup)
router.post("/verifyOTP", verifyOTP)
router.post("/logout", logout)
router.put("/:userID", updateUser)
router.delete("/:userID", deleteUser)

module.exports = router
