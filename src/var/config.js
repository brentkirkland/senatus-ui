// name: app name seen in header
// type: vanilla, ethereum, bitcoin
export const appConfig = {
  name: 'Senatus Vanilla',
  type: 'vanilla'
}

// grapeLink: url string
export const grenacheConfig = {
  grapeUrl: 'http://127.0.0.1:30001'
}

// signingProcess: ways allowed to sign
// minSignersAllowed: required checkmarks from whitelist
// signatureMajorityPercent: how many signatures to reach majority
export const signatureConfig = {
  signingProcesses: [
    'metamask',
    'ledger'
  ],
  minSigners: 0,
  signMajority: 0.5
}

// providerUrl if you are running your own chain
export const web3Config = {
  providerUrl: 'http://localhost:8545'
}
