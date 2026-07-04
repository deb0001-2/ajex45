import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  verifyDocument,
  deleteDocument,
} from '../controllers/document.controller';
import authenticateJWT from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/rbac.middleware';
import { uploadDocument as multerDoc } from '../utils/multer';

const router = Router();

router.use(authenticateJWT);

// POST /api/documents/upload
// multerDoc middleware processes the multipart/form-data before the controller
router.post('/upload', multerDoc, uploadDocument);

// GET /api/documents/:userId
router.get('/:userId', getDocuments);

// PATCH /api/documents/:id/verify  — Admin/HR only
router.patch(
  '/:id/verify',
  authorizeRoles('Admin', 'HR'),
  verifyDocument
);

// DELETE /api/documents/:id  — self or Admin
router.delete('/:id', deleteDocument);

export default router;
