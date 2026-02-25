import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION?.trim();
const bucket = process.env.AWS_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

console.log('🔍 S3 Configuration Check:');
console.log('AWS_REGION:', region || '❌ Missing');
console.log('AWS_S3_BUCKET:', bucket || '❌ Missing');
console.log('AWS_ACCESS_KEY_ID:', accessKeyId ? '✅ Set' : '❌ Missing');
console.log('AWS_SECRET_ACCESS_KEY:', secretAccessKey ? '✅ Set' : '❌ Missing');

if (!region || !bucket || !accessKeyId || !secretAccessKey) {
  console.error('❌ S3 Configuration is incomplete. Uploads will fail.');
}

const s3 = new S3Client({
  region: region!,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
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
