/**
 * Email Verification Service for Smart Mess Manager
 * Powered by Live Backend on Vercel with Gmail SMTP
 * Sender: mazharulislamsaikat2000@gmail.com
 */

const API_BASE = import.meta.env.VITE_BACKEND_API_URL || 'https://backend-beta-nine-67.vercel.app';

/**
 * Send 6-digit verification OTP to user's real email address
 * @param {Object} params
 * @param {string} params.email - Target recipient email
 * @param {string} [params.name] - User full name
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendVerificationOTP({ email, name }) {
  if (!email || !email.includes('@')) {
    throw new Error('দয়া করে একটি সঠিক ইমেইল এড্রেস লিখুন');
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const res = await fetch(`${API_BASE}/api/auth/send-verification-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: cleanEmail, name: name || 'মেস মেম্বার' })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return data;
    }

    throw new Error(data.error || 'ইমেইল পাঠাতে সমস্যা হয়েছে। দয়া করে সঠিক ইমেইল দিন।');
  } catch (err) {
    console.error('❌ [EMAIL SEND ERROR]:', err);
    throw new Error(err.message || 'ভেরিফিকেশন কোড পাঠানো সম্ভব হয়নি। ইন্টারনেট সংযোগ চেক করুন।');
  }
}

/**
 * Verify 6-digit OTP code against the live backend
 * @param {Object} params
 * @param {string} params.email - Recipient email
 * @param {string} params.code - 6-digit code
 * @returns {Promise<{success: boolean, verified: boolean, message: string}>}
 */
export async function verifyOTP({ email, code }) {
  if (!email || !code) {
    throw new Error('ইমেইল এবং ৬-ডিজিটের কোড প্রয়োজন');
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = code.toString().trim();

  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: cleanEmail, code: cleanCode })
    });

    const data = await res.json();
    if (res.ok && data.success && data.verified) {
      return data;
    }

    throw new Error(data.error || 'ভুল ভেরিফিকেশন কোড! দয়া করে ইনবক্স চেক করে সঠিক কোড দিন।');
  } catch (err) {
    throw new Error(err.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
  }
}
