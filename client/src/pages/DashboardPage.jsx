import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardSummary, getRecentActivities, getUpcomingTasks } from '../services/api.js';
import {
  WelcomeCard,
  StatisticsCard,
  QuickActionCard,
  RecentAdvisoriesList,
  UpcomingTasksList,
} from '../components/dashboard/DashboardComponents.jsx';
import { LoadingScreen } from '../components/common/FeedbackComponents.jsx';
import {
  Compass,
  FlaskConical,
  Bug,
  Wheat,
  Calendar,
  Layers,
  Bot,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, actRes, taskRes] = await Promise.allSettled([
          getDashboardSummary(),
          getRecentActivities(),
          getUpcomingTasks(),
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value?.data) {
          setSummary(sumRes.value.data);
        }
        if (actRes.status === 'fulfilled' && actRes.value?.data) {
          setRecentActivities(actRes.value.data);
        }
        if (taskRes.status === 'fulfilled' && taskRes.value?.data) {
          setUpcomingTasks(taskRes.value.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading farm operational telemetry..." />;
  }

  const counts = summary?.counts || {
    farms: 0,
    cropRecommendations: 0,
    soilReports: 0,
    fertilizerAdvisories: 0,
    irrigationAdvisories: 0,
    diseaseReports: 0,
    cultivationCalendars: 0,
    chatConversations: 0,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <WelcomeCard
        profile={profile || summary?.profile}
        completionPercent={summary?.profileCompletionPercent || 50}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Crop Advisories"
          value={counts.cropRecommendations}
          subtitle="Suitability calculations"
          icon={Compass}
          color="forest"
          href="/crop-recommendation"
        />
        <StatisticsCard
          title="Soil Tests"
          value={counts.soilReports}
          subtitle="Health assessments"
          icon={FlaskConical}
          color="harvest"
          href="/soil-analysis"
        />
        <StatisticsCard
          title="Disease Scans"
          value={counts.diseaseReports}
          subtitle="Pathology diagnoses"
          icon={Bug}
          color="rose"
          href="/disease-detection"
        />
        <StatisticsCard
          title="Farm Plots"
          value={counts.farms}
          subtitle="Monitored parcels"
          icon={Layers}
          color="blue"
          href="/profile"
        />
      </div>

      {/* Quick Action Triggers */}
      <QuickActionCard />

      {/* Split Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAdvisoriesList activities={recentActivities} />
        <UpcomingTasksList tasks={upcomingTasks} />
      </div>
    </div>
  );
}

