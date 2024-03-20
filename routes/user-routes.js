import express from "express";
import {
  getAllUser,
  login,
  logout,
  signup,
} from "../controllers/user-controller";
import { isAuthenticated } from "../middlewares/authentication";

const router = express.Router();

router.get("/", isAuthenticated, getAllUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
export default router;
