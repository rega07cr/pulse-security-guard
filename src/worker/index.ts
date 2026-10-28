import { Hono } from 'hono'
type Env = { ASSETS: Fetcher }
const app = new Hono<{ Bindings: Env }>()
app.get('/api/health', (c) => c.json({ ok: true }))
app.post('/api/subscribe', async (c) => {
  const body = await c.req.json<{ email?: string }>().catch(() => ({}) as { email?: string })
  const email = body.email?.trim() ?? ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return c.json({ error: 'Email non valida.' }, 400)
  return c.json({ ok: true })
})
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))
export default app
