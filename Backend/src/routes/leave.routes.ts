import { Router } from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from '../controllers/leave.controller';
import authenticateJWT from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/rbac.middleware';
import { validateSchema } from '../middlewares/validate.middleware';
import {
  applyLeaveSchema,
  updateLeaveStatusSchema,
} from '../validators/leave.validator';

const router = Router();

router.use(authenticateJWT);

// ─── Employee Routes ──────────────────────────────────────────────────────────

// POST /api/leaves
router.post('/', validateSchema(applyLeaveSchema), applyLeave);

// GET /api/leaves/my-leaves   (must be BEFORE /:id)
router.get('/my-leaves', getMyLeaves);

// ─── Admin/HR Routes ──────────────────────────────────────────────────────────

// GET /api/leaves
router.get('/', authorizeRoles('Admin', 'HR', 'Manager'), getAllLeaves);

// PUT /api/leaves/:id/status
router.put(
  '/:id/status',
  authorizeRoles('Admin', 'HR'),
  validateSchema(updateLeaveStatusSchema),
  updateLeaveStatus
);

export default router;
