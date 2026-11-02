/**
 * Cloudinary Direct Upload Service for Smart Mess Manager
 * Enables high-performance, direct client-side image uploads to Cloudinary CDN.
 * Replaces heavy Base64 strings with lightweight, fast, secure HTTPS URLs.
 */

export const getCloudinaryConfig = () => {
  let storedConfig = null;
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('smm_cloudinary_config');
      if (raw) storedConfig = JSON.parse(raw);
    }
  } catch (e) {}

  const envCloudName = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME) || '';
  const envPreset = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET) || '';

  // Allow storage overrides even if set to empty string
  const cloudName = storedConfig && storedConfig.cloudName !== undefined ? storedConfig.cloudName : envCloudName;
  const uploadPreset = storedConfig && storedConfig.uploadPreset !== undefined ? storedConfig.uploadPreset : envPreset;

  return {
    cloudName: (cloudName || '').trim(),
    uploadPreset: (uploadPreset || '').trim()
  };
};

export const isCloudinaryConfigured = () => {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  return Boolean(cloudName && uploadPreset);
};

export const saveCloudinaryConfig = ({ cloudName, uploadPreset }) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(
      'smm_cloudinary_config',
      JSON.stringify({
        cloudName: (cloudName || '').trim(),
        uploadPreset: (uploadPreset || '').trim()
      })
    );
  }
};

/**
 * Upload an image directly to Cloudinary using an unsigned upload preset.
 * @param {File|Blob} file The image file to upload
 * @param {Object} options Options including folder, onProgress callback
 * @returns {Promise<{url: string, publicId: string, width: number, height: number}>}
 */
export const uploadImageToCloudinary = async (file, { folder = 'smart_mess_manager', onProgress } = {}) => {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset) {
    const error = new Error('CLOUDINARY_NOT_CONFIGURED');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw error;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  // Use fetch if XMLHttpRequest is unavailable (e.g. Node/SSR/testing) or no progress tracking requested
  if (typeof XMLHttpRequest === 'undefined') {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const errRes = await res.json().catch(() => ({}));
      throw new Error(errRes.error?.message || `Upload failed with status ${res.status}`);
    }
    const data = await res.json();
    return {
      url: data.secure_url || data.url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes
    };
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            url: res.secure_url || res.url,
            publicId: res.public_id,
            width: res.width,
            height: res.height,
            format: res.format,
            bytes: res.bytes
          });
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Upload failed with status ${xhr.status}`));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during Cloudinary upload'));
    };

    xhr.send(formData);
  });
};

/**
 * Client-side lightweight image compression fallback.
 * Ensures that if Cloudinary is not yet configured, files are compressed
 * down to tiny sizes (<40KB) rather than multi-megabyte base64 strings.
 */
export const compressImageFallback = (file, maxWidth = 300, maxHeight = 300, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Transform Cloudinary URL with dynamic resizing and optimization.
 */
export const getOptimizedCloudinaryUrl = (url, { width = 200, height = 200, crop = 'fill' } = {}) => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }
  const transform = `c_${crop},w_${width},h_${height},q_auto,f_auto`;
  return url.replace('/upload/', `/upload/${transform}/`);
};
