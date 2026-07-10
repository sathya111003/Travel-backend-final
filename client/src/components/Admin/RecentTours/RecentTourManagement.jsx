import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, Type, FileText, Video, Music, Upload, X, Play, Headphones } from 'lucide-react';
import { fetchRecentTours, createRecentTour, deleteRecentTour, uploadVideo, uploadAudio } from '../../../api/api';
import ImageUploadWidget from '../ImageUploadWidget';

const MediaUploadWidget = ({ label, value, onChange, accept, icon: Icon, color, uploadFn, placeholder }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = accept === 'video/*' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size must be under ${accept === 'video/*' ? '50MB' : '10MB'}`);
      return;
    }

    const data = new FormData();
    data.append(accept === 'video/*' ? 'video' : 'audio', file);
    setFileName(file.name);
    setUploading(true);
    setError('');

    try {
      const response = await uploadFn(data);
      onChange(response.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload');
      setFileName('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-text/50 uppercase ml-1 flex items-center gap-2">
        <Icon size={14} className={color} /> {label} (Optional)
      </label>
      <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${value ? `${color}/10` : 'bg-background/50'}`}>
          {value ? <Play size={20} className={color} /> : <Icon size={20} className="text-primary/20" />}
        </div>
        <div className="flex-1 flex items-center gap-2">
          {value ? (
            <div className="flex-1 flex items-center gap-2 bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20">
              <Play size={14} className="text-green-400" />
              <span className="text-sm text-green-400 truncate flex-1">{fileName || 'File uploaded'}</span>
              <button type="button" onClick={handleRemove} className="text-red-400 hover:bg-red-400/10 p-1 rounded-lg transition-all">
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <span className="text-sm text-text/40 flex-1 truncate">{placeholder}</span>
              <label className={`cursor-pointer ${color}/10 hover:${color}/20 text-primary p-3 rounded-xl border border-primary/25 flex items-center justify-center shrink-0 transition-all font-bold text-xs select-none min-w-[100px] h-[46px]`}>
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Upload size={14} className="mr-1.5" />
                    <span>Upload</span>
                  </>
                )}
                <input type="file" accept={accept} className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>
            </>
          )}
        </div>
      </div>
      {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
    </div>
  );
};

const RecentTourManagement = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    days: '',
    description: '',
    videoUrl: '',
    audioUrl: ''
  });

  const getTours = async () => {
    try {
      const { data } = await fetchRecentTours();
      setTours(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTours();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRecentTour(formData);
      setFormData({ title: '', image: '', days: '', description: '', videoUrl: '', audioUrl: '' });
      setShowAddForm(false);
      getTours();
    } catch (error) {
      alert('Failed to add tour');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recent tour memory?')) {
      try {
        await deleteRecentTour(id);
        getTours();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Recent Tours Memories</h1>
          <p className="text-text/60 mt-1">Manage the "Our Recent Tours" section on the homepage.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-background px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>Add Tour Memory</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-8 rounded-[2.5rem] border border-primary/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text/50 uppercase ml-1">Tour Title</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                    <input 
                      required className="w-full glass pl-12 pr-4 py-4 rounded-2xl border-primary/10"
                      placeholder="e.g. Ooty Summer Trip"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text/50 uppercase ml-1">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                    <input 
                      required className="w-full glass pl-12 pr-4 py-4 rounded-2xl border-primary/10"
                      placeholder="e.g. 3 Days"
                      value={formData.days}
                      onChange={(e) => setFormData({...formData, days: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <ImageUploadWidget
                  label="Tour Memory Image (Upload or URL)"
                  value={formData.image}
                  onChange={(val) => setFormData({ ...formData, image: val })}
                  placeholder="Upload memory image or enter URL..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MediaUploadWidget
                  label="Tour Video"
                  value={formData.videoUrl}
                  onChange={(val) => setFormData({ ...formData, videoUrl: val })}
                  accept="video/*"
                  icon={Video}
                  color="text-blue-400"
                  uploadFn={uploadVideo}
                  placeholder="Upload tour video (MP4, WebM)..."
                />
                <MediaUploadWidget
                  label="Tour Audio"
                  value={formData.audioUrl}
                  onChange={(val) => setFormData({ ...formData, audioUrl: val })}
                  accept="audio/*"
                  icon={Music}
                  color="text-[#F97316]"
                  uploadFn={uploadAudio}
                  placeholder="Upload tour audio (MP3, WAV)..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text/50 uppercase ml-1">Description</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-6 text-primary/40" size={18} />
                  <textarea 
                    required className="w-full glass pl-12 pr-4 py-4 rounded-2xl border-primary/10 h-32"
                    placeholder="Briefly describe the tour experience..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button 
                  type="button" onClick={() => setShowAddForm(false)}
                  className="px-8 py-3 glass rounded-xl font-bold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-10 py-3 bg-primary text-background rounded-xl font-bold hover:scale-105 transition-all"
                >
                  Save Memory
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tours.map((tour) => (
            <div key={tour._id} className="glass p-6 rounded-[2.5rem] border border-primary/10 flex space-x-6 relative group overflow-hidden">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-primary/10">
                <img src={tour.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xl">{tour.title}</h4>
                  <button 
                    onClick={() => handleDelete(tour._id)}
                    className="p-2 text-text/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-xs font-bold text-primary uppercase">{tour.days}</p>
                <p className="text-sm text-text/60 line-clamp-2">{tour.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  {tour.videoUrl && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                      <Video size={10} /> Video
                    </span>
                  )}
                  {tour.audioUrl && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">
                      <Music size={10} /> Audio
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {tours.length === 0 && (
            <div className="col-span-full py-20 text-center text-text/30 italic glass rounded-3xl border border-primary/5">
              No tour memories added yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentTourManagement;
