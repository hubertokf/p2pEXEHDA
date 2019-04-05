/* eslint-disable no-console */
'use strict'

const fs = require('fs')
const path = require('path')
const libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const PeerInfo = require('peer-info')
const KadDHT = require('libp2p-kad-dht')
const defaultsDeep = require('@nodeutils/defaults-deep')
const waterfall = require('async/waterfall')
const parallel = require('async/parallel')
const MulticastDNS = require('libp2p-mdns')
const Bootstrap = require('libp2p-bootstrap')
const Node = require('./node.js')
const protobuf = require('protobufjs')

class MyBundle extends libp2p {
  constructor (_options) {
    const defaults = {
      modules: {
        transport: [ TCP ],
        streamMuxer: [ Mplex ],
        connEncryption: [ SECIO ],
        peerDiscovery: [
            MulticastDNS
        ],
        // we add the DHT module that will enable Peer and Content Routing
        dht: KadDHT
      },
      config: {
        dht: {
          kBucketSize: 20
        },
        peerDiscovery: {
          mdns: {
            interval: 10000,
            enabled: true   
          }
        },
        EXPERIMENTAL: {
          dht: true
        }
      }
    }

    super(defaultsDeep(_options, defaults))
  }
}

function createNode (callback) {
  let node

  waterfall([
    (cb) => PeerInfo.create(cb),
    (peerInfo, cb) => {
      peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
      node = new MyBundle({
        peerInfo
      })
      node.start(cb)
    }
  ], (err) => callback(err, node))
}

parallel([
  (cb) => createNode(cb)
], (err, nodes) => {
  if (err) { throw err }

  const node3 = nodes[0]
  // console.log(node3._dht)
  console.log('node3: ',node3.peerInfo.id.toB58String())
  node3.peerInfo.multiaddrs.forEach((ma) => console.log(ma.toString()))

  node3.on('peer:discovery', (peer) => {
    if (node3.peerBook.has(peer)) return

    // node.peerBook.put(peer)
    console.log('Discovered:', peer.id.toB58String())

  })

})