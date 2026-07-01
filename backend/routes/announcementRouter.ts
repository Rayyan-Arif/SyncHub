import express, { Router } from "express";
import { isOrganizationPermission, protect } from "../controllers/auth.js";
import { createAnnouncement, getAllAnnouncements, removeAnnouncement } from "../controllers/announcement.js";

const router: Router = express.Router();

router.use(protect);

//manager routes
router.post("/create", isOrganizationPermission(["MANAGER"]), createAnnouncement);
router.delete("/remove", isOrganizationPermission(["MANAGER"]), removeAnnouncement);

//user routes
router.get("/all", isOrganizationPermission(['MANAGER', 'MEMBER']), getAllAnnouncements);

export default router;