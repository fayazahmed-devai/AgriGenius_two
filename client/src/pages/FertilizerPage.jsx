import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { recommendFertilizer } from '../services/api.js';
import { Button, Input, Select, Card } from '../components/common/UIComponents.jsx';
import { FertilizerAdvisoryCard } from '../components/agriculture/AdvisoryCards.jsx';
import { LoadingScreen, AdvisoryWarning } from '../components/common/FeedbackComponents.jsx';
import { Wheat, Printer, Sparkles, RefreshCw } from 'lucide-react';

export default function FertilizerPage() {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    cropName: 'Cotton',
    cropVariety: 'Bt Cotton Hybrid',
    growthStage: 'Vegetative',
    landArea: 2.0,
    landUnit: 'acre',
    soilType: 'Black Cotton Soil',
    soilPH: 7.5,
    nitrogen: 200,
    phosphorus: 35,
    potassium: 190,
    farmingMethod: 'Integrated/Balanced',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
        language,
      };

      const res = await recommendFertilizer(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Failed to generate fertilizer guidance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-harvest-100 text-harvest-700 flex items-center justify-center">
              <Wheat className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fertilizer & Nutrient Advisory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate phenological stage-wise fertilizer requirements avoiding nitrogen over-application and chemical wastage.
          </p>
        </div>

        {result && (
          <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()} className="no-print">
            {t('downloadPdf')}
          </Button>
        )}
      </div>

      <Card className="no-print space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Target Crop"
              value={formData.cropName}
              onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              required
            />

            <Input
              label="Cultivar / Variety"
              value={formData.cropVariety}
              onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
              placeholder="e.g. Basmati 1121"
            />

            <Select
              label="Current Phenological Growth Stage"
              value={formData.growthStage}
              onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
              options={[
                { value: 'Land Preparation', label: 'Land Preparation / Basal' },
                { value: 'Basal/Sowing', label: 'At Sowing / Transplanting' },
                { value: 'Vegetative', label: 'Early Vegetative Growth' },
                { value: 'Tillering/Branching', label: 'Active Tillering / Branching' },
                { value: 'Flowering', label: 'Flowering / Panicle Emergence' },
                { value: 'Fruiting/Grain Filling', label: 'Fruit Formation / Grain Filling' },
                { value: 'Pre-Harvest', label: 'Maturity / Pre-Harvest' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Land Area"
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
              label="Farming Practice"
              value={formData.farmingMethod}
              onChange={(e) => setFormData({ ...formData, farmingMethod: e.target.value })}
              options={[
                { value: 'Integrated/Balanced', label: 'Integrated / Balanced Nutrition' },
                { value: 'Organic', label: 'Certified Organic / Natural' },
                { value: 'Conventional', label: 'Conventional Chemical' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" variant="primary" isLoading={loading} icon={Sparkles}>
              Calculate Nutrient Schedule
            </Button>
            {result && (
              <Button type="button" variant="ghost" size="sm" icon={RefreshCw} onClick={() => setResult(null)}>
                Clear Advisory
              </Button>
            )}
          </div>
        </form>
      </Card>

      {loading && <LoadingScreen message="Calculating split nutrient dosage and chemical safety protocols..." />}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && result.advisory && (
        <div className="space-y-6">
          <AdvisoryWarning warnings={result.advisory.warnings} />
          <FertilizerAdvisoryCard advisory={result.advisory} />
        </div>
      )}
    </div>
  );
}

