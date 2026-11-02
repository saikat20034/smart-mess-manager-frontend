import { describe, it, expect, beforeEach } from 'vitest';

const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i] || null
};

import {
  getCloudinaryConfig,
  isCloudinaryConfigured,
  saveCloudinaryConfig,
  uploadImageToCloudinary,
  getOptimizedCloudinaryUrl
} from './cloudinary.js';

describe('Cloudinary Service Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('detects unconfigured Cloudinary by default when storage is empty', () => {
    const config = getCloudinaryConfig();
    if (!config.cloudName || !config.uploadPreset) {
      expect(isCloudinaryConfigured()).toBe(false);
    }
  });

  it('saves and reads Cloudinary configuration from storage', () => {
    saveCloudinaryConfig({ cloudName: 'test-cloud-123', uploadPreset: 'test-preset-456' });
    expect(isCloudinaryConfigured()).toBe(true);
    const config = getCloudinaryConfig();
    expect(config.cloudName).toBe('test-cloud-123');
    expect(config.uploadPreset).toBe('test-preset-456');
  });

  it('transforms Cloudinary URL with optimization parameters', () => {
    const rawUrl = 'https://res.cloudinary.com/test-cloud/image/upload/v12345/sample.jpg';
    const optimized = getOptimizedCloudinaryUrl(rawUrl, { width: 300, height: 300 });
    expect(optimized).toBe('https://res.cloudinary.com/test-cloud/image/upload/c_fill,w_300,h_300,q_auto,f_auto/v12345/sample.jpg');
  });

  it('leaves non-Cloudinary URLs unchanged', () => {
    const regularUrl = 'https://images.unsplash.com/photo-12345';
    expect(getOptimizedCloudinaryUrl(regularUrl)).toBe(regularUrl);
  });

  it('throws CLOUDINARY_NOT_CONFIGURED if uploading without configuration', async () => {
    saveCloudinaryConfig({ cloudName: '', uploadPreset: '' });
    const dummyBlob = new Blob(['dummy'], { type: 'image/png' });
    await expect(uploadImageToCloudinary(dummyBlob)).rejects.toThrow('CLOUDINARY_NOT_CONFIGURED');
  });
});
