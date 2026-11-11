import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { recommendIrrigation } from '../services/api.js';
import { Button, Input, Select, Card } from '../components/common/UIComponents.jsx';
import { LoadingScreen, AdvisoryWarning } from '../components/common/FeedbackComponents.jsx';
import { Droplets, Printer, Sparkles, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';

export default function IrrigationPage() {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    cropName: 'Tomato',
    growthStage: 'Flowering & Early Fruit Set',
    soilType: 'Red Loam',
    landArea: 1.5,
    landUnit: 'acre',
    irrigationMethod: 'Drip',
    waterAvailability: 'Moderate',
    lastRainfallDaysAgo: 6,
    temperature: 31,
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
        lastRainfallDaysAgo: formData.lastRainfallDaysAgo ? Number(formData.lastRainfallDaysAgo) : null,
        temperature: formData.temperature ? Number(formData.temperature) : null,
        language,
      };

      const res = await recommendIrrigation(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Failed to generate irrigation advisory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Precision Irrigation Advisor</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Determine optimal watering frequencies, water stress indicators, and drainage strategies based on crop phenology.
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
              label="Cultivated Crop"
              value={formData.cropName}
              onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              required
            />

            <Input
              label="Growth Stage"
              value={formData.growthStage}
              onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
              required
            />

            <Select
              label="Soil Type"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              options={[
                { value: 'Red Loam', label: 'Red Loam' },
                { value: 'Black Clay', label: 'Black Clay' },
                { value: 'Sandy Loam', label: 'Sandy Loam' },
                { value: 'Alluvial Soil', label: 'Alluvial Soil' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="Land Area"
              type="number"
              step="0.1"
              value={formData.landArea}
              onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
              required
            />

            <Select
              label="Irrigation Method"
              value={formData.irrigationMethod}
              onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
              options={[
                { value: 'Drip', label: 'Drip Irrigation' },
                { value: 'Sprinkler', label: 'Sprinkler System' },
                { value: 'Furrow', label: 'Furrow / Ridge' },
                { value: 'Flood/Surface', label: 'Surface / Flood' },
                { value: 'Rainfed', label: 'Rainfed (No System)' },
              ]}
            />

            <Select
              label="Water Availability"
              value={formData.waterAvailability}
              onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
              options={[
                { value: 'Abundant', label: 'Abundant' },
                { value: 'Moderate', label: 'Moderate' },
                { value: 'Limited', label: 'Limited' },
                { value: 'Scarce', label: 'Scarce' },
              ]}
            />

            <Input
              label="Days Since Last Rain"
              type="number"
              value={formData.lastRainfallDaysAgo}
              onChange={(e) => setFormData({ ...formData, lastRainfallDaysAgo: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" variant="primary" isLoading={loading} icon={Sparkles}>
              Calculate Water Plan
            </Button>
            {result && (
              <Button type="button" variant="ghost" size="sm" icon={RefreshCw} onClick={() => setResult(null)}>
                Clear Plan
              </Button>
            )}
          </div>
        </form>
      </Card>

      {loading && <LoadingScreen message="Estimating evapotranspiration rates and soil moisture retention..." />}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && result.advisory && (
        <div className="space-y-6">
          <AdvisoryWarning warnings={result.advisory.warnings} />

          <Card className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{result.advisory.cropName} Water Management Plan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Estimated Demand: <span className="font-bold text-blue-700">{result.advisory.waterRequirement}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.advisory.irrigationRecommendations?.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5 text-xs">
                  <div className="font-bold text-blue-900 text-sm">{rec.timing}</div>
                  <div className="text-slate-700"><span className="font-semibold">Technique: </span>{rec.method}</div>
                  <div className="text-slate-600">{rec.reason}</div>
                </div>
              ))}
            </div>

            {/* Conservation & Stress Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              {result.advisory.waterConservationMethods?.length > 0 && (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-forest-600" /> Water Conservation Practices
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {result.advisory.waterConservationMethods.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.advisory.waterStressIndicators?.length > 0 && (
                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" /> Crop Water Stress Indicators
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-amber-800">
                    {result.advisory.waterStressIndicators.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

