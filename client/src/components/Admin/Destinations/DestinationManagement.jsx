import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Globe, MapPin, Edit, Save, X } from 'lucide-react';
import { fetchDestinations, createDestination, updateDestination, deleteDestination } from '../../../api/api';

const DestinationManagement = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    region: '',
    type: 'domestic',
    cities: ['']
  });

  const getDestinations = async () => {
    try {
      const { data } = await fetchDestinations();
      setDestinations(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDestinations();
  }, []);

  const handleCityChange = (idx, value) => {
    const newCities = [...formData.cities];
    if (typeof newCities[idx] === 'object') {
      newCities[idx].name = value;
    } else {
      newCities[idx] = value;
    }
    setFormData({ ...formData, cities: newCities });
  };

  const addCityField = () => setFormData({ ...formData, cities: [...formData.cities, ''] });
  const removeCityField = (idx) => setFormData({ ...formData, cities: formData.cities.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty fields and map cities to match Mongoose schema { name, image }
      const cleanedData = {
        ...formData,
        cities: formData.cities
          .filter(c => typeof c === 'string' ? c.trim() !== '' : c.name.trim() !== '')
          .map(c => typeof c === 'string' ? { name: c, image: 'default_city.jpg' } : c)
      };

      if (editingId) {
        await updateDestination(editingId, cleanedData);
      } else {
        await createDestination(cleanedData);
      }
      setFormData({ region: '', type: 'domestic', cities: [''] });
      setEditingId(null);
      setShowForm(false);
      getDestinations();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.message;
      alert(`Backend Error: ${errorMsg}`);
    }
  };

  const handleEdit = (dest) => {
    setFormData({ region: dest.region, type: dest.type, cities: dest.cities });
    setEditingId(dest._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this region and all its cities?')) {
      try {
        await deleteDestination(id);
        getDestinations();
      } catch (error) {
        alert('Error deleting');
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Mega Menu Settings</h1>
          <p className="text-text/60 mt-1">Manage the regions and cities shown in the Navbar Domestic/International menus.</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ region: '', type: 'domestic', cities: [''] }); }}
          className="bg-primary text-background px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>Add New Region</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass p-10 rounded-[2.5rem] border border-primary/20 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text/40 uppercase ml-1">Region Name (e.g. Kerala)</label>
                  <input required className="w-full glass p-4 rounded-2xl border-primary/10" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text/40 uppercase ml-1">Menu Category</label>
                  <select className="w-full glass p-4 rounded-2xl border-primary/10 font-bold" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="domestic">Domestic Menu</option>
                    <option value="international">International Menu</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-text/40 uppercase ml-1">Cities / Destinations Under this Region</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {formData.cities.map((city, idx) => (
                     <div key={idx} className="flex space-x-2">
                        <input required className="flex-1 glass p-3 rounded-xl text-sm" placeholder="City Name" value={typeof city === 'object' ? city.name : city} onChange={(e) => handleCityChange(idx, e.target.value)} />
                        {formData.cities.length > 1 && (
                          <button type="button" onClick={() => removeCityField(idx)} className="text-red-400 p-2"><Trash2 size={16} /></button>
                        )}
                     </div>
                   ))}
                </div>
                <button type="button" onClick={addCityField} className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline">
                  <Plus size={14} /> <span>Add Another City</span>
                </button>
              </div>

              <div className="flex justify-end space-x-4 border-t border-primary/10 pt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 glass rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-primary text-background rounded-xl font-bold flex items-center space-x-2">
                  <Save size={18} />
                  <span>{editingId ? 'Update Region' : 'Save Region'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <div key={dest._id} className="glass p-8 rounded-[2.5rem] border border-primary/10 relative group hover:border-primary/40 transition-all">
            <div className="flex justify-between items-start mb-6">
               <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${dest.type === 'domestic' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                 {dest.type}
               </div>
               <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(dest)} className="p-2 text-text/60 hover:text-primary"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(dest._id)} className="p-2 text-text/60 hover:text-red-400"><Trash2 size={16} /></button>
               </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">{dest.region}</h3>
            <div className="flex flex-wrap gap-2">
               {dest.cities.map((city, i) => (
                 <span key={i} className="bg-white/5 px-3 py-1.5 rounded-lg text-xs text-text/60 border border-white/5">
                   {typeof city === 'object' ? city.name : city}
                 </span>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationManagement;
