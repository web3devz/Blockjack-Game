// OneChain network configurations
export const ONECHAIN_NETWORKS = {
  testnet: {
    name: "OneChain Testnet",
    url: "https://rpc-testnet.onelabs.cc",
    faucetUrl: "https://faucet-testnet.onelabs.cc/v1/gas",
    chainId: "onechain-testnet",
    explorerUrl: "https://onescan.cc"
  },
  localnet: {
    name: "OneChain Localnet", 
    url: "http://localhost:9000",
    faucetUrl: "http://localhost:9123/gas",
    chainId: "onechain-localnet",
    explorerUrl: "https://onescan.cc"
  },
} as const

export type NetworkType = keyof typeof ONECHAIN_NETWORKS

// OneChain specific wallet configuration
export const ONECHAIN_WALLET_CONFIG = {
  preferredWallets: ["OneChain Wallet", "OneLabs Wallet"],
  supportedFeatures: ["standard:connect", "standard:disconnect", "sui:signTransaction", "sui:signTransactionBlock"],
}

// Game specific configuration - client-side only with defaults
export const GAME_CONFIG = {
  packageAddress: "0xeb43b3314dd7c6b5316595f59ae3fff12519adf2f0f839ac0d597a0cc93db5af",
  adminAddress: "0xad9396b530f9fcdaee7dc5bb62d423241caf3426d5e3d937da3e2503fb656f9e",
  houseDataId: "0x5c8e838f933373d5b478ea7c349a0211db425e0e569589281d1013b1e384ed38",
  network: "testnet" as NetworkType,
  rpcUrl: "https://rpc-testnet.onelabs.cc",
  explorerUrl: "https://onescan.cc",
}

// Helper function to get config values from environment or defaults
export const getConfig = () => {
  return {
    packageAddress: GAME_CONFIG.packageAddress,
    adminAddress: GAME_CONFIG.adminAddress,
    houseDataId: GAME_CONFIG.houseDataId,
    network: GAME_CONFIG.network,
    rpcUrl: GAME_CONFIG.rpcUrl,
    explorerUrl: GAME_CONFIG.explorerUrl,
  }
}
