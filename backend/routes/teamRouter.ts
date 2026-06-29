import Express, { Router } from "express";
import { isOrganizationPermission, protect } from "../controllers/auth.js";
import { addMemberToTeam, createTeam, getAllTeamsOfManager, getTeamDetails, removeMemberFromTeam, removeTeam } from "../controllers/team.js";

const router: Router = Express.Router();

router.use(protect);

//manager routes
router.get("/all/:organization_id", isOrganizationPermission(['MANAGER']), getAllTeamsOfManager);
router.get("/:organization_id/team/:team_id", isOrganizationPermission(['MANAGER']), getTeamDetails);
router.post("/create", isOrganizationPermission(['MANAGER', 'ADMIN']), createTeam);
router.delete("/delete", isOrganizationPermission(['MANAGER', 'ADMIN']), removeTeam);
router.post("/add-member", isOrganizationPermission(['MANAGER', 'ADMIN']), addMemberToTeam);
router.delete("/remove-member", isOrganizationPermission(['MANAGER', 'ADMIN']), removeMemberFromTeam);

export default router;