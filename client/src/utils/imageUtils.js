export const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

/**
 * Normalizes any image input (string, object with url/secure_url, relative path)
 * into a safe, absolute image URL with fallback.
 */
export const getImageUrl = (imageInput, fallback = DEFAULT_PLACEHOLDER_IMAGE) => {
  if (!imageInput) return fallback;

  let url = '';

  if (typeof imageInput === 'string') {
    url = imageInput;
  } else if (typeof imageInput === 'object' && imageInput !== null) {
    url = imageInput.url || imageInput.secure_url || imageInput.preview || imageInput.src || imageInput.path || '';
  }

  if (!url || typeof url !== 'string') return fallback;

  // Prevent invalid '[object Object]' strings
  if (url.includes('[object Object]')) return fallback;

  // Handle local uploaded relative paths
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:3000${cleanPath}`;
  }

  return url;
};

/**
 * Image onError handler to prevent broken image icons by switching to fallback.
 */
export const handleImageError = (e, fallback = DEFAULT_PLACEHOLDER_IMAGE) => {
  if (e && e.target && e.target.src !== fallback) {
    e.target.onerror = null; // Prevent infinite loop if fallback fails
    e.target.src = fallback;
  }
};
