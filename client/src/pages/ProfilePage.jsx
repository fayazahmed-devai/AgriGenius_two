import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, getFarms, createFarm, deleteFarm } from '../services/api.js';
import { Button, Input, Select, Card, Badge } from '../components/common/UIComponents.jsx';
import { User, Plus, Trash2, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: 'India',
    state: '',
    district: '',
    village: '',
    preferredLanguage: 'en',
    farmingExperience: 5,
    landArea: 2.5,
    landUnit: 'acre',
    farmingType: 'Mixed / Diversified',
    irrigationAvailable: true,
  });

  const [farms, setFarms] = useState([]);
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmArea, setNewFarmArea] = useState(2.0);
  const [newFarmSoil, setNewFarmSoil] = useState('Loamy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || user?.user_metadata?.full_name || '',
        phone: profile.phone || '',
        country: profile.country || 'India',
        state: profile.state || 'Karnataka',
        district: profile.district || 'Dharwad',
        village: profile.village || '',
        preferredLanguage: profile.preferred_language || 'en',
        farmingExperience: profile.farming_experience || 5,
        landArea: profile.land_area || 2.5,
        landUnit: profile.land_unit || 'acre',
        farmingType: profile.farming_type || 'Mixed / Diversified',
        irrigationAvailable: profile.irrigation_available ?? true,
      });
    }
    loadFarms();
  }, [profile]);

  async function loadFarms() {
    try {
      const res = await getFarms();
      if (res?.data) {
        setFarms(res.data);
      }
    } catch {
      // ignore
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await updateProfile(formData);
      await refreshProfile();
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarm = async (e) => {
    e.preventDefault();
    if (!newFarmName.trim()) return;

    try {
      await createFarm({
        farmName: newFarmName,
        state: formData.state || 'Karnataka',
        district: formData.district || 'Dharwad',
        soilType: newFarmSoil,
        landArea: Number(newFarmArea),
        landUnit: formData.landUnit,
      });
      setNewFarmName('');
      loadFarms();
    } catch (err) {
      alert('Failed to add farm: ' + err.message);
    }
  };

  const handleDeleteFarm = async (id) => {
    if (!confirm('Are you sure you want to remove this farm parcel?')) return;
    try {
      await deleteFarm(id);
      loadFarms();
    } catch (err) {
      alert('Failed to delete farm: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Farmer Profile & Field Parcels</h1>
        <p className="text-xs text-slate-500 mt-1">
          Maintain your personal farming background and managed agricultural land parcels.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-forest-600" /> General Agricultural Demographics
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Karnataka / Maharashtra / Punjab"
                  required
                />
                <Input
                  label="District"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Dharwad / Belagavi / Pune"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Village / Locality (Optional)"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Village name"
                />
                <Select
                  label="Preferred Language"
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                    { value: 'hi', label: 'हिंदी (Hindi)' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Total Land Area"
                  type="number"
                  step="0.1"
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  required
                />
                <Select
                  label="Land Unit"
                  value={formData.landUnit}
                  onChange={(e) => setFormData({ ...formData, landUnit: e.target.value })}
                  options={[
                    { value: 'acre', label: 'Acres' },
                    { value: 'hectare', label: 'Hectares' },
                    { value: 'sqm', label: 'Square Metres' },
                  ]}
                />
                <Input
                  label="Experience (Years)"
                  type="number"
                  value={formData.farmingExperience}
                  onChange={(e) => setFormData({ ...formData, farmingExperience: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  id="irrigationCheck"
                  type="checkbox"
                  checked={formData.irrigationAvailable}
                  onChange={(e) => setFormData({ ...formData, irrigationAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500"
                />
                <label htmlFor="irrigationCheck" className="text-xs text-slate-700 font-medium">
                  Irrigation facility available on main land (Borewell / Canal / Drip)
                </label>
              </div>

              <Button type="submit" variant="primary" isLoading={loading} className="w-full sm:w-auto">
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>

        {/* Managed Farm Plots */}
        <div className="space-y-4">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-forest-600" /> Managed Farm Parcels
            </h3>

            <form onSubmit={handleAddFarm} className="space-y-3 pt-1">
              <Input
                label="New Plot Identifier"
                placeholder="e.g. North Orchard, Plot B"
                value={newFarmName}
                onChange={(e) => setNewFarmName(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Area (Acres)"
                  type="number"
                  step="0.1"
                  value={newFarmArea}
                  onChange={(e) => setNewFarmArea(e.target.value)}
                  required
                />
                <Select
                  label="Soil Type"
                  value={newFarmSoil}
                  onChange={(e) => setNewFarmSoil(e.target.value)}
                  options={[
                    { value: 'Black Soil', label: 'Black Soil' },
                    { value: 'Red Soil', label: 'Red Soil' },
                    { value: 'Alluvial Soil', label: 'Alluvial Soil' },
                    { value: 'Loamy', label: 'Loamy' },
                    { value: 'Sandy Loam', label: 'Sandy Loam' },
                    { value: 'Clay', label: 'Clay' },
                  ]}
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" icon={Plus} className="w-full">
                Add Plot
              </Button>
            </form>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              {farms.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No separate plots added yet.</p>
              ) : (
                farms.map((f) => (
                  <div key={f.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{f.farm_name}</div>
                      <div className="text-slate-500">{f.land_area} {f.land_unit} • {f.soil_type || 'Loamy'}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFarm(f.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Remove plot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

