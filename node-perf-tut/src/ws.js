// ============================================================================
// 📝 TASK 23 — WebSockets: the LIVE dashboard (bidirectional, at scale)
//             Wire this into server.js by sharing the http.Server instance.
// ============================================================================
// USE CASE: an admin dashboard showing live req/s, queue depth, and active
// import jobs — and the admin can PAUSE/RETRY a job from the UI. Bidirectional
// → WebSocket is genuinely the right tool here (contrast SSE in Task 22, which
// was right for one-way progress). Being able to articulate WHY each scenario
// picks a different transport is the whole lesson.
//
// 💡 STEP A — basic WS server (ws is installed):
//    import { WebSocketServer } from 'ws'
//    export function attachWs(httpServer) {
//      const wss = new WebSocketServer({ server: httpServer })
//      wss.on('connection', (socket) => { ... })
//    }
//    In server.js: const server = app.listen(...); attachWs(server)
//    (share ONE http server so WS and HTTP live on the same port — and so
//    nginx's upgrade config in Task 23b covers it).
//
// 💡 STEP B — heartbeats (mandatory, not optional):
//    Dead TCP connections don't always emit 'close' (laptop sleeps, network
//    drops). Without heartbeats you accumulate zombie sockets → a memory leak
//    (Task 24's theme AGAIN). Implement ping/pong:
//      every 30s, for each socket: if (!socket.isAlive) terminate();
//      else socket.isAlive=false, socket.ping(). On 'pong' → isAlive=true.
//    Clear the interval on wss 'close'. (Task 23b: nginx proxy_read_timeout
//    must exceed your ping interval or the proxy cuts idle sockets.)
//
// 💡 STEP C — THE SCALING TRAP (the senior differentiator):
//    Run 2+ instances (Task 13) behind nginx. Admin's socket connects to
//    instance A. The import worker (separate process!) finishes a job and
//    wants to notify. It has NO reference to that socket — the socket lives in
//    a DIFFERENT process's memory. Broadcasting only reaches clients on the
//    same instance → the admin misses events at random.
//    ✅ FIX: Redis pub/sub. Worker PUBLISHES events to a channel; EVERY
//    instance SUBSCRIBES and fans out to its own local sockets. (socket.io
//    has the Redis adapter that does exactly this — hand-roll it here to
//    understand it, name the library as the prod answer.)
//    LESSON, stated plainly: a WebSocket connection is STATEFUL and pinned to
//    one process. Any multi-instance realtime system needs an external
//    message bus to route events to wherever each connection lives. This is
//    THE thing "how would you scale WebSockets?" is fishing for.
//
// 💡 STEP D — bidirectional: handle inbound messages (pause/retry job) →
//    call importQueue methods. Validate/authorize every inbound message
//    (a WS is an open door — same input-trust rules as HTTP; don't skip authz
//    just because the socket was authed at connect time).
//
// 💡 STEP E — reconnection & missed events: client reconnects (browsers drop
//    sockets constantly) → how does it catch up on what it missed while gone?
//    (snapshot-on-connect + event stream, or sequence numbers). Discuss.
// ============================================================================

export function attachWs(_httpServer) {
  // TASK 23: implement per steps A-E above.
}
