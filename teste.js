const fs = require('fs')
const path = require('path')
const PeerInfo = require('peer-info')
const protobuf = require('protobufjs')
const ip = require('ip');

const Node = require('libp2p-rpc')

const config = {
    name: 'your-protocol-name',
    version: '1.0.0',
    bootstrapers: [],
    multicastDNS: {
        interval: 1000,
        enabled: true
    }
}

PeerInfo.create((err, peerInfo) => {
    if (err) throw new Error(err)
    
    protobuf.load(path.join(__dirname, './protocol.proto')).then((root) => {
        const node = new Node(peerInfo, root, config)
        var addr = '/ip4/'+ip.address()+'/tcp/46459/ipfs/'+peerInfo.id._idB58String
        
        console.log("id: ", peerInfo.id._idB58String)
        console.log("ipfs addr: ", addr)

        node.on('peer:connection', (conn, peer, type) => {
            console.log('peer:connection')
            console.log(peer._connectedMultiaddr)
    
            peer.rpc.sayHello({name: 'Foo'}, (response, peer) => {
                console.log('sayHello Response', response)
            })
        })

        node.on('peer:disconnect', (peer) => {
            console.log('peer:disconnect')
        })
        
        node.handle('sayHello', (message, peer, response) => {
            console.log('sayHello Request', message)
            response({ message: 'heyThere' })
        })
        
        node.start().then(console.log, console.error) 
    }, console.error)
})
