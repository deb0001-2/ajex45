import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller';
import authenticateJWT from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post('/register', validateSchema(registerSchema), register);

// POST /api/auth/login
router.post('/login', validateSchema(loginSchema), login);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  validateSchema(forgotPasswordSchema),
  forgotPassword
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  validateSchema(resetPasswordSchema),
  resetPassword
);

// ─── Protected Routes ─────────────────────────────────────────────────────────

// GET /api/auth/me
router.get('/me', authenticateJWT, getMe);

export default router;
