import { ENS_NAME_WRAPPER_ADDRESS } from '@/constants/web3/contracts'

// Our ensnode's subgraph-compatible endpoint. Runs in the browser, so the
// value is baked at build time from .env.production / build args.
const ENSNODE_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_ENSNODE_SUBGRAPH_URL || 'https://ensnode-api-production-500f.up.railway.app/subgraph'

export type CheckIfWrappedResponse = {
  data: {
    domains: {
      name: string
      owner: {
        id: string
      }
    }[]
  }
}

export const checkIfWrapped = async (domain: string) => {
  const query = `
    query GetRegistrations {
  domains(where: {name: "${domain}"}) {
    name
    owner {
      id
    }
  }
}
  `
  const response = await fetch(ENSNODE_SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
      operationName: 'GetRegistrations',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to check if domain is wrapped')
  }

  const data = (await response.json()) as CheckIfWrappedResponse
  return data.data.domains.some((domain) => domain.owner.id.toLowerCase() === ENS_NAME_WRAPPER_ADDRESS.toLowerCase())
    ? true
    : false
}
