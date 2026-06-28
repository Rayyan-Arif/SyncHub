import express, { Router } from "express";
import { isOrganizationPermission, protect } from "../controllers/auth.js";
import { addUserToOrganization, createOrganization, deleteOrganization, generateReportForAdmin, getOrganizationDetails, removeUserFromOrganization } from "../controllers/organization.js";

const router: Router = express.Router();

router.use(protect);

router.post("/create", createOrganization);

//admin routes
router.get("/performance/:organization_id", isOrganizationPermission(["ADMIN"]), generateReportForAdmin(["MEMBER", "MANAGER"]));
router.post("/add-member/:organization_id", isOrganizationPermission(["ADMIN"]), addUserToOrganization);
router.get("/details/:organization_id", isOrganizationPermission(["ADMIN"]), getOrganizationDetails);
router.delete("/remove-member/:organization_id", isOrganizationPermission(["ADMIN"]), removeUserFromOrganization);
router.delete("/delete/:organization_id", isOrganizationPermission(["ADMIN"]), deleteOrganization);

export default router;