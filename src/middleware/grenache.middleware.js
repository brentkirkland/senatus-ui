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
        const whitelistUsernameMap = new Map()
        const whitelistPubkeyMap = new Map()
        data.forEach((user) => {
          whitelistUsernameMap.set(user.username, user)
          whitelistPubkeyMap.set(user.pubkey, user)
        })
        const whitelistUsernameMapData = {
          type: 'UI_SET',
          payload: {
            section: 'whitelistUsernameMap',
            value: whitelistUsernameMap
          }
        }
        dispatch(whitelistUsernameMapData)
        const whitelistPubkeyMapData = {
          type: 'UI_SET',
          payload: {
            section: 'whitelistPubkeyMap',
            value: whitelistPubkeyMap
          }
        }
        dispatch(whitelistPubkeyMapData)
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

export function postSig (args) {
  return (dispatch) => {
    const addSigQuery = {
      action: 'addSig',
      args
    }
    peer.request('rest:senatus:vanilla', addSigQuery, { timeout: 10000 }, (err, data) => {
      if (err) {
        const errorOut = {
          type: 'UI_SET',
          payload: {
            section: 'error',
            value: 'Problem submitting signature. Make sure your grapes and worker are running.'
          }
        }
        return errorOut
      } else {
        const saveArgs = {
          type: 'UI_SET',
          payload: {
            section: 'signature_payload',
            value: args
          }
        }
        dispatch(saveArgs)
        const errorOut = {
          type: 'UI_SET',
          payload: {
            section: 'hash_create',
            value: data
          }
        }
        dispatch(errorOut)
      }
    })
  }
}
