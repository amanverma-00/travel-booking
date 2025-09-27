import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (file, folder = 'wanderlust') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto:good' },
      ],
      format: 'auto',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export const uploadMultipleImages = async (files, folder = 'wanderlust') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

export const uploadFromUrl = async (imageUrl, folder = 'wanderlust', filename = null) => {
  try {
    const options = {
      folder: folder,
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto:good' },
      ],
      format: 'auto',
    };
    
    if (filename) {
      options.public_id = `${folder}/${filename}`;
    }

    const result = await cloudinary.uploader.upload(imageUrl, options);

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`Image upload from URL failed: ${error.message}`);
  }
};