import { Router } from 'express';
import {
  generatePayroll,
  getAllPayroll,
  getMySalary,
  updatePayroll,
} from '../controllers/payroll.controller';
import authenticateJWT from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/rbac.middleware';
import { validateSchema } from '../middlewares/validate.middleware';
import {
  generatePayrollSchema,
  updatePayrollSchema,
} from '../validators/payroll.validator';

const router = Router();

router.use(authenticateJWT);

// ─── Employee Routes ──────────────────────────────────────────────────────────

// GET /api/payroll/my-salary  (must be BEFORE /:id)
router.get('/my-salary', getMySalary);

// ─── Admin/HR Routes ──────────────────────────────────────────────────────────

// GET /api/payroll
router.get('/', authorizeRoles('Admin', 'HR'), getAllPayroll);

// POST /api/payroll
router.post(
  '/',
  authorizeRoles('Admin'),
  validateSchema(generatePayrollSchema),
  generatePayroll
);

// PUT /api/payroll/:id
router.put(
  '/:id',
  authorizeRoles('Admin'),
  validateSchema(updatePayrollSchema),
  updatePayroll
);

export default router;
