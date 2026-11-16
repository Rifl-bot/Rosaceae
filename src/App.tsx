import { useEffect, useRef, useState } from 'react'
import Peer, { type DataConnection } from 'peerjs'

type Msg = { text: string; from: 'me' | 'them' }

function App() {
  const [peerId, setPeerId] = useState('Loading...')
  const [remoteId, setRemoteId] = useState('')
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')

  const peerRef = useRef<Peer | null>(null)
  const connRef = useRef<DataConnection | null>(null)

  const setupConnection = (conn: DataConnection) => {
    console.log('Setting up connection to:', conn.peer)
    connRef.current = conn

    conn.on('open', () => {
      console.log('✅ CONNECTION OPEN! Direct P2P link established.')
      setConnected(true)
    })

    conn.on('data', (data) => {
      console.log('Received data:', data)
      setMessages((m) => [...m, { text: String(data), from: 'them' }])
    })

    conn.on('close', () => {
      console.log('❌ Connection closed')
      setConnected(false)
    })

    conn.on('error', (err) => console.error('❌ Connection Error:', err))
  }

  useEffect(() => {
    console.log('Initializing Peer...')
    const peer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/'
    })
    peerRef.current = peer

    peer.on('open', (id) => {
      console.log('My ID is:', id)
      setPeerId(id)
    })

    peer.on('connection', (conn) => {
      console.log('📞 Incoming call from:', conn.peer)
      setupConnection(conn)
    })

    peer.on('error', (err) => console.error('❌ Peer Error:', err))

    return () => {
      console.log('Destroying peer...')
      peer.destroy()
    }
  }, [])

  const connect = () => {
    if (!remoteId || remoteId === peerId) {
      console.warn('Invalid ID or connecting to self')
      return
    }
    console.log('Dialing:', remoteId)
    const conn = peerRef.current?.connect(remoteId)
    if (conn) setupConnection(conn)
  }

  const send = () => {
    if (!draft.trim() || !connRef.current?.open) return
    connRef.current.send(draft)
    setMessages((m) => [...m, { text: draft, from: 'me' }])
    setDraft('')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: 640 }}>
      <h1>🌹 Rosaceae (Debug Mode)</h1>

      <p><strong>Your ID:</strong> <code>{peerId}</code></p>

      {!connected ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={remoteId}
            onChange={(e) => setRemoteId(e.target.value)}
            placeholder="Paste peer's ID here"
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={connect}>Connect</button>
        </div>
      ) : (
        <>
          <div style={{ height: 240, overflowY: 'auto', border: '1px solid #444', padding: 8, margin: '8px 0' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.from === 'me' ? 'right' : 'left' }}>
                <span style={{ color: m.from === 'me' ? '#7dd3fc' : '#86efac' }}>{m.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: 8 }}
            />
            <button onClick={send}>Send</button>
          </div>
        </>
      )}

      <p style={{ color: connected ? '#00ff00' : '#ff4444', marginTop: 16 }}>
        Status: {connected ? '🟢 Connected' : '🔴 Not Connected'}
      </p>
    </div>
  )
}

export default App
