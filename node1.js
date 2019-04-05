const debug = require('debug')('libp2p:rpc')
const libp2p = require('libp2p')
const spdy = require('libp2p-spdy')
const secio = require('libp2p-secio')
const pull = require('pull-stream')
const lp = require('pull-length-prefixed')
const protobuf = require('protobufjs')
const fs = require('fs')
const uuid = require('uuid')
const Mplex = require('libp2p-mplex')
const PeerId = require('peer-id')

const MulticastDNS = require('libp2p-mdns')
const DHT = require('libp2p-kad-dht')
const Bootstrap = require('libp2p-bootstrap')
const PeerInfo = require('peer-info')
const Pushable = require('pull-pushable')
const PeerBook = require('peer-book')
const TCP = require('libp2p-tcp')
const WS = require('libp2p-websockets')
const defaultsDeep = require('@nodeutils/defaults-deep')

class Node extends libp2p {
    constructor(_options) {
        const defaults = {
            modules: {
                transport: [TCP],
                streamMuxer: [Mplex],
                connEncryption: [secio],
                // we add the DHT module that will enable Peer and Content Routing
                dht: KadDHT,
            },
            config: {
                dht: {
                    kBucketSize: 20
                },
                EXPERIMENTAL: {
                    dht: true
                }
            }
        }

        super(defaultsDeep(_options, defaults))
    }
}

module.exports = Node