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

module.exports = cloudinary
