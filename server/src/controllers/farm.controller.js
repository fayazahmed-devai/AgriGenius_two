export async function getFarms(req, res, next) {
  try {
    const { data, error } = await req.supabase
      .from('farms')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      message: 'Farms retrieved successfully',
      data: data || [],
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function createFarm(req, res, next) {
  try {
    const { farmName, location, state, district, soilType, soilPh, landArea, landUnit, irrigationMethod } = req.body;

    const { data, error } = await req.supabase
      .from('farms')
      .insert({
        user_id: req.user.id,
        farm_name: farmName,
        location,
        state,
        district,
        soil_type: soilType,
        soil_ph: soilPh,
        land_area: landArea,
        land_unit: landUnit,
        irrigation_method: irrigationMethod,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getFarmById(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await req.supabase
      .from('farms')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Farm details retrieved',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateFarm(req, res, next) {
  try {
    const { id } = req.params;
    const { farmName, location, state, district, soilType, soilPh, landArea, landUnit, irrigationMethod } = req.body;

    const { data, error } = await req.supabase
      .from('farms')
      .update({
        farm_name: farmName,
        location,
        state,
        district,
        soil_type: soilType,
        soil_ph: soilPh,
        land_area: landArea,
        land_unit: landUnit,
        irrigation_method: irrigationMethod,
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Farm updated successfully',
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteFarm(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await req.supabase
      .from('farms')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Farm deleted successfully',
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

