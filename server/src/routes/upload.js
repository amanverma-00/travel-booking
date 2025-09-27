import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { userMiddleware } from '../middleware/authMiddleware.js';

console.log('Upload routes file loaded');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Basic route test without auth
router.get('/ping', (req, res) => {
  console.log('Upload route ping received');
  res.json({
    success: true,
    message: 'Upload routes are working'
  });
});

router.post('/image', userMiddleware, upload.single('image'), uploadImage);

// Add a test route
router.get('/test', userMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication working',
    user: req.user
  });
});

console.log('Upload routes defined');

export default router;