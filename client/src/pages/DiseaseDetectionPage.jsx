import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { analyzeDisease } from '../services/api.js';
import { Button, Input, Select, Textarea, Card } from '../components/common/UIComponents.jsx';
import { ImageUploader } from '../components/agriculture/ImageUploader.jsx';
import { DiseaseResultCard } from '../components/agriculture/AdvisoryCards.jsx';
import { LoadingScreen, AdvisoryWarning } from '../components/common/FeedbackComponents.jsx';
import { Bug, Printer, Sparkles, RefreshCw } from 'lucide-react';

export default function DiseaseDetectionPage() {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    cropName: 'Chili (Pepper)',
    affectedPart: 'Leaf',
    symptoms: 'Upward curling of leaves, stunted new shoots, faint mosaic yellowing and puckered leaf margins.',
    durationDays: 4,
    visibleDamage: 'Tiny pale insects scurrying under the young leaves.',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('cropName', formData.cropName);
      data.append('affectedPart', formData.affectedPart);
      data.append('symptoms', formData.symptoms);
      data.append('durationDays', String(formData.durationDays));
      if (formData.visibleDamage) data.append('visibleDamage', formData.visibleDamage);
      data.append('language', language);

      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await analyzeDisease(data);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Failed to complete disease diagnosis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Bug className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crop Disease & Pest Diagnostic Scanner</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multimodal diagnosis: Describe visible foliar symptoms and attach an optional specimen photo for IPM remediation.
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
              label="Affected Crop"
              value={formData.cropName}
              onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              required
            />

            <Select
              label="Affected Plant Part"
              value={formData.affectedPart}
              onChange={(e) => setFormData({ ...formData, affectedPart: e.target.value })}
              options={[
                { value: 'Leaf', label: 'Leaf / Foliage' },
                { value: 'Stem', label: 'Stem / Branch' },
                { value: 'Flower', label: 'Flower / Bud' },
                { value: 'Fruit', label: 'Fruit / Pod / Grain' },
                { value: 'Root', label: 'Root / Crown' },
                { value: 'Whole Plant', label: 'Entire Plant / Wilting' },
              ]}
            />

            <Input
              label="Duration of Symptoms (Days)"
              type="number"
              min="1"
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="Observable Symptoms & Lesion Details"
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            placeholder="Describe spots, concentric rings, chlorosis, powder, wilting, or scorching..."
            required
            rows={3}
          />

          <Input
            label="Visible Insects, Mites, or Structural Damage (Optional)"
            value={formData.visibleDamage}
            onChange={(e) => setFormData({ ...formData, visibleDamage: e.target.value })}
            placeholder="e.g. Aphids, webbing under leaves, stem bore holes, chewing marks..."
          />

          {/* Photo uploader */}
          <ImageUploader onImageSelected={setImageFile} selectedImage={imageFile} />

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" variant="primary" isLoading={loading} icon={Sparkles}>
              Run AI Diagnostic Scan
            </Button>
            {result && (
              <Button type="button" variant="ghost" size="sm" icon={RefreshCw} onClick={() => setResult(null)}>
                Clear Diagnosis
              </Button>
            )}
          </div>
        </form>
      </Card>

      {loading && <LoadingScreen message="Scanning visual pathology markers and calculating IPM remediation protocols..." />}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && result.analysis && (
        <div className="space-y-6">
          <AdvisoryWarning
            warnings={result.analysis.safetyWarnings}
            expertRequired={result.analysis.expertConsultationRequired}
          />
          <DiseaseResultCard report={result.analysis} signedImageUrl={result.imagePath} />
        </div>
      )}
    </div>
  );
}

