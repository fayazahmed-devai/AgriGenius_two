export async function getProfile(req, res, next) {
  try {
    const { data, error } = await req.supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) throw error;

    // Return empty profile object if row doesn't exist yet
    const profile = data || {
      id: req.user.id,
      email: req.user.email,
      full_name: req.user.user_metadata?.full_name || 'Farmer',
      preferred_language: 'en',
      farming_experience: 0,
      land_area: 2.5,
      land_unit: 'acre',
      country: 'India',
    };

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const {
      fullName,
      phone,
      country,
      state,
      district,
      village,
      preferredLanguage,
      farmingExperience,
      landArea,
      landUnit,
      farmingType,
      irrigationAvailable,
    } = req.body;

    const payload = {
      id: req.user.id,
      full_name: fullName,
      phone,
      country,
      state,
      district,
      village,
      preferred_language: preferredLanguage,
      farming_experience: farmingExperience,
      land_area: landArea,
      land_unit: landUnit,
      farming_type: farmingType,
      irrigation_available: irrigationAvailable,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await req.supabase
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

