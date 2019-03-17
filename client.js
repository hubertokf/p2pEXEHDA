const fs = require('fs')
const path = require('path')
const PeerInfo = require('peer-info')
const protobuf = require('protobufjs')

const Node = require('./node')

const config = {
    name: 'your-protocol-name',
    version: '1.0.0',
    bootstrapers: [],
    multicastDNS: {
        interval: 1000
    }
}

PeerInfo.create((err, peerInfo) => {
    if (err) throw new Error(err)

    protobuf.load(path.join(__dirname, './protocol.proto')).then((root) => {
        const node = new Node(peerInfo, root, config)

        node.on('peer:connection', (conn, peer, type) => {
            console.log('peer:connection')

            peer.rpc.resource({ id: '1' }, (response, peer) => {
                console.log('sayHello Response', response)
            })
        })

        node.start().then(console.log, console.error)
    }, console.error)
})
