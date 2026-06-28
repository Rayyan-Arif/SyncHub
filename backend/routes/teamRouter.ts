import Express, { Router } from "express";
import { isOrganizationPermission, protect } from "../controllers/auth.js";
import { createTeam, getAllTeamsOfManager, getTeamDetails } from "../controllers/team.js";

const router: Router = Express.Router();

router.use(protect);

//manager routes
router.get("/all/:organization_id", isOrganizationPermission(['MANAGER']), getAllTeamsOfManager);
router.get("/:organization_id/team/:team_id", isOrganizationPermission(['MANAGER']), getTeamDetails);
router.post("/create", isOrganizationPermission(['MANAGER']), createTeam);

export default router;