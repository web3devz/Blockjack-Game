"use client";

import { LargeScreenLayout } from "@/components/layouts/LargeScreenLayout";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { useRegisterServiceWorker } from "@/hooks/useRegisterServiceWorker";
import { ChildrenProps } from "@/types/ChildrenProps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

// Configure network specifically for OneChain (using Sui client)
const { networkConfig } = createNetworkConfig({
  testnet: { 
    url: 'https://rpc-testnet.onelabs.cc',
    variables: {
      faucetUrl: 'https://faucet-testnet.onelabs.cc/v1/gas',
    }
  },
  localnet: { 
    url: 'http://localhost:9000',
    variables: {
      faucetUrl: 'http://localhost:9123/gas',
    }
  },
});

export const ProvidersAndLayout = ({ children }: ChildrenProps) => {
  const _ = useRegisterServiceWorker();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <BalanceProvider>
            <main
              className={`min-h-screen w-screen`}
              style={{
                backgroundImage: "url('/general/background.svg')",
                backgroundSize: "cover",
                backgroundPositionX: "center",
                backgroundPositionY: "top",
              }}
            >
              <LargeScreenLayout>{children}</LargeScreenLayout>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  duration: 5000,
                }}
              />
            </main>
          </BalanceProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};
