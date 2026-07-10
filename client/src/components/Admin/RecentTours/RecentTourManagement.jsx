import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Image as ImageIcon, Clock, Type, FileText, Video, Music } from 'lucide-react';
import { fetchRecentTours, createRecentTour, deleteRecentTour } from '../../../api/api';
import ImageUploadWidget from '../ImageUploadWidget';

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
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text/50 uppercase ml-1">Video URL (Optional)</label>
                  <div className="relative">
                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                    <input 
                      className="w-full glass pl-12 pr-4 py-4 rounded-2xl border-primary/10"
                      placeholder="https://example.com/video.mp4"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text/50 uppercase ml-1">Audio URL (Optional)</label>
                  <div className="relative">
                    <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                    <input 
                      className="w-full glass pl-12 pr-4 py-4 rounded-2xl border-primary/10"
                      placeholder="https://example.com/audio.mp3"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData({...formData, audioUrl: e.target.value})}
                    />
                  </div>
                </div>
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
