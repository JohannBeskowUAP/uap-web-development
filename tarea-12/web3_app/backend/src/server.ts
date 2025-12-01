import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import faucetRoutes from './routes/faucet.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: (origin, callback) => {
    // Permitir cualquier origen en desarrollo
    console.log("CORS Origin:", origin)
    callback(null, true)
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/faucet', faucetRoutes)

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OK' })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`)
})

export default app
