import express from 'express'
import { SiweMessage } from 'siwe'
import { generateToken } from '../middleware/auth.js'

const router = express.Router()
const nonces = new Map()

// GET /api/auth/message
router.get('/message', (req, res) => {
  try {
    const nonce = Math.random().toString(36).substring(2, 12)

    const origin = req.get('origin') || 'http://localhost:5173'
    const originUrl = new URL(origin)
    const domain = originUrl.hostname

    const message = new SiweMessage({
      domain,
      uri: origin,
      version: '1',
      chainId: 11155111,
      nonce,
      statement: 'Log in to Faucet Token App'
    }).prepareMessage()

    nonces.set(nonce, true)
    setTimeout(() => nonces.delete(nonce), 10 * 60 * 1000)

    res.json({
      success: true,
      data: { message, nonce }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating message' })
  }
})

// POST /api/auth/signin
// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { message, signature, nonce } = req.body;

    if (!message || !signature || !nonce) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    if (!nonces.has(nonce)) {
      return res.status(400).json({ success: false, message: 'Invalid nonce' });
    }

    const siweMsg = new SiweMessage(message);
    const result = await siweMsg.verify({ signature });

    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Bad signature' });
    }

    // ✅ Use the recovered address from SIWE verification
    const recoveredAddress = result.data.address;

    // Invalidate nonce after use
    nonces.delete(nonce);

    // Issue JWT bound to recovered address
    const token = generateToken(recoveredAddress);

    res.json({
      success: true,
      data: {
        token,
        address: recoveredAddress,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error signing in' });
  }
});
export default router
