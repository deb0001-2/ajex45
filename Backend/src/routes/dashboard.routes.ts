import { Router } from 'express';
import {
  getAdminDashboard,
  getEmployeeDashboard,
} from '../controllers/dashboard.controller';
import authenticateJWT from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticateJWT);

// GET /api/dashboard/admin
router.get(
  '/admin',
  authorizeRoles('Admin', 'HR'),
  getAdminDashboard
);

// GET /api/dashboard/employee
router.get('/employee', getEmployeeDashboard);

export default router;
