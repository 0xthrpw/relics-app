import {
  rabbyWallet,
  rainbowWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  safeWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { mainnet, optimism, base } from 'wagmi/chains'
import { type Chain, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { createStorage, cookieStorage, createConfig } from 'wagmi'
import { APP_DESCRIPTION, APP_ICON, APP_NAME, APP_URL } from '@/constants'
import { safe } from 'wagmi/connectors'
import { transports } from '@/lib/rpc'

coinbaseWallet.preference = 'all'
// Define the connectors for the app
// Purposely using only these for now because of a localStorage error with the Coinbase Wallet connector
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [coinbaseWallet, injectedWallet],
    },
    {
      groupName: 'Popular',
      wallets: [rainbowWallet, metaMaskWallet, walletConnectWallet],
    },
    {
      groupName: 'Other',
      wallets: [rabbyWallet, safeWallet],
    },
  ],
  {
    appName: APP_NAME,
    projectId:
      process.env.WALLET_CONNECT_PROJECT_ID ||
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
      'd4f234136ca6a7efeed7abf93474125b',
    appDescription: APP_DESCRIPTION,
    appUrl: APP_URL,
    appIcon: APP_ICON,
  }
)

export type ChainWithDetails = Chain & {
  iconBackground?: string
  iconUrl?: string
  custom: {
    chainDetail?: string
    gasFeeDetail?: string
  }
}

// Define the chains for rainbow/wagmi and their respective icons
// These are the current supported chains for this app
// `chainDetail` and `gasFeeDetail` are custom fields to be used in the ChainList component
export const chains: [ChainWithDetails, ...ChainWithDetails[]] = [
  {
    ...mainnet,
    iconBackground: 'bg-zinc-300',
    iconUrl: '/chains/ethereum.svg',
    custom: {
      chainDetail: '',
      gasFeeDetail: 'High gas fees',
    },
    blockExplorers: {
      default: {
        name: 'Blockscout',
        url: 'https://eth.blockscout.com',
      },
      blockscout: {
        name: 'Blockscout',
        url: 'https://eth.blockscout.com/',
      },
    },
  },
  {
    ...base,
    iconUrl: '/chains/base.svg',
    custom: {
      chainDetail: 'Ethereum L2',
      gasFeeDetail: 'Super Low gas fees',
    },
    blockExplorers: {
      default: {
        name: 'Blockscout',
        url: 'https://explorer.base.org',
      },
      blockscout: {
        name: 'Blockscout',
        url: 'https://base.blockscout.com/',
      },
    },
  },
  {
    ...optimism,
    iconUrl: '/chains/optimism.svg',
    custom: {
      chainDetail: 'Ethereum L2',
      gasFeeDetail: 'Low gas fees',
    },
    blockExplorers: {
      default: {
        name: 'Blockscout',
        url: 'https://explorer.optimism.io',
      },
      blockscout: {
        name: 'Blockscout',
        url: 'https://optimistic.blockscout.com/',
      },
    },
  },
]

// Transports live in @/lib/rpc (server-safe, no RainbowKit) so server code
// can build viem clients without pulling in client-only connector helpers.
// Server code must import from '@/lib/rpc' directly — importing this module
// evaluates connectorsForWallets(), which is client-only.
export { transports }

const config = createConfig({
  ssr: true,
  connectors: [...connectors, safe()],
  chains,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports,
})

export default config
