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

function createNode1 (callback) {
  let node

  waterfall([
    (cb) => PeerInfo.create(cb),
    (peerInfo, cb) => {
      const config = {
        name: 'p2pe',
        version: '1.0.0',
        bootstrapers: [],
        modules: {},
        config: {}
      }
      peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
      protobuf.load(path.join(__dirname, './protocol_bkp.proto')).then((root) => {
        const node = new Node(peerInfo, root, config)
        console.log(node)

        node.start()
      })
    }
  ], (err) => callback(err, node))
}

function createNode2 (callback) {
  let node

  waterfall([
    (cb) => PeerInfo.create(cb),
    (peerInfo, cb) => {
      const config = {
        name: 'p2pe',
        version: '1.0.0',
        bootstrapers: ['/ip4/10.0.1.10/tcp/46543/ipfs/QmeKx6D3KmPMZnhnyLLWLSBwyZ3y3HQvJbJRJioG4o8Ug9'],
        modules: {},
        config: {}
      }
      peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
      protobuf.load(path.join(__dirname, './protocol_bkp.proto')).then((root) => {
        const node = new Node(peerInfo, root, config)
        console.log(node)

        node.start()
      })
    }
  ], (err) => callback(err, node))
}

parallel([
  (cb) => createNode1(cb),
  (cb) => createNode2(cb),
], (err, nodes) => {
  if (err) { throw err }
  console.log(nodes)

  const node1 = nodes[0]
  const node2 = nodes[1]
  console.log('node1: ',node1.peerInfo.id.toB58String())


  node2.on('peer:discovery', (peer3) => {
    if (node2.peerBook.has(peer3)) return

    // node.peerBook.put(peer)
    console.log('Discovered:', peer3.id.toB58String())
    
    parallel([
      (cb) => node1.dial(node2.peerInfo, cb),
      (cb) => node2.dial(peer3, cb),
      // Set up of the cons might take time
      (cb) => setTimeout(cb, 300)
    ], (err) => {
      if (err) { throw err }
  
      node1.peerRouting.findPeer(peer3.id, (err, peer) => {
        if (err) { throw err }
  
        console.log('Found it, multiaddrs are:')
        peer.multiaddrs.forEach((ma) => console.log(ma.toString()))
      })
    })
  })

})