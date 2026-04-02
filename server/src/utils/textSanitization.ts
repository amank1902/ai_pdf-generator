/**
 * Sanitizes text extracted from PDFs to prevent prompt injection attacks
 * @param text - Raw text from PDF
 * @returns Sanitized text safe for AI prompts
 */
export function sanitizeTextForAI(text: string): string {
  // Remove null bytes and control characters
  let sanitized = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove potential prompt injection attempts
  // These patterns try to manipulate the AI's behavior
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|commands?)/gi,
    /disregard\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?)/gi,
    /forget\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?)/gi,
    /new\s+instructions?:/gi,
    /system\s*(prompt|message|instruction):/gi,
    /you\s+are\s+now/gi,
    /act\s+as\s+(if\s+)?you/gi,
    /pretend\s+(that\s+)?you/gi,
    /roleplay\s+as/gi,
  ];
  
  // Replace injection patterns with safe alternatives
  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[CONTENT REMOVED]');
  }
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Limit total length (additional safety)
  const maxLength = 10000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validates extracted text quality
 * @param text - Text to validate
 * @returns Object with validation result and message
 */
export function validateExtractedText(text: string): { 
  valid: boolean; 
  message?: string 
} {
  // Check minimum length
  if (!text || text.trim().length < 100) {
    return {
      valid: false,
      message: 'Extracted text is too short. Please ensure PDF contains readable content.'
    };
  }
  
  // Check if text is mostly gibberish (high ratio of non-alphanumeric chars)
  const alphanumericRatio = (text.match(/[a-zA-Z0-9]/g) || []).length / text.length;
  if (alphanumericRatio < 0.5) {
    return {
      valid: false,
      message: 'Extracted text appears to be corrupted or contains mostly non-readable characters.'
    };
  }
  
  // Check for excessive repetition (possible extraction error)
  const uniqueChars = new Set(text).size;
  if (uniqueChars < 20) {
    return {
      valid: false,
      message: 'Extracted text appears to contain limited variety. PDF may be corrupted.'
    };
  }
  
  return { valid: true };
}

/**
 * Escapes special characters that might break JSON parsing
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeForJSON(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}
