import {
  SuiClient,
  SuiTransactionBlockResponseOptions,
} from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";

interface OneChainTransactionProps {
  transaction: Transaction;
  options?: SuiTransactionBlockResponseOptions;
}

export const useSui = () => {
  // Use OneChain RPC URL instead of Sui
  const ONECHAIN_RPC = "https://rpc-testnet.onelabs.cc";
  const suiClient = new SuiClient({ url: ONECHAIN_RPC });
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const onechainExecute = async ({
    transaction,
    options,
  }: OneChainTransactionProps) => {
    return new Promise((resolve, reject) => {
      if (!currentAccount) {
        reject(new Error("No wallet connected"));
        return;
      }

      signAndExecuteTransaction(
        {
          transaction,
          account: currentAccount,
          chain: "onechain:testnet", // OneChain identifier
        },
        {
          onSuccess: (result) => {
            resolve(suiClient.getTransactionBlock({
              digest: result.digest,
              options,
            }));
          },
          onError: (error) => {
            reject(error);
          }
        }
      );
    });
  };

  return { onechainExecute, suiClient };
};
