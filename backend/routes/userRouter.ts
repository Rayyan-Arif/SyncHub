import express, { Router } from "express";
import { isAccessAllowed, login, logout, protect, signup } from "../controllers/auth.js";
import { getMe, getOwnerStats} from "../controllers/user.js";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.use(protect);
router.get("/me", getMe);

router.get("/owner/stats", isAccessAllowed(["OWNER"]), getOwnerStats);

router.post("/logout", logout);

export default router;