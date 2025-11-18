import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

console.log('🔍 S3 Configuration Check:');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_S3_BUCKET:', process.env.AWS_BUCKET);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY ? '✅ Set' : '❌ Missing');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_KEY ? '✅ Set' : '❌ Missing');


const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function createPresignedUrl(fileType: string, fileName: string) {
  const key = `uploads/${Date.now()}-${fileName}`;
      console.log('🔵 Generating presigned URL for:', key);


  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  const fileUrl = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
}
