# Rosaceae — Architecture (FROZEN DECISIONS)

## Identity
- No server-side accounts. Identity = deterministic hash.
- PeerID = SHA256(email.toLowerCase().trim() + ":" + password).substring(0,32)
- Same email+password ALWAYS yields the same PeerID. This is the "virtual MAC".
- We do NOT use hardware MAC addresses (not routable, randomized by modern OS).
- We do NOT use raw email/phone as ID (invalid chars, leaks identity).

## Transport
- All chat/data = WebRTC DataChannel via PeerJS. 100% device-to-device.
- Signaling server (PeerJS cloud OR local peerjs-server on :9000 with
  --cors-allow-origin "*") is used ONLY for the initial handshake.
  It never sees message content.
- Known limitation: ~10-20% of connections need TURN relay. Document this.
- Group calls capped at 4 peers (full-mesh bandwidth limit). This is a
  deliberate non-goal, not a bug.

## Storage (Local-First)
- IndexedDB via Dexie.js. Tables: messages, peers (routing table), settings.
- Nothing is lost on refresh. Nothing is sent to a central DB.

## Discovery ("registered networks")
- Gossip protocol over the DataChannel. On connect, peers exchange
  {"type":"peer_exchange","known_peers":[...]} and merge into local DB.
- Network grows organically; no central directory.

## Roaming
- Identity is stable across network changes. On disconnect: exponential
  backoff reconnect (1,2,4,8...s cap 30s), re-handshake, then CRDT/merge
  sync of missed messages.

## Stack
- Vite, React, TypeScript (strict), PeerJS, crypto-js, Dexie.js,
  ESLint v9 flat config with react-hooks rules.
