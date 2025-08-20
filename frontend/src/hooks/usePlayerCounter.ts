import { useEffect, useState } from "react";
import { useSui } from "./useSui";
import { Transaction } from "@mysten/sui/transactions";
import { SuiObjectChangeCreated } from "@mysten/sui/client";
import toast from "react-hot-toast";
import { getCounterId } from "@/utils/getCounterId";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";

export const usePlayerCounter = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { suiClient } = useSui();
  const [counterId, setCounterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const handleCreateCounter = async () => {
    try {
      if (!currentAccount) {
        toast.error("Please connect your wallet first");
        return;
      }

      setIsCreateLoading(true);

      // Create the transaction for OneChain
      const tx = new Transaction();
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::counter_nft::mint_and_transfer`,
        arguments: [],
      });

      // Execute transaction on OneChain
      signAndExecuteTransaction(
        {
          transaction: tx,
          account: currentAccount,
        },
        {
          onSuccess: async (result) => {
            try {
              // Wait for transaction confirmation
              await suiClient.waitForTransaction({
                digest: result.digest,
                timeout: 10_000,
              });

              const transactionResult = await suiClient.getTransactionBlock({
                digest: result.digest,
                options: {
                  showEffects: true,
                  showObjectChanges: true,
                },
              });

              if (transactionResult.effects?.status?.status !== "success") {
                throw new Error("Transaction failed");
              }

              // Extract created Counter NFT
              const createdObjects = transactionResult.objectChanges?.filter(
                ({ type }) => type === "created"
              ) as SuiObjectChangeCreated[];

              const createdCounterNft = createdObjects.find(({ objectType }) =>
                objectType.endsWith("counter_nft::Counter")
              );

              if (!createdCounterNft) {
                throw new Error("Counter NFT not created");
              }

              console.log({ createdCounterNftId: createdCounterNft.objectId });
              toast.success("Counter NFT minted on OneChain!");
              setCounterId(createdCounterNft.objectId);
            } catch (err) {
              console.error(err);
              toast.error("Transaction processing failed");
            } finally {
              setIsCreateLoading(false);
            }
          },
          onError: (error) => {
            console.error(error);
            toast.error("Minting Counter NFT failed");
            setIsCreateLoading(false);
          }
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to create transaction");
      setIsCreateLoading(false);
    }
  };

  useEffect(() => {
    if (!currentAccount?.address) return;
    setIsLoading(true);
    getCounterId({
      address: currentAccount.address,
      suiClient,
    })
      .then((resp) => {
        if (!resp) {
          setIsLoading(false);
          setCounterId(null);
        } else {
          setCounterId(resp);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setCounterId(null);
        setIsLoading(false);
      });
  }, [currentAccount?.address, suiClient]);

  return {
    counterId,
    handleCreateCounter,
    isLoading,
    isCreateLoading,
  };
};
