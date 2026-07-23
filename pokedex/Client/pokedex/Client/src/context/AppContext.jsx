import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import * as userService from '../services/userService'
import * as childService from '../services/childService'
import * as appService from '../services/appService'
import * as deviceService from '../services/deviceService'

const AppContext = createContext(null)

const SCREEN_TIME_HISTORY = [
  {
    label: 'Today',
    date: 'June 9th, 2026',
    totalMinutes: 327,
    apps: [
      { name: 'Amazon', minutes: 42, hourly: [
        { label: '3:00 PM', hour: 15, minutes: 30 },
        { label: '7:00 PM', hour: 19, minutes: 12 },
      ]},
      { name: 'Minecraft', minutes: 255, hourly: [
        { label: '2:00 AM', hour: 2, minutes: 45 },
        { label: '9:00 AM', hour: 9, minutes: 30 },
        { label: '2:00 PM', hour: 14, minutes: 60 },
        { label: '5:00 PM', hour: 17, minutes: 60 },
        { label: '8:00 PM', hour: 20, minutes: 60 },
      ]},
      { name: 'Google', minutes: 30, hourly: [
        { label: '10:00 AM', hour: 10, minutes: 15 },
        { label: '4:00 PM', hour: 16, minutes: 15 },
      ]},
    ],
  },
  {
    label: 'Yesterday',
    date: 'June 8th, 2026',
    totalMinutes: 960,
    apps: [
      { name: 'Amazon', minutes: 135, hourly: [
        { label: '11:00 AM', hour: 11, minutes: 60 },
        { label: '3:00 PM', hour: 15, minutes: 75 },
      ]},
      { name: 'Minecraft', minutes: 780, hourly: [
        { label: '12:00 AM', hour: 0, minutes: 120 },
        { label: '2:00 AM', hour: 2, minutes: 90 },
        { label: '9:00 AM', hour: 9, minutes: 60 },
        { label: '12:00 PM', hour: 12, minutes: 120 },
        { label: '4:00 PM', hour: 16, minutes: 120 },
        { label: '8:00 PM', hour: 20, minutes: 120 },
        { label: '11:00 PM', hour: 23, minutes: 60 },
      ]},
      { name: 'Google', minutes: 45, hourly: [
        { label: '1:00 PM', hour: 13, minutes: 25 },
        { label: '6:00 PM', hour: 18, minutes: 20 },
      ]},
    ],
  },
  {
    label: 'June 7th',
    date: 'June 7th, 2026',
    totalMinutes: 720,
    apps: [
      { name: 'Amazon', minutes: 60, hourly: [
        { label: '2:00 PM', hour: 14, minutes: 60 },
      ]},
      { name: 'Minecraft', minutes: 600, hourly: [
        { label: '8:00 AM', hour: 8, minutes: 60 },
        { label: '11:00 AM', hour: 11, minutes: 120 },
        { label: '3:00 PM', hour: 15, minutes: 120 },
        { label: '7:00 PM', hour: 19, minutes: 120 },
        { label: '10:00 PM', hour: 22, minutes: 60 },
        { label: '11:30 PM', hour: 23, minutes: 60 },
      ]},
      { name: 'Google', minutes: 60, hourly: [
        { label: '10:00 AM', hour: 10, minutes: 30 },
        { label: '5:00 PM', hour: 17, minutes: 30 },
      ]},
    ],
  },
  {
    label: 'June 6th',
    date: 'June 6th, 2026',
    totalMinutes: 195,
    apps: [
      { name: 'Amazon', minutes: 15, hourly: [
        { label: '4:00 PM', hour: 16, minutes: 15 },
      ]},
      { name: 'Minecraft', minutes: 150, hourly: [
        { label: '3:00 PM', hour: 15, minutes: 90 },
        { label: '7:00 PM', hour: 19, minutes: 60 },
      ]},
      { name: 'Google', minutes: 30, hourly: [
        { label: '12:00 PM', hour: 12, minutes: 30 },
      ]},
    ],
  },
  {
    label: 'June 5th',
    date: 'June 5th, 2026',
    totalMinutes: 480,
    apps: [
      { name: 'Amazon', minutes: 90, hourly: [
        { label: '1:00 PM', hour: 13, minutes: 50 },
        { label: '6:00 PM', hour: 18, minutes: 40 },
      ]},
      { name: 'Minecraft', minutes: 330, hourly: [
        { label: '4:00 PM', hour: 16, minutes: 120 },
        { label: '7:00 PM', hour: 19, minutes: 120 },
        { label: '10:00 PM', hour: 22, minutes: 90 },
      ]},
      { name: 'Google', minutes: 60, hourly: [
        { label: '9:00 AM', hour: 9, minutes: 30 },
        { label: '3:00 PM', hour: 15, minutes: 30 },
      ]},
    ],
  },
]

