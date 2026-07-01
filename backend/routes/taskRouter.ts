import Express, { Router } from "express";
import { isOrganizationPermission, isProjectAccessAllowed, protect } from "../controllers/auth.js";
import { assignTaskToMember, createTask, generateReportForManager, getAssignedTasks, removeTask, unassignTaskFromMember, updateTaskStatus } from "../controllers/task.js";

const router: Router = Express.Router();

router.use(protect);

//manager routes
router.post("/create", isOrganizationPermission(['MANAGER']), isProjectAccessAllowed, createTask);
router.delete("/remove", isOrganizationPermission(['MANAGER']), isProjectAccessAllowed, removeTask);
router.post("/assign", isOrganizationPermission(['MANAGER']), isProjectAccessAllowed, assignTaskToMember);
router.delete("/unassign", isOrganizationPermission(['MANAGER']), isProjectAccessAllowed, unassignTaskFromMember);
router.get("/performance/:organization_id", isOrganizationPermission(['MANAGER']), generateReportForManager);

//user routes
router.patch("/assigned/update-status", isOrganizationPermission(['MEMBER']), updateTaskStatus);
router.get("/assigned", isOrganizationPermission(['MEMBER']), getAssignedTasks);

export default router;