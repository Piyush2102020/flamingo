const cloudinary=require('cloudinary').v2;


/**
 * Cloudinary Configuration Module
 * 
 * This module sets up and exports the configured Cloudinary instance
 * to be used across the application for media uploads and management.
 * 
 * Environment Variables Required:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */
cloudinary.config(
    {
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    }
)



module.exports=cloudinary;