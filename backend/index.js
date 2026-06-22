const express = require('express')
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/shorten', async (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'url is required' })
  const code = nanoid(7)
  await pool.query('INSERT INTO urls (code, original_url) VALUES ($1, $2)', [code, url])
  res.json({ shortUrl: `http://localhost:3000/${code}` })
})

app.get('/:code', async (req, res) => {
  const { code } = req.params
  const result = await pool.query('SELECT original_url FROM urls WHERE code = $1', [code])
  if (result.rows.length === 0) return res.status(404).json({ error: 'URL not found' })
  res.redirect(result.rows[0].original_url)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
