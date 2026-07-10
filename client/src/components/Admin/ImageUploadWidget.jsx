import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, Plus, AlertCircle } from 'lucide-react';
import { uploadImage } from '../../api/api';

const ImageUploadWidget = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "https://images.unsplash.com/...", 
  onRemove 
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    setError('');

    try {
      const response = await uploadImage(data);
      onChange(response.data.url);
    } catch (err) {
      console.error("Upload error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to upload image";
      setError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-bold text-text/40 uppercase ml-1 block">
          {label}
        </label>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-primary/5 p-4 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all">
        {/* Preview Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-primary/20 bg-background/50 flex items-center justify-center relative group">
          {value ? (
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format&fit=crop';
              }}
            />
          ) : (
            <ImageIcon className="text-primary/20 w-8 h-8" />
          )}
        </div>

        {/* Input & Upload button wrapper */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <div className="flex gap-2 w-full items-center">
            <input
              className="flex-1 glass px-4 py-3 rounded-xl text-sm border-primary/5 focus:border-primary transition-all text-text placeholder:text-text/25"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            
            <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-xl border border-primary/25 flex items-center justify-center shrink-0 transition-all font-bold text-xs select-none min-w-[100px] h-[46px]">
              {uploading ? (
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Upload size={14} className="mr-1.5" />
                  <span>Upload</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
                disabled={uploading} 
              />
            </label>

            {onRemove && (
              <button 
                type="button" 
                onClick={onRemove} 
                className="text-red-400 p-3 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-400/20"
                title="Remove Image"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-center space-x-1.5 text-red-400 text-xs mt-1">
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadWidget;
