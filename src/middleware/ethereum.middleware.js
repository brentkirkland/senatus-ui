import Web3 from 'web3'
import sigUtil from 'eth-sig-util'
import ethUtil from 'ethereumjs-util'

// import ledger from 'ledgerco'
import actions from '../actions'
import { postSig } from './grenache.middleware'

const { UI = {} } = actions
const { errorAction } = UI

let web3
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
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
            if (recovered.toUpperCase() === from.toUpperCase()) {
              if (whitelistMap.has(from)) {
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
                dispatch(postSig(args))
              } else {
                const error = errorAction('Address is not whitelisted')
                dispatch(error)
              }
            } else {
              const error = errorAction('Failed to verify signer, got: ' + result)
              dispatch(error)
            }
          }
        })
      }
    })
  }
}

// ledgerSign () {
//   // ledger.comm_node.create_async().then(function (comm) {
//   //   // eslint-disable-next-line new-cap
//   //   const eth = new ledger.eth(comm)
//   //   console.log('eth', eth)
//   //   eth.signPersonalMessage_async("44'/60'/0'/0'/0", Buffer.from('test').toString('hex'))
//   //   .then(function (result) {
//   //     var v = result['v'] - 27
//   //     v = v.toString(16)
//   //     if (v.length < 2) {
//   //       v = '0' + v
//   //     }
//   //     console.log('Signature 0x' + result['r'] + result['s'] + v)
//   //   })
//   //   .catch(function (ex) { console.log(ex) })
//   // })
// }
