import { Router } from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  uploadProfilePicture,
  getEmployeeStats,
} from '../controllers/employee.controller';
import authenticateJWT from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/rbac.middleware';
import { validateSchema } from '../middlewares/validate.middleware';
import {
  employeeQuerySchema,
  updateProfileSchema,
  adminUpdateEmployeeSchema,
} from '../validators/employee.validator';
import { uploadProfilePicture as multerProfilePic } from '../utils/multer';

const router = Router();

// All employee routes require authentication
router.use(authenticateJWT);

// ─── Stats (must be before /:id so it's not treated as an ID) ────────────────

// GET /api/employees/stats
router.get(
  '/stats',
  authorizeRoles('Admin', 'HR'),
  getEmployeeStats
);

// ─── Collection Routes ────────────────────────────────────────────────────────

// GET /api/employees?page=1&limit=10&search=john&department=...
router.get(
  '/',
  authorizeRoles('Admin', 'HR', 'Manager'),
  validateSchema(employeeQuerySchema),  // validates & parses query params
  getAllEmployees
);

// ─── Single Resource Routes ───────────────────────────────────────────────────

// GET /api/employees/:id  — Admin/HR can view any; Employee can view own
router.get('/:id', getEmployeeById);

// PUT /api/employees/:id  — Admin gets full payload; Employee gets limited fields
// The controller itself enforces which fields are applied based on role
router.put(
  '/:id',
  (req, res, next) => {
    // Dynamically pick the right validation schema based on caller's role
    const isAdminOrHR =
      req.user?.role === 'Admin' || req.user?.role === 'HR';
    const schema = isAdminOrHR ? adminUpdateEmployeeSchema : updateProfileSchema;
    return validateSchema(schema)(req, res, next);
  },
  updateEmployee
);

// DELETE /api/employees/:id  — Admin only (soft-delete)
router.delete('/:id', authorizeRoles('Admin'), deleteEmployee);

// PATCH /api/employees/:id/profile-picture  — Self or Admin
router.patch(
  '/:id/profile-picture',
  multerProfilePic, // runs multer before the controller
  uploadProfilePicture
);

export default router;
