import Grenache from 'grenache-nodejs-http'
import Link from 'grenache-browser-http'
import actions from '../actions'
import { grenacheConfig } from '../var/config'

const Peer = Grenache.PeerRPCClient
const link = new Link({
  grape: grenacheConfig.grapeUrl
})
link.start()
const peer = new Peer(link, {})
peer.init()

const { UI = {} } = actions
const {
  errorAction,
  clearSection,
  setUI
} = UI

function clearError () {
  const section = 'error'
  const action = clearSection(section)
  return action
}

export function getWhitelist () {
  return (dispatch) => {
    const fxQuery = {
      action: 'getWhitelist',
      args: []
    }
    peer.request('rest:senatus:vanilla', fxQuery, { timeout: 100000 }, (err, data) => {
      if (err) {
        // dispatch(handleGrenacheError())
        const errorOut = errorAction(err.message)
        dispatch(errorOut)
      } else {
        const whitelistUsernameMap = new Map()
        const whitelistPubkeyMap = new Map()
        data.forEach((user) => {
          whitelistUsernameMap.set(user.username, user)
          whitelistPubkeyMap.set(user.pubkey, user)
        })
        const actionOne = setUI('whitelistUsernameMap', whitelistUsernameMap)
        dispatch(actionOne)

        const actionTwo = setUI('whitelistPubkeyMap', whitelistPubkeyMap)
        dispatch(actionTwo)

        const actionThree = setUI('whitelist', data)
        dispatch(actionThree)
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
        // dispatch(handleGrenacheError())
        const errorOut = errorAction(err.message)
        dispatch(errorOut)
      } else {
        let msg = null
        let signers = null
        let sigsRequired = null
        let uuid = null
        let sigs = null
        let sigsMap = null
        let error = null
        try {
          const proposal = JSON.parse(data.v)
          sigsMap = new Map()
          proposal.sigs.forEach(function (sig) {
            sigsMap.set(sig.signer, sig)
          })
          msg = proposal.msg
          signers = proposal.signers
          sigsRequired = proposal.sigsRequired
          uuid = proposal.uuid
          sigs = proposal.sigs
        } catch (e) {
          error = 'Looks like that proposal does not exist.'
        }

        // message
        const parsedMessage = setUI('message', msg)
        dispatch(parsedMessage)

        // signers
        const parsedSigners = setUI('signers', signers)
        dispatch(parsedSigners)

        // sigsRequired
        const parsedSigsRequired = setUI('sigsRequired', sigsRequired)
        dispatch(parsedSigsRequired)

        // uuid
        const parsedUUID = setUI('uuid', uuid)
        dispatch(parsedUUID)

        // sigs
        const parsedSigs = setUI('sigs', sigs)
        dispatch(parsedSigs)

        // sigsMap
        const parsedSigsMap = setUI('sigsMap', sigsMap)
        dispatch(parsedSigsMap)

        // hash
        const hash = setUI('hash', proposalHash)
        dispatch(hash)

        const errorOut = errorAction(error)
        dispatch(errorOut)
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
        const errorOut = errorAction(err.message)
        dispatch(errorOut)
      } else {
        const sigAction = setUI('signature_payload', args)
        dispatch(sigAction)

        const hashAction = setUI('hash_create', data)
        dispatch(hashAction)

        // greeting
        if (!args[0].sigs) {
          const postSigStep = setUI('post_sig_step', 'created')
          dispatch(postSigStep)
        } else {
          const postSigStep = setUI('post_sig_step', 'signed')
          dispatch(postSigStep)
        }
        dispatch(clearError())
        dispatch(getProposal(data))
      }
    })
  }
}
