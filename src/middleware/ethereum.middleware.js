import Web3 from 'web3'
import sigUtil from 'eth-sig-util'
import ethUtil from 'ethereumjs-util'

import actions from '../actions'
import { web3Config, ledgerConfig } from '../var/config'
import { postSig } from './grenache.middleware'

const ledger = window.ledger
const { UI = {} } = actions
const { errorAction } = UI

let web3
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider(web3Config.providerUrl))
}

function handleResult (recovered, from, args, whitelistMap) {
  return (dispatch) => {
    if (recovered.toUpperCase() === from.toUpperCase()) {
      if (whitelistMap.has(from)) {
        dispatch(postSig(args))
      } else {
        const error = errorAction('Address is not whitelisted')
        dispatch(error)
      }
    } else {
      const error = errorAction('Failed to verify signer')
      dispatch(error)
    }
  }
}

export function metamaskSign (payload = {}) {
  return (dispatch) => {
    const {
      msg,
      signers,
      sigsRequired,
      uuid,
      sigs,
      whitelistMap
    } = payload
    const data = {
      msg,
      signers,
      sigsRequired,
      uuid,
      sigs
    }
    const hexMsg = ethUtil.bufferToHex(Buffer.from(JSON.stringify(data), 'utf8'))
    web3.eth.getAccounts(function (err, accounts) {
      if (err) {
        const error = errorAction('Could not get account')
        dispatch(error)
      } else if (!accounts) {
        const error = errorAction('no accounts')
        dispatch(error)
      } else {
        const from = accounts[0]
        const params = [hexMsg, from]
        const method = 'personal_sign'
        web3.currentProvider.sendAsync({
          method,
          params,
          from
        }, function (err, result) {
          if (err) {
            const error = errorAction(err)
            dispatch(error)
          } else if (result.error) {
            const error = errorAction(result.error.message)
            dispatch(error)
          } else {
            const recovered = sigUtil.recoverPersonalSignature({
              data: hexMsg,
              sig: result.result
            })
            const username = whitelistMap.get(from).username
            const args = [
              {
                msg,
                signers,
                sigsRequired,
                uuid,
                sigs
              },
              {
                signer: username,
                signedMsg: result.result
              }
            ]
            dispatch(handleResult(recovered, from, args, whitelistMap))
          }
        })
      }
    })
  }
}

export function ledgerSign (payload = {}) {
  return (dispatch) => {
    const {
      msg,
      signers,
      sigsRequired,
      uuid,
      sigs,
      whitelistMap
    } = payload
    const data = {
      msg,
      signers,
      sigsRequired,
      uuid,
      sigs
    }
    ledger.comm_u2f.create_async(1000000).then(function (comm) {
      // eslint-disable-next-line new-cap
      const eth = new ledger.eth(comm)
      eth.getAddress_async(ledgerConfig.hdPath)
      .then((address) => {
        console.log(`Found address ${address.address}`)
        const hexMsg = Buffer.from(JSON.stringify(data)).toString('hex')
        const hexMsgRec = ethUtil.bufferToHex(Buffer.from(JSON.stringify(data), 'utf8'))
        eth.signPersonalMessage_async(ledgerConfig.hdPath, hexMsg)
        .then((result) => {
          var v = result['v'] - 27
          v = v.toString(16)
          if (v.length < 2) {
            v = '0' + v
          }
          const hexStr = '0x' + result['r'] + result['s'] + v
          const recovered = sigUtil.recoverPersonalSignature({
            data: hexMsgRec,
            sig: hexStr
          })
          const from = address.address
          const username = whitelistMap.get(from).username
          const args = [
            {
              msg,
              signers,
              sigsRequired,
              uuid,
              sigs
            },
            {
              signer: username,
              signedMsg: hexStr
            }
          ]
          dispatch(handleResult(recovered, from, args, whitelistMap))
        })
        .catch((err) => {
          const error = errorAction(err.message)
          dispatch(error)
        })
      })
      .catch((err) => {
        const error = errorAction(err.message)
        dispatch(error)
      })
    })
    .catch((err) => {
      const error = errorAction(err.message)
      dispatch(error)
    })
  }
}
