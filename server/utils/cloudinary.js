import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'uploads' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);  // Reject the promise if there's an error
        } else {
          console.log('File uploaded to Cloudinary!', result.secure_url);
          resolve(result.secure_url);  // Resolve with the URL
        }
      }
    );

    uploadStream.end(file.buffer);  // Use the buffer from the file
  });
};

export { uploadOnCloudinary };
