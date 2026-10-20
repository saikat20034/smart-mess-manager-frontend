import { useState, useEffect } from 'react';

/**
 * Custom hook providing a 1-second real-time ticking clock and localized date
 * Supports Bengali (বাংলা) and English formatting
 */
export function useLiveClock(isBn = true) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBnDigits = (str) => String(str).replace(/[0-9]/g, (w) => bnDigits[Number(w)]);

  const bnDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const bnMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const enMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayOfWeek = isBn ? bnDays[now.getDay()] : enDays[now.getDay()];
  const day = now.getDate();
  const month = isBn ? bnMonths[now.getMonth()] : enMonths[now.getMonth()];
  const year = now.getFullYear();

  // 12-hour format with AM/PM
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = String(hours).padStart(2, '0');

  const rawTimeStr = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  const liveTimeStr = isBn ? toBnDigits(rawTimeStr) : rawTimeStr;

  const rawDateShort = `${day} ${month}`;
  const liveDateShort = isBn ? `${toBnDigits(day)} ${month}` : rawDateShort;

  const rawDateFull = `${dayOfWeek}, ${day} ${month} ${year}`;
  const liveDateFull = isBn ? `${dayOfWeek}, ${toBnDigits(day)} ${month} ${toBnDigits(year)}` : rawDateFull;

  return {
    now,
    liveTimeStr,
    liveDateShort,
    liveDateFull,
    dayOfWeek
  };
}
