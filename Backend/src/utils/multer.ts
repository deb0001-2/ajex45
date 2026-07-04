import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from './ApiError';

// ─── Ensure the uploads directory exists ──────────────────────────────────────

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─── Storage configuration ────────────────────────────────────────────────────
// Defines WHERE to save files and WHAT to name them.
//
// Analogy: Think of this as the filing cabinet rules:
//   - Which drawer to put the file in (destination)
//   - What label to put on it (filename)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Unique name: timestamp + random + original extension
    // e.g. "1720000000000-abc123def.pdf"
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// ─── File filter ──────────────────────────────────────────────────────────────
// Only allow safe, expected file types.

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new ApiError(
        400,
        'Invalid file type. Allowed: JPEG, PNG, WEBP, PDF, DOC, DOCX'
      ) as unknown as null,
      false
    );
  }
};

// ─── Max file size ────────────────────────────────────────────────────────────

const MAX_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB ?? 5);

// ─── Profile picture upload (images only, 2MB max) ───────────────────────────

const uploadProfilePicture = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const IMAGES_ONLY = ['image/jpeg', 'image/png', 'image/webp'];
    if (IMAGES_ONLY.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ApiError(400, 'Profile picture must be JPEG, PNG, or WEBP.') as unknown as null,
        false
      );
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single('profilePicture'); // field name in the form

// ─── Document upload (PDFs + images, configurable max size) ──────────────────

const uploadDocument = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
}).single('document'); // field name in the form

export { uploadProfilePicture, uploadDocument };
