import Express from "express";
import { isOrganizationPermission, isTeamOfOrganization, protect } from "../controllers/auth.js";
import { addMemberToProject, createProject, getAllProjects, getProjectDetails, removeMemberFromProject, removeProject } from "../controllers/project.js";

const router = Express.Router();

router.use(protect);

//manager routes
router.get("/details/:project_id", isOrganizationPermission(['MANAGER']), isTeamOfOrganization, getProjectDetails);

router.post("/create", isOrganizationPermission(['MANAGER']), isTeamOfOrganization, createProject);
router.delete("/delete", isOrganizationPermission(['MANAGER']), isTeamOfOrganization, removeProject);

router.post("/add-member", isOrganizationPermission(['MANAGER']), isTeamOfOrganization, addMemberToProject);
router.delete("/remove-member", isOrganizationPermission(['MANAGER']), isTeamOfOrganization, removeMemberFromProject);

//user routes
router.get("/all", isOrganizationPermission(['MANAGER', 'MEMBER']), getAllProjects);

export default router;