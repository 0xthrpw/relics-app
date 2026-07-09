import { mainnet, optimism, base } from 'wagmi/chains'
import { http, fallback } from 'wagmi'

// Full RPC URLs per chain, injected per deployment (e.g. the hotbox archive
// node's tokened endpoint for mainnet: https://<rpc-host>/hbx_rpc_...). Free
// public endpoints serve as fallbacks — and as the sole transport when a URL
// isn't set. Provider-specific ID plumbing (Alchemy/QuickNode) is gone on
// purpose. Base and Optimism stay: the marketplace itself is mainnet-only,
// but the EFP list-settings flow resolves the list's storage-location chain
// and dereferences its transport here.
//
// This module is intentionally free of RainbowKit imports: server code (OG
// routes via getEtherPrice) builds viem clients from these transports, and
// RainbowKit's connector helpers are client-only.
const rpc = (envUrl: string | undefined, publicUrl: string) =>
  fallback((envUrl ? [envUrl, publicUrl] : [publicUrl]).map((url) => http(url, { batch: true })))

export const transports = {
  [mainnet.id]: rpc(process.env.NEXT_PUBLIC_MAINNET_RPC_URL, 'https://eth.llamarpc.com'),
  [optimism.id]: rpc(process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL, 'https://mainnet.optimism.io'),
  [base.id]: rpc(process.env.NEXT_PUBLIC_BASE_RPC_URL, 'https://mainnet.base.org'),
}
