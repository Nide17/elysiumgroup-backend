import express from "express";
import {
  getAllUser,
  login,
  logout,
  signup,
  sendVerificationEmail,
} from "../controllers/user-controller";
import { isAuthenticated } from "../middlewares/authentication";

const router = express.Router();

router.get("/", isAuthenticated, getAllUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verification-email", sendVerificationEmail);
export default router;
