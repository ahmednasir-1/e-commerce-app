const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload buffer directly to Cloudinary
const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'bookstore/books' },
      (error, result) => {

        if (error) 
          reject(error);
        else 
          resolve(result);
        
      }
    );
    stream.end(fileBuffer);
  });
};

const deleteImage = async (imageUrl) => {
  const parts = imageUrl.split('/');
  const filename = parts[parts.length - 1].split('.')[0];
  const publicId = `bookstore/books/${filename}`;
  await cloudinary.uploader.destroy(publicId);
};

// Multer uses memory storage — file stays in RAM, passed to uploadImage()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG, WebP allowed'));
  },
});

module.exports = { cloudinary, upload, uploadImage, deleteImage };