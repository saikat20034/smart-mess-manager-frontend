/**
 * Application Global Constants
 */
export const LIVE_SITE_URL = 'https://smart-mess-manager-theta.vercel.app';

/**
 * Returns the effective live base URL for invitations and links.
 * If running locally, falls back to the live production URL with the website name.
 */
export const getLiveBaseUrl = () => {
  if (
    typeof window !== 'undefined' &&
    window.location.hostname &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  ) {
    return window.location.origin;
  }
  return LIVE_SITE_URL;
};
