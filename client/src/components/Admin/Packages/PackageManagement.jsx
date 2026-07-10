import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, MapPin } from 'lucide-react';
import { fetchAllPackagesAdmin, deletePackage } from '../../../api/api';
import PackageForm from './PackageForm';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getPackages = async () => {
    try {
      const { data } = await fetchAllPackagesAdmin();
      setPackages(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPackages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
        getPackages();
      } catch (error) {
        alert('Error deleting package');
      }
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  const filteredPackages = packages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Package Management</h1>
          <p className="text-text/60 mt-1">Add, update, or remove travel packages from the platform.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary text-background px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          <span>Add New Package</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30" size={20} />
          <input 
            type="text" placeholder="Search packages by title or location..."
            className="w-full glass pl-12 pr-4 py-4 rounded-2xl border-primary/10 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="glass px-6 py-4 rounded-2xl flex items-center space-x-2 text-text/60 hover:text-primary transition-all">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="glass rounded-[2rem] overflow-hidden border border-primary/10">
          <table className="w-full text-left">
            <thead className="bg-primary/5 text-text/50 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-8 py-6">Image</th>
                <th className="px-8 py-6">Package Details</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredPackages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="w-20 h-14 rounded-lg overflow-hidden border border-primary/10">
                      <img src={pkg.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-text group-hover:text-primary transition-colors">{pkg.title}</div>
                    <div className="text-sm text-text/50 flex items-center mt-1">
                      <MapPin size={12} className="mr-1" /> {pkg.location?.city} • {pkg.duration}
                    </div>
                  </td>
                  <td className="px-8 py-6 uppercase text-xs font-bold text-text/70">{pkg.category}</td>
                  <td className="px-8 py-6 font-bold text-primary">₹{pkg.price.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => handleEdit(pkg)}
                        className="p-2 glass text-text/60 hover:text-primary hover:border-primary/40 transition-all rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(pkg._id)}
                        className="p-2 glass text-text/60 hover:text-red-400 hover:border-red-400/40 transition-all rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPackages.length === 0 && (
            <div className="p-20 text-center text-text/30 italic">No packages found</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <PackageForm 
            onClose={() => setShowForm(false)} 
            initialData={editingPackage}
            onSuccess={() => {
              getPackages();
              alert(`Package ${editingPackage ? 'updated' : 'created'} successfully!`);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackageManagement;