const PARENT_SCREEN_TIME = [
  {
    label: 'Today',
    date: 'June 9th, 2026',
    totalMinutes: 214,
    apps: [
      { name: 'Email', minutes: 75, hourly: [
        { label: '8:00 AM', hour: 8, minutes: 30 },
        { label: '12:00 PM', hour: 12, minutes: 25 },
        { label: '5:00 PM', hour: 17, minutes: 20 },
      ]},
      { name: 'Chrome', minutes: 90, hourly: [
        { label: '9:00 AM', hour: 9, minutes: 45 },
        { label: '2:00 PM', hour: 14, minutes: 45 },
      ]},
      { name: 'Zap App', minutes: 49, hourly: [
        { label: '7:30 AM', hour: 7, minutes: 20 },
        { label: '6:00 PM', hour: 18, minutes: 29 },
      ]},
    ],
  },
  {
    label: 'Yesterday',
    date: 'June 8th, 2026',
    totalMinutes: 390,
    apps: [
      { name: 'Email', minutes: 120, hourly: [
        { label: '8:00 AM', hour: 8, minutes: 60 },
        { label: '2:00 PM', hour: 14, minutes: 60 },
      ]},
      { name: 'Chrome', minutes: 210, hourly: [
        { label: '9:00 AM', hour: 9, minutes: 90 },
        { label: '1:00 PM', hour: 13, minutes: 60 },
        { label: '7:00 PM', hour: 19, minutes: 60 },
      ]},
      { name: 'Zap App', minutes: 60, hourly: [
        { label: '7:00 AM', hour: 7, minutes: 30 },
        { label: '5:00 PM', hour: 17, minutes: 30 },
      ]},
    ],
  },
  {
    label: 'June 7th',
    date: 'June 7th, 2026',
    totalMinutes: 155,
    apps: [
      { name: 'Email', minutes: 45, hourly: [
        { label: '8:00 AM', hour: 8, minutes: 45 },
      ]},
      { name: 'Chrome', minutes: 80, hourly: [
        { label: '10:00 AM', hour: 10, minutes: 40 },
        { label: '3:00 PM', hour: 15, minutes: 40 },
      ]},
      { name: 'Zap App', minutes: 30, hourly: [
        { label: '6:30 PM', hour: 18, minutes: 30 },
      ]},
    ],
  },
]

