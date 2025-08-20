import {
  SuiClient,
  SuiTransactionBlockResponseOptions,
} from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { ONECHAIN_NETWORKS, type NetworkType } from "@/config/onechainConfig";

interface OneChainTransactionProps {
  transaction: Transaction;
  options?: SuiTransactionBlockResponseOptions;
}

export const useOneChain = () => {
  const network: NetworkType = "testnet"; // Default to testnet
  const networkConfig = ONECHAIN_NETWORKS[network];
  
  // Create OneChain client using the SuiClient with OneChain RPC
  const onechainClient = new SuiClient({ url: networkConfig.url });

  const executeTransaction = async ({
    transaction,
    options,
  }: OneChainTransactionProps) => {
    // Note: For now using the basic execution
    // In a full migration, you'd replace this with OneChain specific transaction execution
    return onechainClient.getTransactionBlock({
      digest: "placeholder", // This would come from actual transaction execution
      options,
    });
  };

  const getBalance = async (address: string) => {
    return onechainClient.getBalance({
      owner: address,
    });
  };

  const getObject = async (objectId: string) => {
    return onechainClient.getObject({
      id: objectId,
      options: { showContent: true, showType: true },
    });
  };

  return { 
    onechainClient, 
    executeTransaction, 
    getBalance, 
    getObject,
    network: networkConfig
  };
};
