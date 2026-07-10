import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, MapPin, Calendar, Clock, 
  Image as ImageIcon, Utensils, Car, Hotel, 
  Star, Info, ChevronDown, ChevronUp, IndianRupee, ListChecks, ShieldX
} from 'lucide-react';
import { createPackage, updatePackage } from '../../../api/api';
import ImageUploadWidget from '../ImageUploadWidget';

const PackageForm = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tourOverview: '',
    price: '',
    duration: '',
    category: 'honeymoon',
    type: 'domestic',
    location: { city: '', country: '', lat: '', lng: '' },
    images: [''],
    highlights: [''],
    exclusions: [''],
    rates: [{ pax: '', price: '' }],
    hotel: { name: '', rating: 5, image: '', description: '', amenities: [''] },
    itinerary: [
      { 
        day: 1, 
        title: '', 
        activities: [{ time: '09:00 AM', description: '' }],
        places: [''], 
        food: { 
          breakfast: { name: 'Hotel Buffet', included: true }, 
          lunch: { name: 'Local Restaurant', included: true }, 
          dinner: { name: 'Hotel Dining', included: true } 
        }, 
        travel: 'Private Car' 
      }
    ]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        highlights: initialData.highlights || [''],
        exclusions: initialData.exclusions || [''],
        images: initialData.images || [''],
        rates: initialData.rates || [{ pax: '', price: '' }],
        location: initialData.location || { city: '', country: '', lat: '', lng: '' },
        hotel: initialData.hotel || { name: '', rating: 5, image: '', description: '', amenities: [''] },
        itinerary: initialData.itinerary || [
          { 
            day: 1, 
            title: '', 
            activities: [{ time: '09:00 AM', description: '' }],
            places: [''], 
            food: { 
              breakfast: { name: 'Hotel Buffet', included: true }, 
              lunch: { name: 'Local Restaurant', included: true }, 
              dinner: { name: 'Hotel Dining', included: true } 
            }, 
            travel: 'Private Car' 
          }
        ]
      });
    }
  }, [initialData]);

  // Itinerary Handlers
  const handleItineraryChange = (dayIdx, field, value, activityIdx = null) => {
    const newItinerary = [...formData.itinerary];
    if (activityIdx !== null) {
      newItinerary[dayIdx].activities[activityIdx][field] = value;
    } else if (field.includes('food.')) {
      const [_, mealType, subField] = field.split('.');
      newItinerary[dayIdx].food[mealType][subField] = value;
    } else {
      newItinerary[dayIdx][field] = value;
    }
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addActivity = (dayIdx) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIdx].activities.push({ time: '', description: '' });
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const removeActivity = (dayIdx, activityIdx) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIdx].activities = newItinerary[dayIdx].activities.filter((_, i) => i !== activityIdx);
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { 
        day: formData.itinerary.length + 1, 
        title: '', 
        activities: [{ time: '09:00 AM', description: '' }],
        places: [''], 
        food: { 
          breakfast: { name: 'Hotel Buffet', included: true }, 
          lunch: { name: 'Local Restaurant', included: true }, 
          dinner: { name: 'Hotel Dining', included: true } 
        }, 
        travel: 'Private Car' 
      }]
    });
  };

  const removeDay = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }));
    setFormData({ ...formData, itinerary: newItinerary });
  };

  // Generic Array Handlers (Images, Highlights, Amenities)
  const handleArrayChange = (field, index, value, subField = null) => {
    if (subField) {
      const newObj = { ...formData[field] };
      newObj[subField][index] = value;
      setFormData({ ...formData, [field]: newObj });
    } else {
      const newArray = [...formData[field]];
      newArray[index] = value;
      setFormData({ ...formData, [field]: newArray });
    }
  };

  const addArrayField = (field, subField = null) => {
    if (subField) {
      const newObj = { ...formData[field] };
      newObj[subField].push('');
      setFormData({ ...formData, [field]: newObj });
    } else {
      setFormData({ ...formData, [field]: [...formData[field], ''] });
    }
  };

  const removeArrayField = (field, index, subField = null) => {
    if (subField) {
      const newObj = { ...formData[field] };
      newObj[subField] = newObj[subField].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newObj });
    } else {
      setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty number fields that cause Mongoose CastErrors
      const cleanedData = { ...formData };
      
      // Force top-level conversions
      cleanedData.price = cleanedData.price ? Number(cleanedData.price) : 0;
      
      if (cleanedData.location) {
        if (cleanedData.location.lat === '') delete cleanedData.location.lat;
        else if (cleanedData.location.lat) cleanedData.location.lat = Number(cleanedData.location.lat);
        
        if (cleanedData.location.lng === '') delete cleanedData.location.lng;
        else if (cleanedData.location.lng) cleanedData.location.lng = Number(cleanedData.location.lng);
      }
      if (cleanedData.hotel && cleanedData.hotel.rating === '') {
        cleanedData.hotel.rating = 5;
      } else if (cleanedData.hotel) {
        cleanedData.hotel.rating = Number(cleanedData.hotel.rating);
      }
      
      // Clean up rates
      cleanedData.rates = cleanedData.rates.map(r => ({
        ...r,
        price: r.price === '' ? 0 : Number(r.price)
      }));

      // Clean up empty string arrays
      cleanedData.highlights = cleanedData.highlights.filter(h => h.trim() !== '');
      cleanedData.exclusions = cleanedData.exclusions.filter(e => e.trim() !== '');
      cleanedData.images = cleanedData.images.filter(i => i.trim() !== '');

      // Clean up itinerary titles
      if (cleanedData.itinerary && cleanedData.itinerary.length > 0) {
        cleanedData.itinerary = cleanedData.itinerary.map(day => ({
          ...day,
          title: day.title.trim() === '' ? `Day ${day.day} Activities` : day.title
        }));
      }

      if (initialData?._id) {
        await updatePackage(initialData._id, cleanedData);
      } else {
        await createPackage(cleanedData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Full Error Object:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown Error";
      alert(`Backend Error: ${errorMsg}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }}
        className="glass max-w-5xl w-full p-8 md:p-12 rounded-[3rem] relative my-auto shadow-2xl border border-primary/20"
      >
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-primary/10">
          <div>
            <h2 className="text-3xl font-bold text-primary">{initialData ? 'Update Experience' : 'New GT-Style Experience'}</h2>
            <p className="text-text/50 text-sm mt-1 uppercase tracking-[0.2em]">Premium Package Builder</p>
          </div>
          <button onClick={onClose} className="bg-red-400/10 text-red-400 px-6 py-2 rounded-xl font-bold hover:bg-red-400/20 transition-all">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16 pb-12">
          
          {/* 1. Basic Info */}
          <section className="space-y-8">
            <h3 className="text-xl font-bold flex items-center space-x-3 text-text/80">
              <Info className="text-primary" size={24} />
              <span>Basic Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase ml-1">Package Title</label>
                <input required className="w-full glass p-4 rounded-2xl border-primary/10 focus:border-primary transition-all" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase ml-1">Price per person (₹)</label>
                <input required type="number" className="w-full glass p-4 rounded-2xl border-primary/10 focus:border-primary transition-all" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase ml-1">Duration (e.g. 3 Days / 2 Nights)</label>
                <input required className="w-full glass p-4 rounded-2xl border-primary/10 focus:border-primary transition-all" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text/40 uppercase ml-1">Category</label>
                  <select className="w-full glass p-4 rounded-2xl border-primary/10" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="honeymoon">Honeymoon</option>
                    <option value="family">Family</option>
                    <option value="adventure">Adventure</option>
                    <option value="international">International</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text/40 uppercase ml-1">Type</label>
                  <select className="w-full glass p-4 rounded-2xl border-primary/10" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text/40 uppercase ml-1">Experience Description (Short)</label>
              <textarea required className="w-full glass p-4 rounded-2xl border-primary/10 h-24" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text/40 uppercase ml-1">Full Tour Overview (Detailed)</label>
              <textarea className="w-full glass p-4 rounded-2xl border-primary/10 h-32" value={formData.tourOverview} onChange={(e) => setFormData({ ...formData, tourOverview: e.target.value })} />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-text/40 uppercase ml-1 flex items-center gap-2">
                <ImageIcon size={14} /> Gallery Images (Upload or URL)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.images.map((img, idx) => (
                  <ImageUploadWidget
                    key={idx}
                    label={`Image ${idx + 1}`}
                    value={img}
                    onChange={(val) => handleArrayChange('images', idx, val)}
                    onRemove={() => removeArrayField('images', idx)}
                    placeholder="Upload image or enter URL..."
                  />
                ))}
              </div>
              <button type="button" onClick={() => addArrayField('images')} className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline">
                <Plus size={14} /> <span>Add Image Slot</span>
              </button>
            </div>
          </section>

          {/* 1.5. Dynamic Rates & Locations */}
          <section className="space-y-8">
            <h3 className="text-xl font-bold flex items-center space-x-3 text-text/80">
              <IndianRupee className="text-primary" size={24} />
              <span>Group Rates & Detailed Location</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase ml-1">City</label>
                <input required className="w-full glass p-4 rounded-2xl border-primary/10" value={formData.location.city} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase ml-1">Country</label>
                <input required className="w-full glass p-4 rounded-2xl border-primary/10" value={formData.location.country} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, country: e.target.value } })} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-text/40 uppercase ml-1">Group Rates (Pax vs Price)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.rates.map((rate, idx) => (
                  <div key={idx} className="flex space-x-2 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <input className="w-24 glass p-2 rounded-lg text-sm" placeholder="12 Pax" value={rate.pax} onChange={(e) => {
                      const newRates = [...formData.rates];
                      newRates[idx].pax = e.target.value;
                      setFormData({ ...formData, rates: newRates });
                    }} />
                    <input type="number" className="flex-1 glass p-2 rounded-lg text-sm" placeholder="2800" value={rate.price} onChange={(e) => {
                      const newRates = [...formData.rates];
                      newRates[idx].price = e.target.value;
                      setFormData({ ...formData, rates: newRates });
                    }} />
                    <button type="button" onClick={() => {
                      const newRates = formData.rates.filter((_, i) => i !== idx);
                      setFormData({ ...formData, rates: newRates });
                    }} className="text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setFormData({ ...formData, rates: [...formData.rates, { pax: '', price: '' }] })} className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline">
                <Plus size={14} /> <span>Add Rate Tier</span>
              </button>
            </div>
          </section>

          {/* 2. Hotel & Accommodation */}
          <section className="space-y-8 bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
            <h3 className="text-xl font-bold flex items-center space-x-3 text-primary">
              <Hotel size={24} />
              <span>Premium Accommodation</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase ml-1">Hotel Name</label>
                <input className="w-full glass p-4 rounded-2xl border-primary/10" value={formData.hotel.name} onChange={(e) => setFormData({ ...formData, hotel: { ...formData.hotel, name: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase ml-1">Hotel Rating (1-5)</label>
                <input type="number" max="5" className="w-full glass p-4 rounded-2xl border-primary/10" value={formData.hotel.rating} onChange={(e) => setFormData({ ...formData, hotel: { ...formData.hotel, rating: e.target.value } })} />
              </div>
            </div>
             <div className="space-y-2">
               <ImageUploadWidget
                 label="Hotel Image (Upload or URL)"
                 value={formData.hotel.image}
                 onChange={(val) => setFormData({ ...formData, hotel: { ...formData.hotel, image: val } })}
                 placeholder="Upload hotel image or enter URL..."
               />
             </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-text/40 uppercase ml-1">Hotel Amenities</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex space-x-2">
                    <input className="flex-1 glass p-3 rounded-xl border-primary/10 text-sm" placeholder="e.g. Swimming Pool" value={amenity} onChange={(e) => handleArrayChange('hotel', idx, e.target.value, 'amenities')} />
                    <button type="button" onClick={() => removeArrayField('hotel', idx, 'amenities')} className="text-red-400 p-2"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addArrayField('hotel', 'amenities')} className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline">
                <Plus size={14} /> <span>Add Amenity</span>
              </button>
            </div>
          </section>

          {/* 2.5. Inclusions & Exclusions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center space-x-3 text-text/80">
                <ListChecks className="text-green-400" size={24} />
                <span>Inclusions (Highlights)</span>
              </h3>
              <div className="space-y-3">
                {formData.highlights.map((h, idx) => (
                  <div key={idx} className="flex space-x-2">
                    <input className="flex-1 glass p-3 rounded-xl text-sm" placeholder="e.g. 2 Breakfasts & 1 Dinner" value={h} onChange={(e) => handleArrayChange('highlights', idx, e.target.value)} />
                    <button type="button" onClick={() => removeArrayField('highlights', idx)} className="text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('highlights')} className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline">
                  <Plus size={14} /> <span>Add Inclusion</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center space-x-3 text-text/80">
                <ShieldX className="text-red-400" size={24} />
                <span>Exclusions</span>
              </h3>
              <div className="space-y-3">
                {formData.exclusions.map((e, idx) => (
                  <div key={idx} className="flex space-x-2">
                    <input className="flex-1 glass p-3 rounded-xl text-sm" placeholder="e.g. Train Tickets" value={e} onChange={(e) => handleArrayChange('exclusions', idx, e.target.value)} />
                    <button type="button" onClick={() => removeArrayField('exclusions', idx)} className="text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('exclusions')} className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline">
                  <Plus size={14} /> <span>Add Exclusion</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. Detailed Itinerary with Timings */}
          <section className="space-y-8">
            <h3 className="text-xl font-bold flex items-center space-x-3 text-text/80">
              <Calendar className="text-primary" size={24} />
              <span>Full Daily Itinerary (GT-Style)</span>
            </h3>
            <div className="space-y-12">
              {formData.itinerary.map((day, dIdx) => (
                <div key={dIdx} className="glass p-10 rounded-[3rem] border border-primary/10 relative shadow-xl">
                  <div className="flex justify-between items-center mb-8">
                    <span className="bg-primary text-background px-6 py-2 rounded-full font-bold text-sm">DAY {day.day}</span>
                    <button type="button" onClick={() => removeDay(dIdx)} className="text-red-400 hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                  </div>
                  
                  <div className="space-y-6 mb-10">
                    <input 
                      required
                      className="w-full bg-transparent text-2xl font-bold border-b border-primary/20 pb-2 focus:border-primary outline-none" 
                      placeholder="Day Theme (e.g. Arrival & Sunset Beach Visit)" 
                      value={day.title} 
                      onChange={(e) => handleItineraryChange(dIdx, 'title', e.target.value)} 
                    />
                  </div>

                  {/* Timed Activities */}
                  <div className="space-y-6 mb-10">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Time-Based Activities</p>
                    <div className="space-y-4">
                      {day.activities.map((act, aIdx) => (
                        <div key={aIdx} className="flex flex-col md:flex-row gap-4 items-start">
                          <input className="w-32 glass p-3 rounded-xl text-sm" placeholder="9:00 AM" value={act.time} onChange={(e) => handleItineraryChange(dIdx, 'time', e.target.value, aIdx)} />
                          <input className="flex-1 glass p-3 rounded-xl text-sm" placeholder="Breakfast at hotel and depart for local sightseeing..." value={act.description} onChange={(e) => handleItineraryChange(dIdx, 'description', e.target.value, aIdx)} />
                          <button type="button" onClick={() => removeActivity(dIdx, aIdx)} className="p-3 text-red-400"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addActivity(dIdx)} className="text-xs font-bold text-accent flex items-center space-x-1 hover:underline">
                        <Plus size={14} /> <span>Add Activity Slot</span>
                      </button>
                    </div>
                  </div>

                  {/* Meals Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-background/50 p-6 rounded-3xl border border-primary/5">
                    {['breakfast', 'lunch', 'dinner'].map((mType) => (
                      <div key={mType} className="space-y-2">
                        <label className="text-[10px] font-bold text-text/40 uppercase">{mType}</label>
                        <input 
                          className="w-full glass p-2 rounded-lg text-xs" 
                          value={day.food?.[mType]?.name || ''} 
                          onChange={(e) => handleItineraryChange(dIdx, `food.${mType}.name`, e.target.value)} 
                        />
                        <div className="flex items-center space-x-2">
                           <input 
                            type="checkbox" 
                            checked={day.food?.[mType]?.included || false} 
                            onChange={(e) => handleItineraryChange(dIdx, `food.${mType}.included`, e.target.checked)} 
                           />
                           <span className="text-[10px] text-text/60">Included in package</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addDay} className="w-full py-6 glass rounded-[2rem] border-dashed border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all flex items-center justify-center space-x-2">
                <Plus size={24} /> <span>Add Another Day</span>
              </button>
            </div>
          </section>

          {/* Form Actions */}
          <div className="pt-10 flex justify-end space-x-6">
            <button type="button" onClick={onClose} className="px-12 py-5 glass rounded-2xl font-bold hover:bg-white/5 transition-all">Cancel</button>
            <button type="submit" className="px-16 py-5 bg-primary text-background rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
              {initialData ? 'Update Trip Experience' : 'Launch Experience'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PackageForm;
