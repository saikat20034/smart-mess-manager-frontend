import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Upload,
  Check,
  X,
  Sparkles,
  Link2,
  Trash2,
  Image as ImageIcon,
  Building,
  Home,
  MapPin
} from 'lucide-react';
import { Modal } from './Modal';
import { useMess } from '../context/MessContext';
import { useLanguage } from '../context/LanguageContext';

export const MESS_PRESET_LOGOS = [
  { id: 'mess-1', label: 'Hostel Building', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&h=200&fit=crop' },
  { id: 'mess-2', label: 'University Campus', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=200&h=200&fit=crop' },
  { id: 'mess-3', label: 'Student Dormitory', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=200&fit=crop' },
  { id: 'mess-4', label: 'Mess Dining Hall', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
  { id: 'mess-5', label: 'Delicious Meals', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop' },
  { id: 'mess-6', label: 'Hall & Garden', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop' },
  { id: 'mess-7', label: 'Modern Apartment', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop' },
  { id: 'mess-8', label: 'Mess Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&h=200&fit=crop' },
  { id: 'mess-9', label: 'Student Lounge', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&h=200&fit=crop' },
  { id: 'mess-10', label: 'Study Room', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop' },
  { id: 'mess-11', label: 'Coffee & Breakfast', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop' },
  { id: 'mess-12', label: 'Hostel Evening', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop' }
];

export const MessProfilePictureModal = ({ isOpen, onClose, onPhotoSaved }) => {
  const { mess, updateMessSettings } = useMess();
  const { isBn } = useLanguage();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'presets', 'url'
  const [preview, setPreview] = useState(mess?.logo || '');
  const [customUrl, setCustomUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPreview(mess?.logo || '');
      setCustomUrl('');
      setFileName('');
      setErrorMsg('');
    }
  }, [isOpen, mess?.logo]);

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(isBn ? 'দয়া করে একটি সঠিক ইমেজ ফাইল নির্বাচন করুন' : 'Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(isBn ? 'ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে' : 'Image size must be less than 5MB');
      return;
    }

    setErrorMsg('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setPreview(customUrl.trim());
    setErrorMsg('');
  };

  const handleSelectPreset = (url) => {
    setPreview(url);
    setErrorMsg('');
  };

  const handleRemovePhoto = () => {
    setPreview('');
    setFileName('');
    setCustomUrl('');
    setErrorMsg('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (updateMessSettings) {
        await updateMessSettings({ logo: preview });
      }
      if (onPhotoSaved) {
        onPhotoSaved(preview);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update mess logo:', err);
      setErrorMsg(isBn ? 'মেসের ছবি সংরক্ষণ করতে সমস্যা হয়েছে' : 'Failed to save mess logo');
    } finally {
      setIsSaving(false);
    }
  };

  const initialLetter = mess?.name ? mess.name.trim().charAt(0).toUpperCase() : 'M';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isBn ? 'মেস প্রোফাইল ছবি / লোগো' : 'Mess Profile Picture / Logo'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              {isBn
                ? 'মেসের লোগো বা হোস্টেল ছবি সেট করুন (মেম্বার প্রোফাইল থেকে সম্পূর্ণ আলাদা)'
                : 'Set mess logo or hostel photo (distinct from personal user profile)'}
            </p>
          </div>
        </div>
      }
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Live Mess Profile Card Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-4">
          <div className="relative group shrink-0">
            {preview ? (
              <img
                src={preview}
                alt={mess?.name || 'Mess Logo'}
                className="w-20 h-20 rounded-full object-cover border-4 border-rose-500 shadow-md ring-4 ring-rose-500/10"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {initialLetter}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-800">
              <Building2 className="w-3.5 h-3.5 text-rose-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 block mb-0.5">
              {isBn ? 'মেস পরিচিতি প্রিভিউ' : 'Mess Identity Preview'}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {mess?.name || (isBn ? 'আপাতত নাম নাই' : 'Smart Mess Manager')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{mess?.address || (isBn ? 'ঢাকা বিশ্ববিদ্যালয় এরিয়া' : 'Dhaka, Bangladesh')}</span>
            </p>

            {preview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>{isBn ? 'মেস ছবি মুছে ফেলুন' : 'Remove mess photo'}</span>
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <X className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isBn ? 'ডিভাইস থেকে' : 'Upload'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>{isBn ? 'মেস আইকন' : 'Mess Icons'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{isBn ? 'ওয়েব লিঙ্ক' : 'Image URL'}</span>
          </button>
        </div>

        {/* Tab 1: Local Device File Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30 hover:bg-rose-50/20"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-2 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isBn ? 'মেস বা হোস্টেলের ছবি আপলোড করতে ক্লিক করুন' : 'Click to browse mess logo or hostel photo'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                JPG, PNG, WebP • Max 5MB
              </p>
              {fileName && (
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3" />
                  <span>{fileName}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Mess/Hostel Preset Gallery */}
        {activeTab === 'presets' && (
          <div className="space-y-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isBn ? 'মেসের জন্য উপযুক্ত একটি আইকন বা ছবি বেছে নিন:' : 'Choose a mess or hostel photo:'}
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-1">
              {MESS_PRESET_LOGOS.map((m) => {
                const isSelected = preview === m.url;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectPreset(m.url)}
                    className={`relative rounded-xl p-0.5 transition-all cursor-pointer group ${
                      isSelected
                        ? 'ring-3 ring-rose-500 scale-105'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    title={m.label}
                  >
                    <img
                      src={m.url}
                      alt={m.label}
                      className="w-12 h-12 rounded-lg object-cover shadow-2xs"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-rose-600/30 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Online Image URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleApplyUrl} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'মেস লোগোর ওয়েব লিঙ্ক (Image URL)' : 'Direct Image URL'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/mess-logo.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={!customUrl.trim()}
                  className="px-3 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isBn ? 'প্রিভিউ' : 'Apply'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSaving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'মেস ছবি সংরক্ষণ করুন' : 'Save Mess Picture')}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
