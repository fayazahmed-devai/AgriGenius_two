import React from 'react';
import { Badge, Card } from '../common/UIComponents.jsx';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Droplet,
  Layers,
  Thermometer,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export function CropRecommendationCard({ recommendation }) {
  const {
    cropName,
    suitabilityScore,
    suitabilityLevel,
    reason,
    soilCompatibility,
    climateCompatibility,
    waterRequirement,
    estimatedDurationDays,
    sowingPeriod,
    risks = [],
    nextSteps = [],
  } = recommendation;

  const scoreColor =
    suitabilityScore >= 80
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : suitabilityScore >= 60
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';

  const badgeVariant =
    suitabilityLevel === 'high' ? 'forest' : suitabilityLevel === 'medium' ? 'harvest' : 'rose';

  return (
    <Card hover className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">{cropName}</h3>
            <Badge variant={badgeVariant}>{suitabilityLevel.toUpperCase()} SUITABILITY</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {estimatedDurationDays} Days Duration
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Sowing: {sowingPeriod}
            </span>
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl border text-center font-bold text-sm ${scoreColor}`}>
          <div className="text-lg leading-none">{suitabilityScore}</div>
          <div className="text-[10px] uppercase tracking-wide opacity-80">Score</div>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
        {reason}
      </p>

      {/* Compatibility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-forest-600" /> Soil Match
          </span>
          <p className="text-slate-800">{soilCompatibility}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-harvest-600" /> Climate Match
          </span>
          <p className="text-slate-800">{climateCompatibility}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-blue-600" /> Water Requirement
          </span>
          <p className="text-slate-800">{waterRequirement}</p>
        </div>
      </div>

      {/* Risks & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
        {risks.length > 0 && (
          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Potential Cultivation Risks
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              {risks.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
        )}
        {nextSteps.length > 0 && (
          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-forest-600" /> Recommended Action Items
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              {nextSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

export function SoilHealthCard({ report }) {
  const {
    overallAssessment,
    soilPHStatus,
    nutrientAssessment = {},
    potentialDeficiencies = [],
    potentialExcesses = [],
    suitableCrops = [],
    improvementPractices = [],
    additionalTestingRequired = [],
  } = report;

  return (
    <Card className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Soil Health & Fertility Analysis</h3>
        <p className="text-sm text-slate-600 mt-1">{overallAssessment}</p>
      </div>

      {/* Soil Parameter Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Soil pH Status</div>
          <div className="text-sm font-bold text-slate-800 mt-1">{soilPHStatus}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Nitrogen (N)</div>
          <div className="text-sm font-bold text-forest-700 mt-1">{nutrientAssessment.nitrogen}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Phosphorus (P)</div>
          <div className="text-sm font-bold text-forest-700 mt-1">{nutrientAssessment.phosphorus}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Potassium (K)</div>
          <div className="text-sm font-bold text-forest-700 mt-1">{nutrientAssessment.potassium}</div>
        </div>
      </div>

      {/* Deficiencies & Excesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {potentialDeficiencies.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900">Identified Nutrient Deficiencies:</span>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              {potentialDeficiencies.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}
        {potentialExcesses.length > 0 && (
          <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 space-y-1">
            <span className="font-bold text-rose-900">Excesses or Salinity Risks:</span>
            <ul className="list-disc list-inside space-y-0.5 text-rose-800">
              {potentialExcesses.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Soil Improvement Practices */}
      {improvementPractices.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Recommended Soil Improvement & Conditioning
          </h4>
          <div className="space-y-1.5">
            {improvementPractices.map((p, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Naturally Compatible Crops */}
      {suitableCrops.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Naturally Compatible Crops:</span>
          {suitableCrops.map((crop, idx) => (
            <Badge key={idx} variant="slate">
              {crop}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}

export function FertilizerAdvisoryCard({ advisory }) {
  const { cropName, growthStage, nutrientAssessment = [], recommendations = [], safetyPrecautions = [] } = advisory;

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{cropName} Fertilizer Advisory</h3>
          <p className="text-xs text-slate-500">Target Phenological Stage: <span className="font-semibold text-forest-700">{growthStage}</span></p>
        </div>
      </div>

      {nutrientAssessment.length > 0 && (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
          <span className="font-bold">Stage Nutrient Demand: </span>
          {nutrientAssessment.join(' ')}
        </div>
      )}

      {/* Table of Recommended Fertilizers */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
            <tr>
              <th className="px-3 py-2.5">Category</th>
              <th className="px-3 py-2.5">Application Timing</th>
              <th className="px-3 py-2.5">Method</th>
              <th className="px-3 py-2.5">Estimated Quantity</th>
              <th className="px-3 py-2.5">Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recommendations.map((rec, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="px-3 py-2 font-medium text-slate-800">{rec.fertilizerCategory}</td>
                <td className="px-3 py-2 text-slate-600">{rec.applicationTiming}</td>
                <td className="px-3 py-2 text-slate-600">{rec.applicationMethod}</td>
                <td className="px-3 py-2 text-forest-700 font-semibold">
                  {rec.quantity ? `${rec.quantity} ${rec.quantityUnit || ''}` : 'As per soil test'}
                </td>
                <td className="px-3 py-2 text-slate-600 max-w-xs">{rec.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {safetyPrecautions.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
          <span className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> Fertilizer Safety & Application Protocols
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800">
            {safetyPrecautions.map((sp, idx) => (
              <li key={idx}>{sp}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

export function DiseaseResultCard({ report, signedImageUrl }) {
  const {
    cropName,
    possibleConditions = [],
    preventiveMeasures = [],
    integratedPestManagement = [],
    treatmentGuidance = [],
    safetyWarnings = [],
    expertConsultationRequired,
  } = report;

  return (
    <Card className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Crop Health Diagnostic Analysis</h3>
          <p className="text-xs text-slate-500 mt-0.5">Crop Evaluated: <span className="font-semibold text-slate-800">{cropName}</span></p>
        </div>
        {expertRequiredBadge(expertConsultationRequired)}
      </div>

      {signedImageUrl && (
        <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <img src={signedImageUrl} alt="Uploaded Crop Specimen" className="w-full h-48 object-cover" />
        </div>
      )}

      {/* Conditions list */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identified Potential Pathogens / Disorders</h4>
        <div className="grid grid-cols-1 gap-3">
          {possibleConditions.map((cond, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">{cond.name}</span>
                <Badge variant={cond.confidenceLevel === 'high' ? 'rose' : cond.confidenceLevel === 'medium' ? 'harvest' : 'slate'}>
                  Confidence: {cond.confidenceLevel.toUpperCase()}
                </Badge>
              </div>
              {cond.supportingSymptoms?.length > 0 && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Observed Indicators: </span>
                  {cond.supportingSymptoms.join(', ')}
                </div>
              )}
              {cond.alternativeCauses?.length > 0 && (
                <div className="text-xs text-slate-500">
                  <span className="font-semibold">Alternative Explanations: </span>
                  {cond.alternativeCauses.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* IPM and Organic Remedies */}
      {integratedPestManagement.length > 0 && (
        <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 space-y-2">
          <span className="font-bold text-forest-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-forest-600" /> Integrated Pest Management (IPM) & Biological Controls
          </span>
          <ul className="text-xs text-forest-800 list-disc list-inside space-y-1">
            {integratedPestManagement.map((ipm, idx) => (
              <li key={idx}>{ipm}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Treatment Guidance */}
      {treatmentGuidance.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Remedial Action Plan</h4>
          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside bg-slate-50 p-3 rounded-lg border border-slate-100">
            {treatmentGuidance.map((tg, idx) => (
              <li key={idx}>{tg}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function expertRequiredBadge(required) {
  if (!required) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
      <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Expert Field Verification Required
    </span>
  );
}

export function CultivationTimeline({ activities = [], onToggleTask, calendarId }) {
  return (
    <div className="space-y-4">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((act, index) => {
          const isDone = Boolean(act.completed);
          return (
            <div key={index} className="relative group">
              {/* Dot */}
              <button
                type="button"
                onClick={() => onToggleTask && onToggleTask(calendarId, index, !isDone)}
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition ${
                  isDone ? 'bg-forest-600 text-white' : 'bg-white border-2 border-slate-300 text-transparent hover:border-forest-500'
                }`}
                title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
              </button>

              <div className={`p-4 rounded-xl border transition ${
                isDone ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-forest-700 uppercase tracking-wide">
                    Day {act.dayFromStart} - {act.dayToStart}
                  </span>
                  <Badge variant={act.importance === 'critical' ? 'rose' : act.importance === 'high' ? 'harvest' : 'slate'}>
                    {act.importance}
                  </Badge>
                </div>
                <h4 className={`text-base font-bold text-slate-900 mt-1 ${isDone ? 'line-through text-slate-500' : ''}`}>
                  {act.stage}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

