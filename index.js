'use strict'

const libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const PeerInfo = require('peer-info')
const MulticastDNS = require('libp2p-mdns')
const waterfall = require('async/waterfall')
const parallel = require('async/parallel')
const KadDHT = require('libp2p-kad-dht')

class MyBundle extends libp2p {
  constructor(peerInfo, peerBook, options) {
    const modules = {
      transport: [new TCP()],
      connection: {
        muxer: [Mplex],
        crypto: [SECIO]
      },
      DHT: KadDHT,
      discovery: [
        new MulticastDNS(peerInfo, { interval: 1000 })
      ]
    }
    super(modules, peerInfo, peerBook, options)
  }
}

function createNode(callback) {
  let node

  waterfall([
    (cb) => PeerInfo.create(cb),
    (peerInfo, cb) => {
      peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
      node = new MyBundle(peerInfo)
      node.start(cb)
    }
  ], (err) => callback(err, node))
}


parallel([
  (cb) => createNode(cb)
], (err, nodes) => {
  if (err) { throw err }

  const node1 = nodes[0]

  node1.on('peer:discovery', (peer) => console.log('Discovered:', peer.id.toB58String()))
})
