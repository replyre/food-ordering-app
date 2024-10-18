import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { Buffer } from "buffer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const data = await req.formData();

    
    const folder = data.get("food-ordering-app"); 

    if (data.get("file")) {
      const file = data.get("file");

      // Collect the file chunks into a buffer
      const chunks = [];
      for await (const chunk of file.stream()) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Upload the buffer to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${file.type};base64,${buffer.toString("base64")}`,
        {
          folder: `food-ordering-app/${folder}`, 
          resource_type: "auto",
        }
      );

      return NextResponse.json({ success: true, link: result.secure_url });
    }

    return NextResponse.json({ success: false, message: "No file uploaded." });
  } catch (err) {
    console.error("File upload error:", err);

    return NextResponse.json({
      success: false,
      message: "File upload failed.",
      error: err.message,
    });
  }
}
