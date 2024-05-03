const cloudinaryV2 = require('cloudinary').v2
const dotenv = require("dotenv")

dotenv.config()

const cloudinary = cloudinaryV2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
})

// Helper function to upload files to Cloudinary
const uploadImagesToCloudinary = async (files, parentFolder, subFolder) => {

  // Upload single or multiple files to Cloudinary
  Array.isArray(files) ? files : files ? files = [files] : files = [];

  return await Promise.all(files.map(async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `${parentFolder}/${subFolder}`,
        use_filename: true,
        unique_filename: false,
      });
      return { public_id: result.public_id, url: result.secure_url };
    } catch (error) {
      console.error(`Failed to upload file: ${file.originalname}`, error);
      return null;
    }
  }));
};

module.exports = {cloudinary, uploadImagesToCloudinary };
