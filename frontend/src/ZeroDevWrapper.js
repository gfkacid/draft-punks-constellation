import React from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
} from "wagmi";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { avalancheFuji } from 'wagmi/chains'
import { connectorsForWallets, RainbowKitProvider, darkTheme, cssStringFromTheme } from '@rainbow-me/rainbowkit'
import { 
  googleWallet,
  facebookWallet,
  githubWallet,
  discordWallet,
  twitchWallet,
  twitterWallet,
} from '@zerodev/wagmi/rainbowkit'

export const projectId = process.env.REACT_APP_0DEV_PROJECT_ID

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalancheFuji],
  [jsonRpcProvider({
    rpc: chain => ({
      http: `https://rpc.ankr.com/avalanche_fuji`,
    }),
  }),]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Social',
      wallets: [
        googleWallet({chains, options: { projectId}}),
        facebookWallet({chains, options: { projectId}}),
        githubWallet({chains, options: { projectId }}),
        discordWallet({chains, options: { projectId }}),
        twitchWallet({chains, options: { projectId }}),
        twitterWallet({chains, options: { projectId }}),
    ],
  },
]);

const config = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient
})

function ZeroDevWrapper({children}) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={null} chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ZeroDevWrapper