// name: app name seen in header
// type: vanilla, ethereum, bitcoin
export const app = {
  name: 'Senatus Vanilla',
  type: 'vanilla'
}

// grapeLink: url string
export const grenache = {
  grapeLink: 'http://127.0.0.1:30001'
}

// signingProcess: ways allowed to sign
// minSignersAllowed: required checkmarks from whitelist
// signatureMajorityPercent: how many signatures to reach majority
export const signatures = {
  signingProcesses: [
    'metamask',
    'ledger'
  ],
  minSigners: 0,
  signatureMajorityPercent: 0.5
}
