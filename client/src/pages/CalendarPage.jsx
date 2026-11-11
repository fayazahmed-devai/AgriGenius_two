import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { generateCalendar, getCalendars, updateCalendarActivity, deleteCalendar } from '../services/api.js';
import { Button, Input, Select, Card } from '../components/common/UIComponents.jsx';
import { CultivationTimeline } from '../components/agriculture/AdvisoryCards.jsx';
import { LoadingScreen, AdvisoryWarning } from '../components/common/FeedbackComponents.jsx';
import { Calendar as CalendarIcon, Printer, Sparkles, Plus, Trash2 } from 'lucide-react';

export default function CalendarPage() {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    cropName: 'Paddy (Rice)',
    startDate: new Date().toISOString().split('T')[0],
    season: 'Kharif',
    state: 'Karnataka',
    district: 'Belagavi',
  });

  const [calendars, setCalendars] = useState([]);
  const [activeCalendar, setActiveCalendar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCalendars();
  }, []);

  async function loadCalendars() {
    try {
      const res = await getCalendars();
      if (res?.data && res.data.length > 0) {
        setCalendars(res.data);
        setActiveCalendar(res.data[0]);
      }
    } catch {
      // ignore
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await generateCalendar({ ...formData, language });
      await loadCalendars();
      setActiveCalendar(res.data);
    } catch (err) {
      setError(err.message || 'Failed to generate cultivation calendar.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (calId, activityIndex, completed) => {
    try {
      const res = await updateCalendarActivity(calId, activityIndex, completed);
      // Update local state
      setActiveCalendar(res.data);
      setCalendars((prev) =>
        prev.map((c) => (c.id === calId ? res.data : c))
      );
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleDeleteCalendar = async (id) => {
    if (!confirm('Are you sure you want to delete this cultivation calendar?')) return;
    try {
      await deleteCalendar(id);
      loadCalendars();
      if (activeCalendar?.id === id) setActiveCalendar(null);
    } catch (err) {
      alert('Failed to delete calendar: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crop Cultivation Calendar</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological field management from seed treatment to harvest. Track and check off tasks as you complete them.
          </p>
        </div>

        {activeCalendar && (
          <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()} className="no-print">
            {t('downloadPdf')}
          </Button>
        )}
      </div>

      {/* Form to generate new calendar */}
      <Card className="no-print space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-forest-600" /> Generate New Crop Schedule
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="Crop"
              value={formData.cropName}
              onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              required
            />
            <Input
              label="Sowing / Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Input
              label="District"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" isLoading={loading} icon={Sparkles}>
            Generate Cultivation Timeline
          </Button>
        </form>
      </Card>

      {loading && <LoadingScreen message="Constructing phenological stage timeline and crop management activities..." />}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Saved Calendars Selector */}
      {calendars.length > 0 && (
        <div className="no-print flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Saved Calendars:</span>
          {calendars.map((cal) => (
            <div
              key={cal.id}
              onClick={() => setActiveCalendar(cal)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition flex items-center gap-2 shrink-0 ${
                activeCalendar?.id === cal.id
                  ? 'bg-forest-100 text-forest-800 border-forest-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cal.crop_name} ({new Date(cal.start_date || cal.created_at).toLocaleDateString()})</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCalendar(cal.id);
                }}
                className="text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Calendar Display */}
      {activeCalendar && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeCalendar.crop_name || activeCalendar.cropName} Cultivation Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Start Date: {new Date(activeCalendar.start_date || activeCalendar.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <CultivationTimeline
            activities={activeCalendar.activities?.activities || activeCalendar.activities || []}
            calendarId={activeCalendar.id}
            onToggleTask={handleToggleTask}
          />
        </div>
      )}
    </div>
  );
}

