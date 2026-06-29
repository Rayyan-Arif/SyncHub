import Express, { Router } from "express";
import { isOrganizationPermission, isProjectAccessAllowed, protect } from "../controllers/auth.js";
import { createTask, removeTask } from "../controllers/task.js";

const router: Router = Express.Router();

router.use(protect);

//manager routes
router.post("/create", isOrganizationPermission(['MANAGER']), isProjectAccessAllowed, createTask);
router.delete("/remove", isOrganizationPermission(['MANAGER']), isProjectAccessAllowed, removeTask);

export default router;