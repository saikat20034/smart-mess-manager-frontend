import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold font-mono">
          404
        </div>
        <h1 className="text-xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The mess management page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Manager Access Required</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          You do not have permissions to modify this financial configuration. Switch to "Manager View" or contact your mess manager.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
