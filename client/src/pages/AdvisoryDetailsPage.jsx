import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getCropRecommendationById,
  getSoilReportById,
  getFertilizerAdvisoryById,
  getIrrigationAdvisoryById,
  getDiseaseReportById,
  getCalendarById,
} from '../services/api.js';
import { Button, Card, Badge } from '../components/common/UIComponents.jsx';
import {
  CropRecommendationCard,
  SoilHealthCard,
  FertilizerAdvisoryCard,
  DiseaseResultCard,
  CultivationTimeline,
} from '../components/agriculture/AdvisoryCards.jsx';
import { LoadingScreen, AdvisoryWarning } from '../components/common/FeedbackComponents.jsx';
import { ArrowLeft, Printer, Calendar, Clock, Compass, FlaskConical, Wheat, Droplets, Bug } from 'lucide-react';

export default function AdvisoryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError(null);

      // Attempt to load across report types by ID
      const fetchers = [
        { type: 'crop', fn: () => getCropRecommendationById(id) },
        { type: 'soil', fn: () => getSoilReportById(id) },
        { type: 'fertilizer', fn: () => getFertilizerAdvisoryById(id) },
        { type: 'irrigation', fn: () => getIrrigationAdvisoryById(id) },
        { type: 'disease', fn: () => getDiseaseReportById(id) },
        { type: 'calendar', fn: () => getCalendarById(id) },
      ];

      for (const item of fetchers) {
        try {
          const res = await item.fn();
          if (res?.data) {
            setReport(res.data);
            setReportType(item.type);
            setLoading(false);
            return;
          }
        } catch {
          // Continue trying next advisory type
        }
      }

      setError('The requested advisory report could not be found or access is restricted.');
      setLoading(false);
    }

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return <LoadingScreen message="Retrieving advisory report details..." />;
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <Card className="p-8 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">Report Unavailable</h2>
          <p className="text-xs text-slate-500">{error || 'Unable to locate report.'}</p>
          <div className="pt-2">
            <Link to="/history">
              <Button variant="secondary" icon={ArrowLeft}>
                Back to Advisory History
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to History</span>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Meta Header */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="forest">{reportType?.toUpperCase()} REPORT</Badge>
            <span className="text-xs text-slate-400">ID: {report.id}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Generated on {new Date(report.created_at || Date.now()).toLocaleDateString()} at{' '}
            {new Date(report.created_at || Date.now()).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Render matching report layout */}
      {reportType === 'crop' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-900">
            <strong>Input Context: </strong>
            {report.input_data?.state}, {report.input_data?.district} • {report.input_data?.season} Season • {report.input_data?.soilType}
          </div>
          <AdvisoryWarning
            warnings={report.recommendations?.warnings}
            expertRequired={report.recommendations?.expertConsultationRequired}
          />
          <div className="grid grid-cols-1 gap-6">
            {report.recommendations?.recommendations?.map((rec, idx) => (
              <CropRecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {reportType === 'soil' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Soil Sample: </strong>
            {report.soil_data?.soilType} • pH {report.soil_data?.soilPH} • Texture: {report.soil_data?.texture || 'Loamy'}
          </div>
          <AdvisoryWarning warnings={report.analysis?.warnings} />
          <SoilHealthCard report={report.analysis} />
        </div>
      )}

      {reportType === 'fertilizer' && (
        <div className="space-y-6">
          <AdvisoryWarning warnings={report.advisory?.warnings} />
          <FertilizerAdvisoryCard advisory={report.advisory} />
        </div>
      )}

      {reportType === 'disease' && (
        <div className="space-y-6">
          <AdvisoryWarning
            warnings={report.analysis?.safetyWarnings}
            expertRequired={report.analysis?.expertConsultationRequired}
          />
          <DiseaseResultCard report={report.analysis} signedImageUrl={report.signedImageUrl} />
        </div>
      )}

      {reportType === 'calendar' && (
        <div className="space-y-6">
          <CultivationTimeline
            activities={report.activities?.activities || report.activities || []}
            calendarId={report.id}
          />
        </div>
      )}
    </div>
  );
}

