const axios = require("axios");
const FormData = require("form-data");

const OCR_API_KEY = process.env.OCR_API_KEY || "K86104771488957"; // free key fallback

/**
 * Run OCR on an image buffer using OCR.space free API.
 * @param {Buffer} imageBuffer - The image file buffer
 * @param {string} filename - Original filename (for mime type hint)
 * @returns {Promise<string>} The extracted text from the image
 */
async function extractTextFromImage(imageBuffer, filename) {
  const form = new FormData();
  form.append("file", imageBuffer, { filename, contentType: "image/png" });
  form.append("apikey", OCR_API_KEY);
  form.append("language", "eng");
  form.append("isOverlayRequired", "false");
  form.append("detectOrientation", "true");
  form.append("scale", "true");
  form.append("OCREngine", "2"); // Engine 2 is better for screenshots

  const response = await axios.post("https://api.ocr.space/parse/image", form, {
    headers: form.getHeaders(),
    timeout: 15000, // 15 second timeout
  });

  if (response.data.IsErroredOnProcessing) {
    const errorMsg = response.data.ErrorMessage?.[0] || "OCR processing failed";
    throw new Error(errorMsg);
  }

  const parsedResults = response.data.ParsedResults;
  if (!parsedResults || parsedResults.length === 0) {
    return "";
  }

  return parsedResults.map((r) => r.ParsedText || "").join(" ");
}

/**
 * Analyze OCR text to determine if payment was successful.
 * @param {string} text - The extracted text from OCR
 * @param {number} expectedAmount - The expected payment amount
 * @returns {{ isValid: boolean, confidence: string, reasons: string[] }}
 */
function analyzePaymentText(text, expectedAmount) {
  const normalizedText = text.toLowerCase().replace(/[,\s]+/g, " ");
  const reasons = [];

  // Check for success indicators
  const successKeywords = [
    "successful", "success", "completed", "paid", "done",
    "payment successful", "transaction successful", "money sent",
    "sent to", "credited", "debited", "transfer complete",
    "upi transaction", "google pay",
  ];
  const hasSuccessKeyword = successKeywords.some((kw) => normalizedText.includes(kw));
  if (hasSuccessKeyword) reasons.push("Found success keyword");

  // Check for failure indicators
  const failKeywords = ["failed", "declined", "rejected", "error", "insufficient", "pending"];
  const hasFailKeyword = failKeywords.some((kw) => normalizedText.includes(kw));
  if (hasFailKeyword) reasons.push("Found failure keyword");

  // Check for the expected amount
  const amountStr = String(expectedAmount);
  // Look for the amount with various formats: "₹49", "49.00", "Rs 49", "INR 49"
  const amountPatterns = [
    amountStr,
    `${amountStr}.00`,
    `${amountStr}.0`,
  ];
  const hasAmount = amountPatterns.some((p) => normalizedText.includes(p));
  if (hasAmount) reasons.push(`Found amount ₹${expectedAmount}`);

  // Determine confidence
  if (hasFailKeyword) {
    return { isValid: false, confidence: "high", reasons };
  }

  if (hasSuccessKeyword && hasAmount) {
    return { isValid: true, confidence: "high", reasons };
  }

  if (hasSuccessKeyword || hasAmount) {
    return { isValid: false, confidence: "low", reasons: [...reasons, "Partial match — needs manual review"] };
  }

  return { isValid: false, confidence: "none", reasons: ["No recognizable payment info found"] };
}

module.exports = { extractTextFromImage, analyzePaymentText };
