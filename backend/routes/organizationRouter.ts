import express, { Router } from "express";
import { isOrganizationPermission, protect } from "../controllers/auth.js";
import { addUserToOrganization, createOrganization, deleteOrganization, generateReportForAdmin, getAllOrganizations, getOrganizationDetailsForAdmin, getOrganizationTeamsForMember, removeUserFromOrganization } from "../controllers/organization.js";

const router: Router = express.Router();

router.use(protect);

router.post("/create", createOrganization);

//admin routes
router.get("/performance/:organization_id", isOrganizationPermission(["ADMIN"]), generateReportForAdmin(["MEMBER", "MANAGER"]));
router.post("/add-member/:organization_id", isOrganizationPermission(["ADMIN"]), addUserToOrganization);
router.get("/details/:organization_id", isOrganizationPermission(["ADMIN"]), getOrganizationDetailsForAdmin);
router.delete("/remove-member/:organization_id", isOrganizationPermission(["ADMIN"]), removeUserFromOrganization);
router.delete("/delete/:organization_id", isOrganizationPermission(["ADMIN"]), deleteOrganization);

//member routes
router.get("/all", getAllOrganizations);
router.get("/teams/:organization_id", isOrganizationPermission(['MANAGER','MEMBER']), getOrganizationTeamsForMember);

export default router;