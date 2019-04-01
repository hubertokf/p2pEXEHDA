const fs = require('fs')
const path = require('path')
const PeerInfo = require('peer-info')
const protobuf = require('protobufjs')
const ip = require('ip');
const uuid = require('uuid')
const Mplex = require('libp2p-mplex')
const spdy = require('libp2p-spdy')
const CID = require('cids')
const PeerId = require('peer-id')

const Node = require('libp2p-rpc')
// const Node = require('../libp2p-rpc')
const cell = {
    id: 25,
    name: "EXEHDA-UFPel"
}
const resources = [{
    id: 1,
    uuid: uuid.v4(),
    type: "temperature",
    name: "res1",
    extAddr: "http://127.0.0.1/",
    localAddr: "http://127.0.0.1/",
    status: true
}, {
    id: 2,
    name: "res2",
    uuid: uuid.v4(),
    type: "temperature",
    extAddr: "http://127.0.0.1/",
    localAddr: "http://127.0.0.1/",
    status: true
}, {
    id: 3,
    name: "res3",
    uuid: uuid.v4(),
    type: "temperature",
    extAddr: "http://127.0.0.1/",
    localAddr: "http://127.0.0.1/",
    status: true
}]
const config = {
    name: 'your-protocol-name',
    version: '1.0.0',
    bootstrapers: [],
    multicastDNS: {
        interval: 1000,
        enabled: true
    },
    modules: {
        streamMuxer: [ Mplex, spdy ]
    },
    config: {
        EXPERIMENTAL: {
            dht: true
        }
    }
}

PeerInfo.create((err, peerInfo) => {
    if (err) throw new Error(err)
    
    protobuf.load(path.join(__dirname, './protocol_bkp.proto')).then((root) => {
        const node = new Node(peerInfo, root, config)
        var addr = '/ip4/'+ip.address()+'/tcp/46459/ipfs/'+peerInfo.id._idB58String
        
        console.log("id: ", peerInfo.id._idB58String)
        console.log("ipfs addr: ", addr)

        node.on('peer:discovery', (peer) => {
            if (node.peerBook.has(peer)) return
            console.log('Discovered:', peer.id.toB58String())
        })

        // setTimeout(function () {
        //     var peerid = PeerId.createFromB58String("QmU13jxZXrTmpgodotGGNMdCre2BKfmqPyHdHWGh7vmJ5e")
        //     node.peerRouting.findPeer(peerid, (err, peer) => {
        //         if (err) { throw err }
            
        //         console.log('Found it, multiaddrs are:')
        //         peer.multiaddrs.forEach((ma) => console.log(ma.toString()))
        //     })
        // }, 5000)

        node.on('peer:connection', (conn, peer, type) => {
            console.log('peer:connection')
            peer.rpc.resources({ id: '1' }, (response, peer) => {
                console.log('sayHello Response', response)
            })
            console.log(peer._connectedMultiaddr)
        })

        node.on('peer:disconnect', (peer) => {
            console.log('peer:disconnect')
        })
        
        // node.handle('resources', (message, peer, response) => {
        //     console.log('Resources Request', message)
        //     // response(resources)
        //     response({ message: JSON.stringify(resources[message.id]) })
        //     // response({ message: JSON.stringify(resourcesController.listResources) })
        // })
        
        node.start().then(console.log, console.error) 
    }, console.error)
})
