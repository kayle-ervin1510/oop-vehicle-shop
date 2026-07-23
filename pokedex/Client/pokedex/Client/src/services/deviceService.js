import api from './api'

export async function fetchDevicesForChild(childId) {
  const { data } = await api.get('/Connected_Devices', {
    params: { child_id: `eq.${childId}`, select: 'Device_id,Device_name' },
  })
  return (data || []).map(row => ({ id: row.Device_id, name: row.Device_name }))
}

export async function addDevice(childId, deviceName) {
  const { data } = await api.post('/Connected_Devices', {
    child_id: childId,
    Device_name: deviceName,
    Add_Device: new Date().toISOString(),
  })
  const row = Array.isArray(data) ? data[0] : data
  return { id: row.Device_id, name: row.Device_name }
}

export async function removeDevice(deviceId) {
  await api.delete(`/Connected_Devices?Device_id=eq.${deviceId}`)
}
