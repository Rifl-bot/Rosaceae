# Task Backlog

## Phase 1 — Foundation (Weeks 1-4)
- [ ] T1: Login screen. Email + password -> deterministic PeerID. Persist
      session in IndexedDB. (See ARCHITECTURE.md Identity)
- [ ] T2: Dexie schema: messages, peers, settings. Migrations ready.
- [ ] T3: Chat UI shell (sidebar = peer list, main = message stream).
- [ ] T4: Send/receive over DataChannel, render messages from local DB.

## Phase 2 — Persistence + Discovery (Weeks 5-8)
- [ ] T5: Save every message to IndexedDB on send AND receive.
- [ ] T6: peer_exchange gossip: on connect, merge known_peers into DB.
- [ ] T7: Reconnect logic with exponential backoff.
- [ ] T8: ICE-restart on network change; verify no message loss.

## Phase 3 — Media (Weeks 9-11)
- [ ] T9: 1-on-1 voice call (getUserMedia + addStream).
- [ ] T10: Screen share with audio toggle.
- [ ] T11: Video sync ("watch together") via host-controlled play/seek
       messages over the DataChannel.

## Phase 4 — Polish + Docs (Week 12)
- [ ] T12: Typing indicators, unread badges, push-to-talk.
- [ ] T13: README + evaluation measurements (see DOC_REQUIREMENTS.md).
