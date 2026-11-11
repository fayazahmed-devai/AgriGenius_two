import { generateAgroAdvisory } from './gemini.service.js';
import { buildCultivationCalendarPrompt } from '../prompts/agricultural.prompts.js';
import { cultivationCalendarResponseSchema } from '../schemas/agronomy.schema.js';

export async function generateCultivationCalendar(userId, inputData, supabaseClient) {
  const prompt = buildCultivationCalendarPrompt(inputData, inputData.language || 'en');
  const aiOutput = await generateAgroAdvisory(prompt, cultivationCalendarResponseSchema);

  let savedRecord = null;
  try {
    const { data, error } = await supabaseClient
      .from('cultivation_calendars')
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        crop_name: inputData.cropName,
        start_date: inputData.startDate,
        activities: aiOutput,
      })
      .select()
      .single();

    if (error) {
      console.warn('Could not persist calendar to Supabase:', error.message);
    } else {
      savedRecord = data;
    }
  } catch (err) {
    console.warn('Database error persisting calendar:', err.message);
  }

  return {
    id: savedRecord?.id || 'demo-cal-' + Date.now(),
    createdAt: savedRecord?.created_at || new Date().toISOString(),
    cropName: inputData.cropName,
    startDate: inputData.startDate,
    activities: aiOutput.activities,
    warnings: aiOutput.importantWarnings,
    durationDays: aiOutput.estimatedDurationDays,
  };
}

export async function getUserCalendars(userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('cultivation_calendars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Database error fetching calendars:', error.message);
    return [];
  }
  return data || [];
}

export async function getCalendarById(id, userId, supabaseClient) {
  const { data, error } = await supabaseClient
    .from('cultivation_calendars')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error('Cultivation calendar not found or access denied.');
  return data;
}

export async function updateCalendarActivity(id, userId, activityIndex, completed, supabaseClient) {
  // Fetch existing calendar
  const calendar = await getCalendarById(id, userId, supabaseClient);
  const updatedActivities = { ...calendar.activities };

  if (Array.isArray(updatedActivities.activities) && updatedActivities.activities[activityIndex]) {
    updatedActivities.activities[activityIndex].completed = completed;
  }

  const { data, error } = await supabaseClient
    .from('cultivation_calendars')
    .update({ activities: updatedActivities })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error('Failed to update calendar activity: ' + error.message);
  return data;
}

export async function deleteCalendar(id, userId, supabaseClient) {
  const { error } = await supabaseClient
    .from('cultivation_calendars')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error('Failed to delete calendar.');
  return true;
}

