import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  editAttendance,
} from '../controllers/attendance.controller';
import authenticateJWT from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/rbac.middleware';
import { validateSchema } from '../middlewares/validate.middleware';
import {
  checkInSchema,
  checkOutSchema,
  editAttendanceSchema,
} from '../validators/attendance.validator';

const router = Router();

// All attendance routes require authentication
router.use(authenticateJWT);

// ─── Employee Routes ──────────────────────────────────────────────────────────

// POST /api/attendance/check-in
router.post(
  '/check-in',
  authorizeRoles('Employee', 'Manager', 'HR', 'Admin'),
  validateSchema(checkInSchema),
  checkIn
);

// POST /api/attendance/check-out
router.post(
  '/check-out',
  authorizeRoles('Employee', 'Manager', 'HR', 'Admin'),
  validateSchema(checkOutSchema),
  checkOut
);

// GET /api/attendance/my-records
router.get(
  '/my-records',
  getMyAttendance
);

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// GET /api/attendance  — must be BEFORE /:id
router.get(
  '/',
  authorizeRoles('Admin', 'HR'),
  getAllAttendance
);

// PUT /api/attendance/:id
router.put(
  '/:id',
  authorizeRoles('Admin', 'HR'),
  validateSchema(editAttendanceSchema),
  editAttendance
);

export default router;
