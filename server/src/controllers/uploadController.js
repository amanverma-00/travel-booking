import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('User:', req.user);
    console.log('File:', req.file ? 'File present' : 'No file');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('Uploading to Cloudinary...');
    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'wanderlust/listings',
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto' }
      ]
    });

    console.log('Cloudinary upload successful:', result.secure_url);
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
};