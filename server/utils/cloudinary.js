import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});


const uploadOnCloudinary = async(url)=>{
    try{
      console.log("i am in cloudinary");
      if(!url) return null
      console.log(url);
      const response= await cloudinary.uploader.upload(url,{
        resource_type:'auto',
        folder: 'uploads'
      })
      console.log('file uploaded on cloudinary!')
      console.log(response.url)
      return response.url
    }
    catch(error){
      console.log("error from cloudinary",error.message)
        fs.unlinkSync(url)
        return null
    }
}

export {uploadOnCloudinary }