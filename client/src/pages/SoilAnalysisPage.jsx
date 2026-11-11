import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { analyzeSoil } from '../services/api.js';
import { Button, Input, Select, Textarea, Card } from '../components/common/UIComponents.jsx';
import { SoilHealthCard } from '../components/agriculture/AdvisoryCards.jsx';
import { LoadingScreen, AdvisoryWarning } from '../components/common/FeedbackComponents.jsx';
import { FlaskConical, Printer, Sparkles, RefreshCw } from 'lucide-react';

export default function SoilAnalysisPage() {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    soilType: 'Black Clay Soil',
    soilPH: 7.2,
    nitrogen: 190,
    phosphorus: 32,
    potassium: 220,
    organicCarbon: 0.45,
    electricalConductivity: 0.65,
    texture: 'Clay Loam',
    additionalNotes: 'Soil has moderate cracking in summer, slow drainage in monsoon.',
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
        soilPH: Number(formData.soilPH),
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
        potassium: formData.potassium ? Number(formData.potassium) : null,
        organicCarbon: formData.organicCarbon ? Number(formData.organicCarbon) : null,
        electricalConductivity: formData.electricalConductivity ? Number(formData.electricalConductivity) : null,
        language,
      };

      const res = await analyzeSoil(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Failed to complete soil analysis.');
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
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Soil Health & Nutrient Diagnostic</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Input soil laboratory test measurements or field observations to detect deficiencies and receive soil conditioning guidance.
          </p>
        </div>

        {result && (
          <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()} className="no-print">
            {t('downloadPdf')}
          </Button>
        )}
      </div>

      {/* Form */}
      <Card className="no-print space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Soil Classification"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              options={[
                { value: 'Black Clay Soil', label: 'Black Clay (Vertisol)' },
                { value: 'Red Sandy Loam', label: 'Red Sandy Loam' },
                { value: 'Alluvial Loam', label: 'Alluvial Loam' },
                { value: 'Laterite Soil', label: 'Laterite Acidic Soil' },
                { value: 'Sandy Soil', label: 'Sandy Soil' },
                { value: 'Heavy Clay', label: 'Heavy Clay' },
              ]}
            />

            <Input
              label="Soil pH (0 - 14)"
              type="number"
              step="0.1"
              value={formData.soilPH}
              onChange={(e) => setFormData({ ...formData, soilPH: e.target.value })}
              required
            />

            <Select
              label="Physical Texture"
              value={formData.texture}
              onChange={(e) => setFormData({ ...formData, texture: e.target.value })}
              options={[
                { value: 'Clay Loam', label: 'Clay Loam' },
                { value: 'Sandy Loam', label: 'Sandy Loam' },
                { value: 'Silty Clay', label: 'Silty Clay' },
                { value: 'Fine Sand', label: 'Fine Sand' },
                { value: 'Heavy Clay', label: 'Heavy Clay' },
              ]}
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Soil Nutrient Quantities (Laboratory Reported)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input
                label="Available Nitrogen (N kg/ha)"
                type="number"
                value={formData.nitrogen}
                onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
              />
              <Input
                label="Available Phosphorus (P kg/ha)"
                type="number"
                value={formData.phosphorus}
                onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
              />
              <Input
                label="Available Potassium (K kg/ha)"
                type="number"
                value={formData.potassium}
                onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
              />
              <Input
                label="Organic Carbon (%)"
                type="number"
                step="0.01"
                value={formData.organicCarbon}
                onChange={(e) => setFormData({ ...formData, organicCarbon: e.target.value })}
              />
            </div>
            <div className="max-w-xs">
              <Input
                label="Electrical Conductivity (dS/m)"
                type="number"
                step="0.01"
                value={formData.electricalConductivity}
                onChange={(e) => setFormData({ ...formData, electricalConductivity: e.target.value })}
              />
            </div>
          </div>

          <Textarea
            label="Additional Field Observations"
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            placeholder="e.g. Water ponding after heavy rains, white salt crusts on soil surface, poor germination in previous seasons..."
          />

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" variant="primary" isLoading={loading} icon={Sparkles}>
              Analyze Soil Health
            </Button>
            {result && (
              <Button type="button" variant="ghost" size="sm" icon={RefreshCw} onClick={() => setResult(null)}>
                Clear Analysis
              </Button>
            )}
          </div>
        </form>
      </Card>

      {loading && <LoadingScreen message="Evaluating soil nutrient stoichiometry and organic conditioning needs..." />}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && result.analysis && (
        <div className="space-y-6">
          <AdvisoryWarning warnings={result.analysis.warnings} />
          <SoilHealthCard report={result.analysis} />
        </div>
      )}
    </div>
  );
}

