const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "inclusiverse-payments";

/**
 * Upload a buffer to Cloudflare R2.
 * @param {Buffer} buffer - The file buffer
 * @param {string} originalName - Original filename (for extension)
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} The public URL of the uploaded file
 */
async function uploadToR2(buffer, originalName, contentType) {
  const ext = originalName.split(".").pop() || "png";
  const key = `payments/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return the public URL (requires R2 bucket to have public access enabled or a custom domain)
  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : `https://${BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

  return publicUrl;
}

module.exports = { uploadToR2 };
