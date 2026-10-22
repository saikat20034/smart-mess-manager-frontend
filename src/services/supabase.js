import { createClient } from '@supabase/supabase-js';

const getEnvOrStorage = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key.toLowerCase()) || localStorage.getItem(`smm_${key.toLowerCase()}`) || '';
  }
  return '';
};

const supabaseUrl = getEnvOrStorage('VITE_SUPABASE_URL') || '';
const supabaseAnonKey = getEnvOrStorage('VITE_SUPABASE_ANON_KEY') || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseCredentials() {
  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
    isConfigured: isSupabaseConfigured
  };
}

export function setCustomSupabaseConfig(url, key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('smm_vite_supabase_url', (url || '').trim());
    localStorage.setItem('smm_vite_supabase_anon_key', (key || '').trim());
    window.location.reload();
  }
}

export function clearCustomSupabaseConfig() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('smm_vite_supabase_url');
    localStorage.removeItem('smm_vite_supabase_anon_key');
    window.location.reload();
  }
}
