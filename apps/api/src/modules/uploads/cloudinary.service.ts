import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("🔍 Cloudinary Configuration Check:");
console.log("CLOUDINARY_CLOUD_NAME:", cloudName || "❌ Missing");
console.log("CLOUDINARY_API_KEY:", apiKey ? "✅ Set" : "❌ Missing");
console.log("CLOUDINARY_API_SECRET:", apiSecret ? "✅ Set" : "❌ Missing");

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ Cloudinary Configuration is incomplete. Uploads will fail.");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function uploadToCloudinary(
  fileBase64: string,
  fileName: string
): Promise<string> {
  console.log("🔵 Uploading to Cloudinary:", fileName);

  const result = await cloudinary.uploader.upload(fileBase64, {
    folder: "uploads",
    resource_type: "auto",
  });

  console.log("✅ Cloudinary upload complete:", result.secure_url);
  return result.secure_url;
}
