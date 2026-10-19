import React, { useState } from 'react';
import { MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';
import { formatBDT } from '../utils/calculations';
import { Modal } from './Modal';

export const WhatsAppReminderModal = ({ isOpen, onClose, member, mess }) => {
  const [copied, setCopied] = useState(false);

  if (!member) return null;

  const dueAmount = Math.abs(member.netBalance || 0);

  const messageText = `আসসালামু আলাইকুম ${member.name} ভাই,\n\nস্মার্ট মেস ম্যানেজার থেকে জানাচ্ছি:\nআপনার চলতি মাসের মেস হিসাব অনুযায়ী বকেয়া পাওনা হয়েছে: ${formatBDT(dueAmount)}।\n\nদয়া করে অতিসত্বর ম্যানেজারের বিকাশ/নগদে (${mess?.bkash_number || '01711223344'}) পরিশোধ করে ট্রানজেকশন আইডি পাঠিয়ে নিশ্চিত করবেন।\n\nধন্যবাদ,\n${mess?.name || 'মেস কর্তৃপক্ষ'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`বকেয়া তাগাদা: ${member.name}`}>
      <div className="space-y-4">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          মেম্বার: <strong>{member.name}</strong> (রুম {member.roomNumber || 'N/A'}) • বকেয়া পাওনা:{' '}
          <strong className="font-mono text-sm">{formatBDT(dueAmount)}</strong>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            হোয়াটসঅ্যাপ বা এসএমএস মেসেজ প্রিভিউ:
          </label>
          <textarea
            readOnly
            rows="7"
            value={messageText}
            className="w-full text-xs font-sans p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'মেসেজ কপি হয়েছে!' : 'কপি করুন'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp-এ পাঠান</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
