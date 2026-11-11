import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getCropRecommendations,
  getSoilReports,
  getFertilizerAdvisories,
  getIrrigationAdvisories,
  getDiseaseReports,
  deleteCropRecommendation,
  deleteSoilReport,
  deleteCalendar,
} from '../services/api.js';
import { Card, Button, Badge } from '../components/common/UIComponents.jsx';
import { LoadingScreen } from '../components/common/FeedbackComponents.jsx';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Compass,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  Calendar,
} from 'lucide-react';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllHistory();
  }, []);

  async function loadAllHistory() {
    setLoading(true);
    try {
      const [crops, soils, ferts, irrigs, diseases] = await Promise.allSettled([
        getCropRecommendations(),
        getSoilReports(),
        getFertilizerAdvisories(),
        getIrrigationAdvisories(),
        getDiseaseReports(),
      ]);

      const combined = [];

      if (crops.status === 'fulfilled' && crops.value?.data) {
        crops.value.data.forEach((c) => {
          combined.push({
            id: c.id,
            type: 'crop',
            typeLabel: 'Crop Recommendation',
            title: `Crop Advisory: ${c.input_data?.season || 'Season'} (${c.input_data?.state || ''})`,
            date: c.created_at,
            data: c,
          });
        });
      }

      if (soils.status === 'fulfilled' && soils.value?.data) {
        soils.value.data.forEach((s) => {
          combined.push({
            id: s.id,
            type: 'soil',
            typeLabel: 'Soil Health',
            title: `Soil Report: ${s.soil_data?.soilType || 'Soil'} (pH ${s.soil_data?.soilPH || 'N/A'})`,
            date: s.created_at,
            data: s,
          });
        });
      }

      if (ferts.status === 'fulfilled' && ferts.value?.data) {
        ferts.value.data.forEach((f) => {
          combined.push({
            id: f.id,
            type: 'fertilizer',
            typeLabel: 'Fertilizer Advisory',
            title: `Fertilizer: ${f.crop_name} (${f.input_data?.growthStage || ''})`,
            date: f.created_at,
            data: f,
          });
        });
      }

      if (irrigs.status === 'fulfilled' && irrigs.value?.data) {
        irrigs.value.data.forEach((i) => {
          combined.push({
            id: i.id,
            type: 'irrigation',
            typeLabel: 'Irrigation Plan',
            title: `Irrigation: ${i.crop_name} (${i.input_data?.irrigationMethod || ''})`,
            date: i.created_at,
            data: i,
          });
        });
      }

      if (diseases.status === 'fulfilled' && diseases.value?.data) {
        diseases.value.data.forEach((d) => {
          combined.push({
            id: d.id,
            type: 'disease',
            typeLabel: 'Disease Scan',
            title: `Disease Scan: ${d.crop_name}`,
            date: d.created_at,
            data: d,
          });
        });
      }

      combined.sort((a, b) => new Date(b.date) - new Date(a.date));
      setItems(combined);
    } catch (err) {
      console.warn('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (item) => {
    if (!confirm(`Are you sure you want to delete this ${item.typeLabel}?`)) return;

    try {
      if (item.type === 'crop') await deleteCropRecommendation(item.id);
      else if (item.type === 'soil') await deleteSoilReport(item.id);

      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.typeLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-forest-600" /> Advisory History & Farming Records
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review, print, or remove previously generated agricultural intelligence reports and crop scans.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by crop, season, or district..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'crop', 'soil', 'fertilizer', 'irrigation', 'disease'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  filterType === type
                    ? 'bg-forest-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All Records' : type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <LoadingScreen message="Loading historical agricultural records..." />
      ) : filteredItems.length === 0 ? (
        <Card className="p-12 text-center text-xs text-slate-400 space-y-2">
          <p className="text-sm font-semibold text-slate-600">No matching advisory records found.</p>
          <p>Try switching filters or generate a new advisory from the navigation menu.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const badgeVariant =
              item.type === 'crop'
                ? 'forest'
                : item.type === 'soil'
                ? 'harvest'
                : item.type === 'disease'
                ? 'rose'
                : 'slate';

            return (
              <Card key={`${item.type}-${item.id}`} hover className="flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant={badgeVariant}>{item.typeLabel}</Badge>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">ID: {item.id.slice(0, 8)}...</span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/history/${item.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-forest-700 hover:text-forest-800"
                    >
                      <span>View Report</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

