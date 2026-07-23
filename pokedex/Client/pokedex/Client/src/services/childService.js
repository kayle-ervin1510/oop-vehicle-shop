import api from './api'

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export async function fetchChildren(userId) {
  const { data: parentRows } = await api.get('/Parent_Profile', {
    params: { user_id: `eq.${userId}`, select: 'id,child_id,preferred_name' },
  })
  if (!parentRows?.length) return []

  const children = await Promise.all(
    parentRows.map(async (pp) => {
      const { data: cpRows } = await api.get('/Children_Profile', {
        params: { child_id: `eq.${pp.child_id}`, select: '*' },
      })
      const cp = cpRows?.[0]
      if (!cp) return null
      return { parentProfile: pp, childProfile: cp }
    })
  )

  return children.filter(Boolean)
}

export async function createChild(userId, childName) {
  const childLinkId = generateUUID()

  const { data: ppData } = await api.post('/Parent_Profile', {
    user_id: userId,
    preferred_name: childName,
    child_id: childLinkId,
    activity_log: 0,
    screen_time: 0,
    child_screen_time: 0,
  })
  const pp = Array.isArray(ppData) ? ppData[0] : ppData

  const { data: cpData } = await api.post('/Children_Profile', {
    child_name: childName,
    child_id: childLinkId,
    screen_time_goal: false,
    child_screen_time: 0,
  })
  const cp = Array.isArray(cpData) ? cpData[0] : cpData

  return { parentProfile: pp, childProfile: cp }
}

export async function updateChildName(childProfileId, newName) {
  await api.patch(`/Children_Profile?id=eq.${childProfileId}`, {
    child_name: newName,
  })
}

export async function deleteChild(childProfileId, parentProfileId) {
  // Delete app rows first (FK constraint)
  await Promise.all([
    api.delete(`/Time_Restricted_Apps?child_id=eq.${childProfileId}`),
    api.delete(`/Time_Unlimited_Apps?child_id=eq.${childProfileId}`),
    api.delete(`/Unauthorized_Apps?child_id=eq.${childProfileId}`),
    api.delete(`/App_Restrictions?child_id=eq.${childProfileId}`),
  ])
  await api.delete(`/Children_Profile?id=eq.${childProfileId}`)
  await api.delete(`/Parent_Profile?id=eq.${parentProfileId}`)
}
