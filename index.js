const fs = require('fs')
const path = require('path')
const PeerInfo = require('peer-info')
const protobuf = require('protobufjs')
const uuid = require('uuid')
const ip = require("ip");
const Node = require("./node");

// Carregar os models
var models = require('./models');

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

// Find this list at: https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/config-nodejs.json
const bootstrapers = [
    '/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
    '/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z',
    '/ip4/104.236.179.241/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
    '/ip4/162.243.248.213/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
    '/ip4/128.199.219.111/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
    '/ip4/104.236.76.40/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
    '/ip4/178.62.158.247/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    '/ip4/178.62.61.185/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
    '/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx'
]
  
//   class MyBundle extends libp2p {
//     constructor (_options) {
//       const defaults = {
//         modules: {
//           transport: [ TCP ],
//           streamMuxer: [ Mplex ],
//           connEncryption: [ SECIO ],
//           peerDiscovery: [ Bootstrap ]
//         },
//         config: {
//           peerDiscovery: {
//             bootstrap: {
//               interval: 2000,
//               enabled: true,
//               list: bootstrapers
//             }
//           }
//         }
//       }
  
//       super(defaultsDeep(_options, defaults))
//     }
//   }

const config = {
    name: '',
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

            peer.rpc.resources({ id: '1' }, (response, peer) => {
                console.log('sayHello Response', response)
            })
        })

        node.on('peer:connect', (peer) => {
            console.log('Connection established to:', peer.id.toB58String())
        })

        node.handle('sayHello', (message, peer, response) => {
            console.log('sayHello Request', message)
            response({ message: 'heyThere' })
        })

        node.handle('resources', (message, peer, response) => {
            console.log('Resources Request', message)
            // response(resources)
            response({ message: JSON.stringify(resources) })
            // response({ message: JSON.stringify(resourcesController.listResources) })
        })

        node.start().then(console.log, console.error)
    }, console.error)
})