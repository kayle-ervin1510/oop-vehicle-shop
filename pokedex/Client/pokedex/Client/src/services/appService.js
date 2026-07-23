import api from './api'

export async function fetchAppsForChild(childProfileId) {
  const [restrictedRes, unlimitedRes, unauthorizedRes] = await Promise.all([
    api.get('/Time_Restricted_Apps', { params: { child_id: `eq.${childProfileId}` } }),
    api.get('/Time_Unlimited_Apps', { params: { child_id: `eq.${childProfileId}` } }),
    api.get('/Unauthorized_Apps', { params: { child_id: `eq.${childProfileId}` } }),
  ])

  const timeRestricted = (restrictedRes.data || []).map(row => ({
    id: row.id,
    name: row.app_name,
    hours: Math.floor((row.Edit_Time || 0) / 60),
    minutes: (row.Edit_Time || 0) % 60,
    requirePassword: false,
    requireEmail: false,
  }))

  const timeUnlimited = (unlimitedRes.data || []).map(row => ({
    id: row.id,
    name: row.app_name,
  }))

  const unauthorized = (unauthorizedRes.data || []).map(row => ({
    id: row.id,
    name: row.app_name,
  }))

  return { timeRestricted, timeUnlimited, unauthorized }
}

// Time-restricted apps
export async function addTimeRestrictedApp(childProfileId, appName, totalMinutes) {
  const { data } = await api.post('/Time_Restricted_Apps', {
    child_id: childProfileId,
    app_name: appName,
    Edit_Time: totalMinutes,
  })
  return Array.isArray(data) ? data[0] : data
}

export async function updateTimeRestrictedApp(id, totalMinutes) {
  await api.patch(`/Time_Restricted_Apps?id=eq.${id}`, { Edit_Time: totalMinutes })
}

export async function deleteTimeRestrictedApp(id) {
  await api.delete(`/Time_Restricted_Apps?id=eq.${id}`)
}

// Time-unlimited apps
export async function addTimeUnlimitedApp(childProfileId, appName) {
  const { data } = await api.post('/Time_Unlimited_Apps', {
    child_id: childProfileId,
    app_name: appName,
  })
  return Array.isArray(data) ? data[0] : data
}

export async function deleteTimeUnlimitedApp(id) {
  await api.delete(`/Time_Unlimited_Apps?id=eq.${id}`)
}

// Unauthorized apps
export async function addUnauthorizedApp(childProfileId, appName) {
  const { data } = await api.post('/Unauthorized_Apps', {
    child_id: childProfileId,
    app_name: appName,
  })
  return Array.isArray(data) ? data[0] : data
}

export async function deleteUnauthorizedApp(id) {
  await api.delete(`/Unauthorized_Apps?id=eq.${id}`)
}

// App_Restrictions — backs toggleStopApp (is_allowed) and require flags
export async function fetchAppRestrictions(childId) {
  const { data } = await api.get('/App_Restrictions', {
    params: { child_id: `eq.${childId}` },
  })
  return data || []
}

// Only the columns included in `fields` are updated on conflict (PostgREST merge-duplicates)
export async function upsertAppRestriction(childId, appName, fields) {
  const { data } = await api.post(
    '/App_Restrictions',
    { child_id: childId, app_name: appName, ...fields },
    { headers: { Prefer: 'return=representation,resolution=merge-duplicates' } }
  )
  return Array.isArray(data) ? data[0] : data
}

export async function deleteAppRestriction(childId, appName) {
  await api.delete(
    `/App_Restrictions?child_id=eq.${childId}&app_name=eq.${encodeURIComponent(appName)}`
  )
}
