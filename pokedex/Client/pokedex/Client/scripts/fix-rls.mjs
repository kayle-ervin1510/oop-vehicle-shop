import pg from 'pg'
const { Client } = pg

const connectionString = process.argv[2]

if (!connectionString) {
  console.error('Usage: node scripts/fix-rls.mjs "YOUR_CONNECTION_STRING"')
  console.error('')
  console.error('Find it at: Supabase → Settings → Database → Connection string (URI tab)')
  console.error('It looks like: postgresql://postgres:[password]@db.xxxx.supabase.co:5432/postgres')
  process.exit(1)
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })

await client.connect()
console.log('Connected to database.')

const tables = [
  'Parent_Profile',
  'Children_Profile',
  'Time_Restricted_Apps',
  'Time_Unlimited_Apps',
  'Unauthorized_Apps',
  'App_Restrictions',
]

for (const table of tables) {
  await client.query(`ALTER TABLE "${table}" DISABLE ROW LEVEL SECURITY`)
  console.log(`✓ RLS disabled on ${table}`)
}

await client.end()
console.log('\nDone! You can now create child profiles in the app.')
