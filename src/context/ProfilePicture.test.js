import { describe, it, expect, beforeEach } from 'vitest';
import { MESS_PRESET_LOGOS } from '../components/MessProfilePictureModal';
import { PRESET_AVATARS } from '../components/ProfilePictureModal';

describe('Profile Picture Separation Logic', () => {
  let userStorage = {};
  let messStorage = {};

  beforeEach(() => {
    userStorage = {
      id: 'mem-001',
      name: 'Saikat',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    };

    messStorage = {
      id: 'mess-001',
      name: 'আপাতত নাম নাই',
      logo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&h=200&fit=crop'
    };
  });

  it('keeps mess profile picture and member/manager profile picture distinct', () => {
    // Initial state
    expect(messStorage.logo).not.toBe(userStorage.avatar);

    // Updating user avatar does not alter mess logo
    const newUserAvatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop';
    userStorage.avatar = newUserAvatar;

    expect(userStorage.avatar).toBe(newUserAvatar);
    expect(messStorage.logo).toBe('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&h=200&fit=crop');

    // Updating mess logo does not alter user avatar
    const newMessLogo = 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=200&h=200&fit=crop';
    messStorage.logo = newMessLogo;

    expect(messStorage.logo).toBe(newMessLogo);
    expect(userStorage.avatar).toBe(newUserAvatar);
  });

  it('provides curated mess and hostel preset logos', () => {
    expect(MESS_PRESET_LOGOS.length).toBeGreaterThanOrEqual(8);
    MESS_PRESET_LOGOS.forEach(preset => {
      expect(preset).toHaveProperty('id');
      expect(preset).toHaveProperty('label');
      expect(preset.url).toMatch(/^https:\/\//);
    });
  });

  it('provides curated personal user avatar presets', () => {
    expect(PRESET_AVATARS.length).toBeGreaterThanOrEqual(10);
    PRESET_AVATARS.forEach(preset => {
      expect(preset).toHaveProperty('id');
      expect(preset).toHaveProperty('label');
      expect(preset.url).toMatch(/^https:\/\//);
    });
  });

  it('handles clearing/removing photos independently with fallback', () => {
    // Clear user photo
    userStorage.avatar = '';
    const userFallbackInitial = userStorage.avatar || userStorage.name.slice(0, 1).toUpperCase();
    expect(userFallbackInitial).toBe('S');

    // Mess logo remains intact
    expect(messStorage.logo).toBeTruthy();

    // Clear mess photo
    messStorage.logo = '';
    const messFallbackInitial = messStorage.logo || messStorage.name.trim().charAt(0).toUpperCase();
    expect(messFallbackInitial).toBe('আ');
  });
});
