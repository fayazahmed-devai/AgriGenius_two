import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { recommendCrop, getFarms } from '../services/api.js';
import { Button, Input, Select, Card } from '../components/common/UIComponents.jsx';
import { CropRecommendationCard } from '../components/agriculture/AdvisoryCards.jsx';
import { LoadingScreen, AdvisoryWarning } from '../components/common/FeedbackComponents.jsx';
import { Compass, Printer, RefreshCw, Sparkles, Filter } from 'lucide-react';

export default function CropRecommendationPage() {
  const { profile } = useAuth();
  const { language, t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [formData, setFormData] = useState({
    farmId: '',
    state: 'Karnataka',
    district: 'Dharwad',
    soilType: 'Black Soil',
    season: 'Kharif',
    landArea: 2.5,
    landUnit: 'acre',
    irrigationAvailable: true,
    soilPH: 6.8,
    nitrogen: 210,
    phosphorus: 45,
    potassium: 180,
    organicCarbon: 0.55,
    temperature: 28,
    humidity: 65,
    rainfall: 850,
    preferredCategory: 'Any',
    previousCrop: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        state: profile.state || prev.state,
        district: profile.district || prev.district,
        landArea: profile.land_area || prev.landArea,
        landUnit: profile.land_unit || prev.landUnit,
        irrigationAvailable: profile.irrigation_available ?? prev.irrigationAvailable,
      }));
    }
    loadFarms();
  }, [profile]);

  async function loadFarms() {
    try {
      const res = await getFarms();
      if (res?.data) setFarms(res.data);
    } catch {
      // ignore
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        landArea: Number(formData.landArea),
        soilPH: formData.soilPH ? Number(formData.soilPH) : null,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
        potassium: formData.potassium ? Number(formData.potassium) : null,
        organicCarbon: formData.organicCarbon ? Number(formData.organicCarbon) : null,
        temperature: formData.temperature ? Number(formData.temperature) : null,
        humidity: formData.humidity ? Number(formData.humidity) : null,
        rainfall: formData.rainfall ? Number(formData.rainfall) : null,
        farmId: formData.farmId || null,
        language,
      };

      const res = await recommendCrop(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Failed to generate crop recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Crop Recommendation Engine</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded suitability ranking based on regional soil classification, NPK levels, and agro-climatic zones.
          </p>
        </div>

        {result && (
          <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()} className="no-print">
            {t('downloadPdf')}
          </Button>
        )}
      </div>

      {/* Input Form */}
      <Card className="no-print space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Crop Season"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              options={[
                { value: 'Kharif', label: 'Kharif (Monsoon: Jun - Oct)' },
                { value: 'Rabi', label: 'Rabi (Winter: Nov - Mar)' },
                { value: 'Zaid', label: 'Zaid (Summer: Mar - Jun)' },
                { value: 'Whole Year', label: 'Perennial / Whole Year' },
              ]}
            />

            <Select
              label="Primary Soil Type"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              options={[
                { value: 'Black Soil (Vertisols)', label: 'Black Soil (Vertisols)' },
                { value: 'Red Soil', label: 'Red Soil' },
                { value: 'Alluvial Soil', label: 'Alluvial Soil' },
                { value: 'Laterite Soil', label: 'Laterite Soil' },
                { value: 'Loamy Soil', label: 'Loamy Soil' },
                { value: 'Sandy Loam', label: 'Sandy Loam' },
                { value: 'Clayey Soil', label: 'Clayey Soil' },
              ]}
            />

            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />

            <Input
              label="District"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              required
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

            <Select
              label="Irrigation Availability"
              value={formData.irrigationAvailable ? 'yes' : 'no'}
              onChange={(e) => setFormData({ ...formData, irrigationAvailable: e.target.value === 'yes' })}
              options={[
                { value: 'yes', label: 'Yes (Assured Irrigation)' },
                { value: 'no', label: 'No (Rainfed Only)' },
              ]}
            />
          </div>

          {/* Toggle Advanced Soil & Climate Parameters */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Optional Soil Lab & Weather Inputs' : '+ Add Soil Lab & Climate Data (Improves Accuracy)'}</span>
            </button>
          </div>

          {showAdvanced && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Soil Laboratory Measurements (Optional)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Input
                  label="Soil pH"
                  type="number"
                  step="0.1"
                  value={formData.soilPH}
                  onChange={(e) => setFormData({ ...formData, soilPH: e.target.value })}
                  placeholder="e.g. 6.5"
                />
                <Input
                  label="Nitrogen (N kg/ha)"
                  type="number"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  placeholder="e.g. 240"
                />
                <Input
                  label="Phosphorus (P kg/ha)"
                  type="number"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  placeholder="e.g. 40"
                />
                <Input
                  label="Potassium (K kg/ha)"
                  type="number"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  placeholder="e.g. 180"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <Input
                  label="Avg Temperature (°C)"
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder="e.g. 28"
                />
                <Input
                  label="Seasonal Rainfall (mm)"
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                  placeholder="e.g. 750"
                />
                <Input
                  label="Previous Season Crop"
                  value={formData.previousCrop}
                  onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                  placeholder="e.g. Cotton / Wheat"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" variant="primary" isLoading={loading} icon={Sparkles}>
              {t('submit')}
            </Button>
            {result && (
              <Button type="button" variant="ghost" size="sm" icon={RefreshCw} onClick={() => setResult(null)}>
                Clear Results
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Loading state */}
      {loading && <LoadingScreen message="Calculating regional agro-climatic suitability scores..." />}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Section */}
      {result && result.recommendations && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 space-y-1">
            <h3 className="text-sm font-bold text-forest-900">Regional Agronomic Assessment</h3>
            <p className="text-xs text-forest-800 leading-relaxed">{result.recommendations.summary}</p>
          </div>

          <AdvisoryWarning
            warnings={result.recommendations.warnings}
            expertRequired={result.recommendations.expertConsultationRequired}
          />

          <div className="grid grid-cols-1 gap-6">
            {result.recommendations.recommendations.map((rec, idx) => (
              <CropRecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

