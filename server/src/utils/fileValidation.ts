import path from 'path';
import fs from 'fs';

/**
 * Validates and sanitizes file paths to prevent path traversal attacks
 * @param filename - The filename from user input
 * @param uploadDir - The base upload directory (absolute path)
 * @returns Secure file path or throws error
 */
export function getSecureFilePath(filename: string, uploadDir: string): string {
  // Remove any null bytes
  const sanitizedFilename = filename.replace(/\0/g, '');
  
  // Check for path traversal attempts
  if (sanitizedFilename.includes('..') || 
      sanitizedFilename.includes('/') || 
      sanitizedFilename.includes('\\')) {
    throw new Error('Invalid filename: Path traversal attempt detected');
  }
  
  // Check for absolute path attempts
  if (path.isAbsolute(sanitizedFilename)) {
    throw new Error('Invalid filename: Absolute paths not allowed');
  }
  
  // Construct the full path
  const fullPath = path.join(uploadDir, sanitizedFilename);
  
  // Resolve to absolute path and verify it's within upload directory
  const resolvedPath = path.resolve(fullPath);
  const resolvedUploadDir = path.resolve(uploadDir);
  
  if (!resolvedPath.startsWith(resolvedUploadDir + path.sep)) {
    throw new Error('Invalid filename: File must be within upload directory');
  }
  
  return resolvedPath;
}

/**
 * Validates file extension
 * @param filename - The filename to validate
 * @param allowedExtensions - Array of allowed extensions (e.g., ['.pdf', '.txt'])
 * @returns true if valid, false otherwise
 */
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}

/**
 * Generates a safe filename from user input
 * @param originalFilename - Original filename from user
 * @returns Sanitized filename
 */
export function sanitizeFilename(originalFilename: string): string {
  // Remove path components
  const basename = path.basename(originalFilename);
  
  // Remove special characters, keep alphanumeric, dash, underscore, and extension
  return basename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Safely deletes a file if it exists
 * @param filePath - Path to file to delete
 */
export async function safeDeleteFile(filePath: string): Promise<void> {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw - file cleanup failure shouldn't break the app
  }
}
