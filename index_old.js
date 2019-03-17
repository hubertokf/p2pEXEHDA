'use strict'

const PeerInfo = require('peer-info')
const waterfall = require('async/waterfall')
const parallel = require('async/parallel')
const models = require("./models");
const Node = require("./node");
const CID = require('cids')

// var to store discovered nodes
var discoveredNodes = []

// function to create node using defined Node class with modules
function createNode(callback) {
  let node

  waterfall([
    (cb) => PeerInfo.create(cb),
    (peerInfo, cb) => {
      peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
      node = new Node(peerInfo)
      node.start(cb)
      
      // models.sequelize.sync().then(() => {
      //   models.Peer.findOne({
      //     where: { self: true }
      //   }).then(peer => {
      //     peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
      //     node = new Node(peerInfo)
      //     node.start(cb)
      //     // if (peer == null){
      //     //   peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
      //     //   node = new Node(peerInfo)
      //     //   node.start(cb)

      //     //   models.Peer.create({
      //     //     hash: peerInfo.id.toB58String(),
      //     //     self: true
      //     //   })
      //     //   .then(peer => {
      //     //     // console.log(peer.toJSON())
      //     //   });
      //     // }else{
      //     //   console.log(peer)
      //     // }
      //   })        
      // })
    }
  ], (err) => callback(err, node))
}

parallel([
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb),
  (cb) => createNode(cb)
], (err, nodes) => {
  if (err) { throw err }

  parallel([
    (cb) => nodes[0].dial(nodes[1].peerInfo, cb),
    (cb) => nodes[0].dial(nodes[2].peerInfo, cb),
    (cb) => nodes[0].dial(nodes[3].peerInfo, cb),
    (cb) => nodes[3].dial(nodes[4].peerInfo, cb),
    (cb) => nodes[3].dial(nodes[5].peerInfo, cb),
    (cb) => nodes[5].dial(nodes[6].peerInfo, cb),
    (cb) => nodes[6].dial(nodes[7].peerInfo, cb),
    (cb) => nodes[8].dial(nodes[0].peerInfo, cb),
    // Set up of the cons might take time
    (cb) => setTimeout(cb, 300)
  ], (err) => {
    if (err) { throw err }

    nodes[0].peerRouting.findPeer(nodes[7].peerInfo.id, (err, peer) => {
      if (err) { console.log("Peer not found") }
      else{
        console.log('Found it, multiaddrs are:')
        peer.multiaddrs.forEach((ma) => console.log(ma.toString()))
      }
    })

    // const cid = new CID('QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnL')

    // node6.contentRouting.provide(cid, (err) => {
    //   if (err) { throw err }

    //   console.log('Node %s is providing %s', node1.peerInfo.id.toB58String(), cid.toBaseEncodedString())

    //   node1.contentRouting.findProviders(cid, 5000, (err, providers) => {
    //     if (err || providers.length == 0) { 
    //       console.log('provider not found')
    //     }
    //     else{
    //       console.log('Found provider:', providers[0].id.toB58String())

    //     }

    //   })
    // })
  })
  
  // node[0].on('peer:discovery', (peer) => {
  //   console.log('Discovered:', peer.id.toB58String())
  //   // if (discoveredNodes.indexOf(peer.id.toB58String()) == -1){
  //   //   console.log('Discovered:', peer.id.toB58String())
      
  //   //   discoveredNodes.push(peer.id.toB58String())
      
  //   //   node.dial(peer, () => { })
  //   //   console.log(node.peerBook)
  //   // }else{
  //   //   node.dial(peer, () => { })
  //   // }
  // })

  // node[0].on('peer:connect', (peer) => {
  //   console.log('Connection established to:', peer.id.toB58String())
  // })
  
})
