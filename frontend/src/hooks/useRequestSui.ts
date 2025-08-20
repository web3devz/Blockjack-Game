import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSui } from "./useSui";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useBalance } from "@/contexts/BalanceContext";

export const useRequestSui = () => {
  const { suiClient } = useSui();
  const [isLoading, setIsLoading] = useState(false);
  const { handleRefreshBalance } = useBalance();
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    if (currentAccount?.address) handleRefreshBalance();
  }, [currentAccount?.address, handleRefreshBalance]);

  const handleRequestSui = useCallback(async () => {
    if (!currentAccount?.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    console.log("Requesting OCT tokens from OneChain faucet...");
    
    try {
      // Using OneChain testnet faucet
      const response = await axios.post(
        "https://faucet-testnet.onelabs.cc/v1/gas",
        {
          FixedAmountRequest: {
            recipient: currentAccount.address,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.txDigest) {
        await suiClient.waitForTransaction({
          digest: response.data.txDigest,
        });
      }
      
      handleRefreshBalance();
      toast.success("OCT tokens received successfully from OneChain!");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 429) {
        toast.error("You can only request tokens once every 10 minutes");
      } else {
        toast.error("Failed to request OCT tokens from faucet");
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount?.address, suiClient, handleRefreshBalance]);

  return {
    handleRequestSui,
    isLoading,
  };
};
