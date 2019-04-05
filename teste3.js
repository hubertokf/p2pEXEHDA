const fs = require('fs')
const path = require('path')
const PeerInfo = require('peer-info')
const protobuf = require('protobufjs')
const ip = require('ip');
const uuid = require('uuid')

// const Node = require('libp2p-rpc')
const Node = require('./node.js')
const cell = {
    id: 27,
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
    modules: {

    },
    config: {
    }
}

PeerInfo.create((err, peerInfo) => {
    if (err) throw new Error(err)
    
    protobuf.load(path.join(__dirname, './protocol_bkp.proto')).then((root) => {
        const node = new Node(peerInfo, root, config)
        console.log("id: ", peerInfo.id._idB58String)
        
        // node.on('peer:discovery', (peer) => {
        //     if (node.peerBook.has(peer)) return
        //     console.log('Discovered:', peer.id.toB58String())
        // })

        // node.on('peer:connection', (conn, peer, type) => {
        //     console.log('peer:connection')
        //     console.log(peer._connectedMultiaddr)
        // })

        // node.on('peer:disconnect', (peer) => {
        //     console.log('peer:disconnect')
        // })
        
        node.handle('resources', (message, peer, response) => {
            console.log('Resources Request', message)
            response({ message: JSON.stringify(resources[message.id]) })
        })

        node.handle('sayHello', (message, peer, response) => {
            console.log('sayHello Request', message)
            response({ message: 'heyThere' })
        })
        
        // node.start().then(console.log, console.error) 
        node.start().then() 
    }, console.error)
})
