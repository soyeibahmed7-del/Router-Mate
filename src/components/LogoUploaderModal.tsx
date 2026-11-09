import React, { useState, useRef } from 'react';
import { Upload, Image, Link, Check, X, RotateCcw, AlertCircle } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface LogoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl?: string | null;
  onSaveLogo: (url: string | null) => void;
  lang: Language;
}

export const LogoUploaderModal: React.FC<LogoUploaderModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  onSaveLogo,
  lang,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewUrl(result);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setErrorMsg(null);
  };

  const handleSave = () => {
    onSaveLogo(previewUrl);
    onClose();
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setUrlInput('');
    onSaveLogo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-[#0c1424] border border-cyan-500/30 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Image className="w-4 h-4" />
            <span>Custom Branding</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white">
            Upload Your Logo Photo
          </h3>
          <p className="text-xs text-slate-400">
            Upload your preferred logo photo or icon image. It will instantly replace all app icons and logos.
          </p>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl border border-white/15 bg-slate-950 p-1 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <Image className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {previewUrl ? 'Custom Logo Active' : 'Default Enterprise Logo'}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                {previewUrl ? 'Ready to apply across application' : 'Using default built-in vector icon'}
              </span>
            </div>
          </div>

          {previewUrl && (
            <button
              onClick={handleReset}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 p-2"
              title="Remove and use default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upload methods */}
        <div className="space-y-4">
          {/* File Picker Drag & Drop Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/40 hover:bg-cyan-500/5 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 mx-auto mb-2 transition-colors" />
            <span className="text-xs font-bold text-slate-200 block">
              Click to choose a logo file from your device
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Supports PNG, JPG, SVG, WebP (Transparent PNG recommended)
            </span>
          </div>

          {/* Or Paste Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Or paste an Image URL:</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Logo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
