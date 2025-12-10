const cloudinary = require('../config/cloudinary');

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'ecommerce/products',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    throw new Error('Error al subir imagen a Cloudinary');
  }
};

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    return false;
  }
};

module.exports = {
  uploadImage,
  deleteImage
};