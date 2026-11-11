import axios from 'axios';
import { supabase } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase access token to every outgoing request
apiClient.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      // In dev fallback mode
      const devUserId = localStorage.getItem('agroai_dev_user_id') || '00000000-0000-0000-0000-000000000001';
      config.headers['x-dev-user-id'] = devUserId;
    }
  } catch (err) {
    console.warn('Could not retrieve Supabase session token:', err);
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to format errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// =============================================================================
// API SERVICE METHODS
// =============================================================================

// Profile & Farms
export const getProfile = () => apiClient.get('/profile');
export const updateProfile = (data) => apiClient.put('/profile', data);
export const getFarms = () => apiClient.get('/farms');
export const createFarm = (data) => apiClient.post('/farms', data);
export const deleteFarm = (id) => apiClient.delete(`/farms/${id}`);

// Crop Recommendations
export const recommendCrop = (data) => apiClient.post('/crop/recommend', data);
export const getCropRecommendations = () => apiClient.get('/crop/recommendations');
export const getCropRecommendationById = (id) => apiClient.get(`/crop/recommendations/${id}`);
export const deleteCropRecommendation = (id) => apiClient.delete(`/crop/recommendations/${id}`);

// Soil Reports
export const analyzeSoil = (data) => apiClient.post('/soil/analyze', data);
export const getSoilReports = () => apiClient.get('/soil/reports');
export const getSoilReportById = (id) => apiClient.get(`/soil/reports/${id}`);
export const deleteSoilReport = (id) => apiClient.delete(`/soil/reports/${id}`);

// Fertilizer Advisories
export const recommendFertilizer = (data) => apiClient.post('/fertilizer/recommend', data);
export const getFertilizerAdvisories = () => apiClient.get('/fertilizer/advisories');
export const getFertilizerAdvisoryById = (id) => apiClient.get(`/fertilizer/advisories/${id}`);

// Irrigation Advisories
export const recommendIrrigation = (data) => apiClient.post('/irrigation/recommend', data);
export const getIrrigationAdvisories = () => apiClient.get('/irrigation/advisories');
export const getIrrigationAdvisoryById = (id) => apiClient.get(`/irrigation/advisories/${id}`);

// Disease Detection
export const analyzeDisease = (formData) => apiClient.post('/disease/analyze', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getDiseaseReports = () => apiClient.get('/disease/reports');
export const getDiseaseReportById = (id) => apiClient.get(`/disease/reports/${id}`);

// Cultivation Calendar
export const generateCalendar = (data) => apiClient.post('/calendar/generate', data);
export const getCalendars = () => apiClient.get('/calendar');
export const getCalendarById = (id) => apiClient.get(`/calendar/${id}`);
export const updateCalendarActivity = (id, activityIndex, completed) => apiClient.put(`/calendar/${id}`, { activityIndex, completed });
export const deleteCalendar = (id) => apiClient.delete(`/calendar/${id}`);

// Chatbot
export const sendChatMessage = (data) => apiClient.post('/chat/conversations', data);
export const getConversations = () => apiClient.get('/chat/conversations');
export const getConversationMessages = (id) => apiClient.get(`/chat/conversations/${id}`);
export const deleteConversation = (id) => apiClient.delete(`/chat/conversations/${id}`);

// Dashboard
export const getDashboardSummary = () => apiClient.get('/dashboard/summary');
export const getRecentActivities = () => apiClient.get('/dashboard/recent-activities');
export const getUpcomingTasks = () => apiClient.get('/dashboard/upcoming-tasks');