function buildChildObject(parentProfile, childProfile, apps, devices, restrictions) {
  // Build stoppedApps and require-flag map from App_Restrictions rows
  const stoppedApps = {}
  const restrictionMap = {}
  restrictions.forEach(r => {
    restrictionMap[r.app_name] = r
    if (!r.is_allowed) stoppedApps[r.app_name] = true
  })

  // Merge persist require flags into time-restricted app objects
  const timeRestrictedWithFlags = apps.timeRestricted.map(app => ({
    ...app,
    requirePassword: restrictionMap[app.name]?.require_password ?? false,
    requireEmail: restrictionMap[app.name]?.require_email ?? false,
  }))

  return {
    id: childProfile.id,
    parentProfileId: parentProfile.id,
    child_id: parentProfile.child_id,
    name: childProfile.child_name,
    screenTimeHistory: SCREEN_TIME_HISTORY, // intentionally mock — no history table in schema
    dailyGoalMinutes: null,                  // intentionally session-only — schema has boolean, not integer
    stoppedApps,
    devices,
    apps: { ...apps, timeRestricted: timeRestrictedWithFlags },
  }
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [children_, setChildren] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const configuredRestrictions = useRef(new Set())

  // Restore session on page reload
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setInitializing(false); return }
      try {
        const user = await userService.fetchUserById(session.user.id)
        if (!user) { setInitializing(false); return }
        setCurrentUser(user)
        const childPairs = await childService.fetchChildren(user.id)
        const populated = await Promise.all(
          childPairs.map(async ({ parentProfile, childProfile }) => {
            const [apps, devices, restrictions] = await Promise.all([
              appService.fetchAppsForChild(childProfile.id),
              deviceService.fetchDevicesForChild(childProfile.id),
              appService.fetchAppRestrictions(childProfile.id),
            ])
            return buildChildObject(parentProfile, childProfile, apps, devices, restrictions)
          })
        )
        setChildren(populated)
      } catch { /* session present but data unavailable — stay logged out */ }
      finally { setInitializing(false) }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function logActivity(childName, appName, action) {
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setActivityLog(prev => [{
      id: now.getTime() + Math.random(),
      time,
      date: 'June 9th, 2026',
      childName,
      appName,
      action,
    }, ...prev])
  }

  async function registerUser(userData) {
    try {
      const user = await userService.createUser(userData)
      return { user }
    } catch (err) {
      return { error: err.response?.data?.message || err.message }
    }
  }

  async function verifyEmail(email, token) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    if (error) return { error: error.message }
    return { ok: true }
  }

  async function login(usernameOrEmail, password) {
    try {
      setLoading(true)
      setError(null)
      const user = await userService.findUser(usernameOrEmail, password)
      if (!user) return { ok: false, error: 'Invalid credentials' }

      setCurrentUser(user)

      // Load all children and their apps from Supabase
      const childPairs = await childService.fetchChildren(user.id)
      const populated = await Promise.all(
        childPairs.map(async ({ parentProfile, childProfile }) => {
          const [apps, devices, restrictions] = await Promise.all([
            appService.fetchAppsForChild(childProfile.id),
            deviceService.fetchDevicesForChild(childProfile.id),
            appService.fetchAppRestrictions(childProfile.id),
          ])
          return buildChildObject(parentProfile, childProfile, apps, devices, restrictions)
        })
      )
      setChildren(populated)
      return { ok: true }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unknown error'
      setError(msg)
      return { ok: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    supabase.auth.signOut()
    setCurrentUser(null)
    setChildren([])
    setActivityLog([])
    configuredRestrictions.current.clear()
  }

  async function findUserByEmail(email) {
    try {
      return await userService.findUserByEmail(email)
    } catch {
      return null
    }
  }

  async function resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      })
      if (error) setError(error.message)
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteAccount() {
    try {
      setLoading(true)
      await Promise.all(children_.map(c =>
        childService.deleteChild(c.id, c.parentProfileId)
      ))
      // delete_user_account() deletes auth.users which cascades to public.Users
      await supabase.rpc('delete_user_account')
      await supabase.auth.signOut()
      setChildren([])
      setCurrentUser(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateParentProfile(updates) {
    try {
      const mapped = {}
      if (updates.firstName !== undefined) mapped.first_name = updates.firstName
      if (updates.preferredName !== undefined) mapped.preferred_name = updates.preferredName
      if (updates.username !== undefined) mapped.username = updates.username
      if (updates.email !== undefined) mapped.email = updates.email

      // Keep Supabase Auth in sync when email changes
      if (updates.email !== undefined) {
        const { error } = await supabase.auth.updateUser({ email: updates.email })
        if (error) throw error
      }

      await userService.updateUser(currentUser.id, mapped)
      setCurrentUser(prev => ({ ...prev, ...mapped, ...updates }))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  async function changePassword(currentPw, newPw) {
    try {
      // Re-authenticate to verify current password before allowing a change
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPw,
      })
      if (verifyError) return false
      const { error } = await supabase.auth.updateUser({ password: newPw })
      return !error
    } catch {
      return false
    }
  }

  async function addChild(childData) {
    try {
      setLoading(true)
      setError(null)

      const { parentProfile, childProfile } = await childService.createChild(
        currentUser.id,
        childData.name
      )

      const restrictedNames = childData.timeRestrictedApps
        .split(',').map(a => a.trim()).filter(Boolean)
      const unlimitedNames = childData.timeUnlimitedApps
        .split(',').map(a => a.trim()).filter(Boolean)
      const unauthorizedNames = childData.unauthorizedApps
        .split(',').map(a => a.trim()).filter(Boolean)

      const [restrictedRows, unlimitedRows, unauthorizedRows] = await Promise.all([
        Promise.all(restrictedNames.map(name =>
          appService.addTimeRestrictedApp(childProfile.id, name, 60)
        )),
        Promise.all(unlimitedNames.map(name =>
          appService.addTimeUnlimitedApp(childProfile.id, name)
        )),
        Promise.all(unauthorizedNames.map(name =>
          appService.addUnauthorizedApp(childProfile.id, name)
        )),
      ])

      const apps = {
        timeRestricted: restrictedRows.map(row => ({
          id: row.id,
          name: row.app_name,
          hours: 1,
          minutes: 0,
          requirePassword: false,
          requireEmail: false,
        })),
        timeUnlimited: unlimitedRows.map(row => ({ id: row.id, name: row.app_name })),
        unauthorized: unauthorizedRows.map(row => ({ id: row.id, name: row.app_name })),
      }

      const newChild = buildChildObject(parentProfile, childProfile, apps, [], [])
      setChildren(prev => [...prev, newChild])
      return newChild.id
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  async function removeChild(childId) {
    const child = children_.find(c => c.id === childId)
    if (!child) return
    try {
      setLoading(true)
      await childService.deleteChild(child.id, child.parentProfileId)
      setChildren(prev => prev.filter(c => c.id !== childId))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateChildName(childId, newName) {
    const child = children_.find(c => c.id === childId)
    if (!child) return
    try {
      await childService.updateChildName(child.id, newName)
      setChildren(prev =>
        prev.map(c => (c.id === childId ? { ...c, name: newName } : c))
      )
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  function setChildGoal(childId, minutes) {
    setChildren(prev =>
      prev.map(c => (c.id === childId ? { ...c, dailyGoalMinutes: minutes } : c))
    )
  }

  async function toggleStopApp(childId, appName) {
    const child = children_.find(c => c.id === childId)
    const isStopping = child ? !child.stoppedApps[appName] : true
    try {
      await appService.upsertAppRestriction(childId, appName, { is_allowed: !isStopping })
      setChildren(prev =>
        prev.map(c => {
          if (c.id !== childId) return c
          return { ...c, stoppedApps: { ...c.stoppedApps, [appName]: isStopping } }
        })
      )
      if (child) {
        logActivity(child.name, appName,
          isStopping
            ? `Stopped ${appName} for ${child.name}`
            : `Resumed ${appName} for ${child.name}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  async function updateAppRestriction(childId, appName, updates) {
    const child = children_.find(c => c.id === childId)
    if (!child) return

    const existing = child.apps.timeRestricted.find(a => a.name === appName)
    if (!existing) return

    const newH = updates.hours ?? existing.hours ?? 0
    const newM = updates.minutes ?? existing.minutes ?? 0
    const totalMinutes = newH * 60 + newM

    try {
      await appService.updateTimeRestrictedApp(existing.id, totalMinutes)
      await appService.upsertAppRestriction(childId, appName, {
        require_password: updates.requirePassword ?? existing.requirePassword ?? false,
        require_email: updates.requireEmail ?? existing.requireEmail ?? false,
      })
      setChildren(prev =>
        prev.map(c => {
          if (c.id !== childId) return c
          return {
            ...c,
            apps: {
              ...c.apps,
              timeRestricted: c.apps.timeRestricted.map(app =>
                app.name === appName ? { ...app, ...updates } : app
              ),
            },
          }
        })
      )

      const timeParts = []
      if (newH > 0) timeParts.push(`${newH} hr${newH !== 1 ? 's' : ''}`)
      if (newM > 0) timeParts.push(`${newM} min`)
      const timeStr = timeParts.join(' and ') || '0 min'
      const key = `${childId}:${appName}`
      const isInitialSet = !configuredRestrictions.current.has(key)
      configuredRestrictions.current.add(key)
      if (isInitialSet) {
        logActivity(child.name, appName,
          `You set ${child.name}'s ${appName} restrictions to ${timeStr}`)
      } else {
        logActivity(child.name, appName,
          `You added an additional ${timeStr} to ${child.name}'s ${appName} time`)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  async function removeApp(childId, listType, appName) {
    const child = children_.find(c => c.id === childId)
    if (!child) return

    const list = child.apps[listType]
    let appId

    if (listType === 'timeRestricted') {
      appId = list.find(a => a.name === appName)?.id
    } else {
      appId = list.find(a => a.name === appName)?.id
    }

    try {
      if (appId) {
        if (listType === 'timeRestricted') await appService.deleteTimeRestrictedApp(appId)
        else if (listType === 'timeUnlimited') await appService.deleteTimeUnlimitedApp(appId)
        else if (listType === 'unauthorized') await appService.deleteUnauthorizedApp(appId)
      }
      // Best-effort cleanup of any App_Restrictions metadata for this app
      try {
        await appService.deleteAppRestriction(childId, appName)
      } catch { /* no restriction row is fine */ }

      setChildren(prev =>
        prev.map(c => {
          if (c.id !== childId) return c
          const updated =
            listType === 'timeRestricted'
              ? list.filter(a => a.name !== appName)
              : list.filter(a => a.name !== appName)
          return { ...c, apps: { ...c.apps, [listType]: updated } }
        })
      )

      if (child) {
        const action =
          listType === 'unauthorized'
            ? `${child.name}'s access to ${appName} has been unblocked`
            : listType === 'timeUnlimited'
            ? `${child.name}'s unlimited access to ${appName} has been removed`
            : `You removed ${appName} from ${child.name}'s restricted apps`
        logActivity(child.name, appName, action)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  async function addApp(childId, listType, appName) {
    const trimmed = appName.trim()
    if (!trimmed) return
    const child = children_.find(c => c.id === childId)
    if (!child) return

    const list = child.apps[listType]
    const alreadyExists = list.some(a => a.name.toLowerCase() === trimmed.toLowerCase())
    if (alreadyExists) return

    try {
      let newEntry
      if (listType === 'timeRestricted') {
        const row = await appService.addTimeRestrictedApp(child.id, trimmed, 60)
        newEntry = { id: row.id, name: row.app_name, hours: 1, minutes: 0, requirePassword: false, requireEmail: false }
      } else if (listType === 'timeUnlimited') {
        const row = await appService.addTimeUnlimitedApp(child.id, trimmed)
        newEntry = { id: row.id, name: row.app_name }
      } else if (listType === 'unauthorized') {
        const row = await appService.addUnauthorizedApp(child.id, trimmed)
        newEntry = { id: row.id, name: row.app_name }
      }

      setChildren(prev =>
        prev.map(c => {
          if (c.id !== childId) return c
          return { ...c, apps: { ...c.apps, [listType]: [...c.apps[listType], newEntry] } }
        })
      )

      if (child) {
        const actionMap = {
          timeRestricted: `You set ${child.name}'s ${trimmed} restrictions to 1 hr 0 min`,
          timeUnlimited: `${child.name}'s access to ${trimmed} has been approved with unlimited time`,
          unauthorized: `${child.name}'s access to ${trimmed} has been blocked`,
        }
        logActivity(child.name, trimmed, actionMap[listType])
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  async function addDevice(childId, deviceName) {
    const trimmed = deviceName.trim()
    if (!trimmed) return
    const child = children_.find(c => c.id === childId)
    if (!child) return
    if (child.devices.some(d => d.name.toLowerCase() === trimmed.toLowerCase())) return
    try {
      const newDevice = await deviceService.addDevice(child.id, trimmed)
      setChildren(prev =>
        prev.map(c => {
          if (c.id !== childId) return c
          return { ...c, devices: [...c.devices, newDevice] }
        })
      )
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  async function removeDevice(childId, deviceId) {
    try {
      await deviceService.removeDevice(deviceId)
      setChildren(prev =>
        prev.map(c => {
          if (c.id !== childId) return c
          return { ...c, devices: c.devices.filter(d => d.id !== deviceId) }
        })
      )
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  function getChild(childId) {
    return children_.find(c => c.id === childId) || null
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        children: children_,
        parentScreenTime: PARENT_SCREEN_TIME,
        activityLog,
        loading,
        initializing,
        error,
        registerUser,
        verifyEmail,
        login,
        logout,
        findUserByEmail,
        resetPassword,
        deleteAccount,
        updateParentProfile,
        changePassword,
        addChild,
        removeChild,
        updateChildName,
        setChildGoal,
        toggleStopApp,
        updateAppRestriction,
        removeApp,
        addApp,
        addDevice,
        removeDevice,
        getChild,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext)
}
