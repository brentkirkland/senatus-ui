import Grenache from 'grenache-nodejs-http'
import Link from 'grenache-browser-http'

const Peer = Grenache.PeerRPCClient
const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()
const peer = new Peer(link, {})
peer.init()

function handleGrenacheError () {
  const errorOut = {
    type: 'UI_SET',
    payload: {
      section: 'error',
      value: 'Problem getting whitelist. Make sure your grapes and worker are running.'
    }
  }
  return errorOut
}

export function getWhitelist () {
  return (dispatch) => {
    const fxQuery = {
      action: 'getWhitelist',
      args: []
    }
    peer.request('rest:senatus:vanilla', fxQuery, { timeout: 100000 }, (err, data) => {
      if (err) {
        dispatch(handleGrenacheError())
      } else {
        const whitelistData = {
          type: 'UI_SET',
          payload: {
            section: 'whitelist',
            value: data
          }
        }
        dispatch(whitelistData)
      }
    })
  }
}

export function getProposal (proposalHash) {
  return (dispatch) => {
    const getPayloadQuery = {
      action: 'getPayload',
      'args': [proposalHash]
    }
    peer.request('rest:senatus:vanilla', getPayloadQuery, { timeout: 100000 }, (err, data) => {
      if (err) {
        dispatch(handleGrenacheError())
      } else {
        try {
          const proposal = JSON.parse(data.v)
          const sigsMap = new Map()
          proposal.sigs.forEach(function (sig) {
            sigsMap.set(sig.signer, sig)
          })
          const parsedProposal = {
            type: 'UI_SET',
            payload: {
              section: 'proposal',
              value: proposal
            }
          }
          dispatch(parsedProposal)
          const sigs = {
            type: 'UI_SET',
            payload: {
              section: 'sigsMap',
              value: sigsMap
            }
          }
          dispatch(sigs)
          const hash = {
            type: 'UI_SET',
            payload: {
              section: 'hash',
              value: proposalHash
            }
          }
          dispatch(hash)
        } catch (e) {
          const errorOut = {
            type: 'UI_SET',
            payload: {
              section: 'error',
              value: 'Looks like that proposal does not exist.'
            }
          }
          dispatch(errorOut)
        }
      }
    })
  }
}
