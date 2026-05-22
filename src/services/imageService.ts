import imageCompression from 'browser-image-compression';

export const imageService = {
  // Compress and prepare image for Firestore storage
  async compressImage(imageFile: File): Promise<string> {
    try {
      console.log('Original image size:', imageFile.size / 1024, 'KB');

      const options = {
        maxSizeMB: 0.2, // Maximum 200KB
        maxWidthOrHeight: 512, // Maximum dimensions
        useWebWorker: true,
        fileType: 'image/jpeg',
        quality: 0.7, // JPEG quality 70%
      };

      // Compress the image
      const compressedFile = await imageCompression(imageFile, options);
      console.log('Compressed image size:', compressedFile.size / 1024, 'KB');

      // Convert to data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          console.log('Data URL created, length:', dataUrl.length);
          resolve(dataUrl);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read compressed image'));
        };
        reader.readAsDataURL(compressedFile);
      });
    } catch (err) {
      console.error('Error compressing image:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to compress image');
    }
  },

  // Validate image file
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file size (max 5MB for input)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'Image size must be less than 5MB' };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select a valid image file' };
    }

    // Check specific formats
    const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      return { valid: false, error: 'Supported formats: PNG, JPG, GIF, WebP' };
    }

    return { valid: true };
  },
};
