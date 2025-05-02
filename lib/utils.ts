import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency (USD by default)
 * @param value The number to format
 * @param currency The currency code (default: "USD")
 * @param locale The locale to use for formatting (default: "en-US")
 * @returns A formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
  value: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Get public URL for an image from Supabase storage
 * @param filePath The file path in the storage bucket
 * @param bucket The storage bucket name (default: "campaign_images")
 * @returns The public URL for the image
 */
export function getImageUrl(filePath: string, bucket = "campaign_images"): string {
  if (!filePath) return "";
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
}

/**
 * Sanitizes a filename to ensure it's compatible with storage systems
 * Removes or replaces special characters, spaces, and other problematic characters
 * 
 * @param fileName The original file name to sanitize
 * @returns An object containing the sanitized file name and any validation errors
 */
export function sanitizeFileName(fileName: string): { 
  sanitizedName: string;
  error: string | null;
  originalName: string;
} {
  if (!fileName) {
    return { 
      sanitizedName: '', 
      error: 'No file name provided',
      originalName: fileName 
    };
  }

  const originalName = fileName;
  
  // Get the file extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : '';
  const nameWithoutExtension = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
  
  // Replace special characters, parentheses, etc. with hyphens
  const sanitized = nameWithoutExtension
    .replace(/[()[\]{}!@#$%^&*=+\\|;:'",<>/?]/g, '-') // Replace special chars with hyphens
    .replace(/\s+/g, '-')                            // Replace spaces with hyphens
    .replace(/--+/g, '-')                           // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '')                        // Remove hyphens from start and end
    .replace(/[^\w\-\.]/g, '')                       // Remove any remaining non-alphanumeric chars
    .trim();
  
  // Combine sanitized name with extension
  const sanitizedName = sanitized + extension;
  
  // Check if the sanitized name is valid
  if (sanitizedName.length === 0 || sanitizedName === extension) {
    return { 
      sanitizedName: 'untitled' + extension, 
      error: 'File name contains only invalid characters',
      originalName 
    };
  }
  
  // Check if any sanitization was performed
  const hasChanged = sanitizedName !== originalName;
  
  return {
    sanitizedName,
    error: hasChanged ? null : null, // No error if sanitization was successful
    originalName
  };
}

/**
 * Creates a URL-friendly slug from a string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}


