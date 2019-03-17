const fs = require('fs')
const path = require('path')
const PeerInfo = require('peer-info')
const protobuf = require('protobufjs')

// const Node = require('../index')
const Node = require('./node')

const config = {
    name: 'your-protocol-name',  // Protocol name used for handshake
    version: '1.0.0',            // Protocol version used for handshake
    service: 'Protocol',         // Name of service in .proto file
    bootstrapers: [],            // Bootstrapping nodes 
    multicastDNS: {  
        // multicastDNS options
        interval: 1000   
    }
}

// PeerInfo creates public-private keypair used for connection encryption and peer identity.
PeerInfo.create((err, peerInfo) => {
    if (err) 
        throw new Error(err)
    
    // Load your .proto file
    protobuf.load(path.join(__dirname, './protocol.proto')).then((root) => {
    
        // Create Node
        const node = new Node(peerInfo, root, config)
        
        // Event fires when a peer connects
        node.on('peer:connection', (conn, peer, type) => {
            console.log('peer:connection')
    
            // Make RPC call to peer
            peer.rpc.sayHello({name: 'Foo'}, (response, peer) => {
                console.log('Response', response)
            })
        })
        
        // Define RPC handlers
        node.handle('sayHello', (message, peer, respond) => {
            console.log('Request', message)
            respond({ message: 'heyThere' })
        })
        
        // Lets starts node
        node.start().then(console.log, console.error) 
        
    }, console.error)
})