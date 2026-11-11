export async function getDashboardSummary(req, res, next) {
  try {
    const userId = req.user.id;

    // Run parallel counts for real database records
    const [
      farmsRes,
      cropsRes,
      soilRes,
      fertRes,
      irrigRes,
      diseaseRes,
      calendarRes,
      chatRes,
      profileRes,
    ] = await Promise.all([
      req.supabase.from('farms').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      req.supabase.from('crop_recommendations').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      req.supabase.from('soil_reports').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      req.supabase.from('fertilizer_advisories').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      req.supabase.from('irrigation_advisories').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      req.supabase.from('disease_reports').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      req.supabase.from('cultivation_calendars').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      req.supabase.from('chat_conversations').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      req.supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    ]);

    const counts = {
      farms: farmsRes.count || 0,
      cropRecommendations: cropsRes.count || 0,
      soilReports: soilRes.count || 0,
      fertilizerAdvisories: fertRes.count || 0,
      irrigationAdvisories: irrigRes.count || 0,
      diseaseReports: diseaseRes.count || 0,
      cultivationCalendars: calendarRes.count || 0,
      chatConversations: chatRes.count || 0,
    };

    const totalAdvisoryReports =
      counts.cropRecommendations +
      counts.soilReports +
      counts.fertilizerAdvisories +
      counts.irrigationAdvisories +
      counts.diseaseReports;

    // Calculate profile completion percentage
    const profile = profileRes.data || {};
    const keyFields = ['full_name', 'state', 'district', 'land_area', 'farming_type', 'preferred_language'];
    const filledFields = keyFields.filter(f => profile[f] !== undefined && profile[f] !== null && profile[f] !== '');
    const profileCompletionPercent = Math.round((filledFields.length / keyFields.length) * 100);

    // Fetch 5 most recent activities across advisories
    const [recentCrops, recentDiseases, recentCalendars] = await Promise.all([
      req.supabase.from('crop_recommendations').select('id, created_at, input_data').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
      req.supabase.from('disease_reports').select('id, created_at, crop_name, symptoms').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
      req.supabase.from('cultivation_calendars').select('id, created_at, crop_name, start_date, activities').eq('user_id', userId).order('created_at', { ascending: false }).limit(2),
    ]);

    res.json({
      success: true,
      message: 'Dashboard summary retrieved',
      data: {
        counts,
        totalAdvisoryReports,
        profileCompletionPercent,
        profile,
        recentCrops: recentCrops.data || [],
        recentDiseases: recentDiseases.data || [],
        recentCalendars: recentCalendars.data || [],
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecentActivities(req, res, next) {
  try {
    const userId = req.user.id;
    // Query latest 5 items from crop, disease, and soil
    const [crops, diseases, soils] = await Promise.all([
      req.supabase.from('crop_recommendations').select('id, created_at, input_data').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      req.supabase.from('disease_reports').select('id, created_at, crop_name, symptoms').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      req.supabase.from('soil_reports').select('id, created_at, soil_data').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
    ]);

    const combined = [
      ...(crops.data || []).map(c => ({
        id: c.id,
        type: 'crop_recommendation',
        title: `Crop Recommendation (${c.input_data?.season || 'Season'})`,
        subtitle: `${c.input_data?.state || ''}, ${c.input_data?.district || ''}`,
        date: c.created_at,
        url: `/history`,
      })),
      ...(diseases.data || []).map(d => ({
        id: d.id,
        type: 'disease_report',
        title: `Disease Scan: ${d.crop_name}`,
        subtitle: d.symptoms ? d.symptoms.slice(0, 50) + '...' : '',
        date: d.created_at,
        url: `/history`,
      })),
      ...(soils.data || []).map(s => ({
        id: s.id,
        type: 'soil_report',
        title: `Soil Analysis: ${s.soil_data?.soilType || 'Soil'}`,
        subtitle: `pH: ${s.soil_data?.soilPH || 'N/A'}`,
        date: s.created_at,
        url: `/history`,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

    res.json({
      success: true,
      message: 'Recent activities retrieved',
      data: combined,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getUpcomingTasks(req, res, next) {
  try {
    const userId = req.user.id;
    const { data: calendars } = await req.supabase
      .from('cultivation_calendars')
      .select('id, crop_name, start_date, activities')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    const tasks = [];
    if (calendars) {
      for (const cal of calendars) {
        const activities = cal.activities?.activities || [];
        const pending = activities.filter(a => !a.completed).slice(0, 3);
        for (const p of pending) {
          tasks.push({
            calendarId: cal.id,
            cropName: cal.crop_name,
            stage: p.stage,
            description: p.description,
            importance: p.importance || 'medium',
            dayRange: `Day ${p.dayFromStart} - ${p.dayToStart}`,
            completed: p.completed || false,
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Upcoming agricultural tasks retrieved',
      data: tasks,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

