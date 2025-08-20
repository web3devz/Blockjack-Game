import { useCallback, useState } from "react";
import { useSui } from "./useSui";
import { Transaction } from "@mysten/sui/transactions";
import { SuiObjectChangeCreated } from "@mysten/sui/client";
import toast from "react-hot-toast";
import axios from "axios";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { bcs } from "@mysten/sui/bcs";

interface HandleCreateGameSuccessResponse {
  gameId: string;
  txDigest: string;
}

export const useCreateBlackjackGame = () => {
  const { suiClient } = useSui();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [isCreateGameLoading, setIsCreateGameLoading] = useState(false);
  const [isInitialDealLoading, setIsInitialDealLoading] = useState(false);

  const handleCreateGameAndDeal = useCallback(
    async (
      counterId: string | null,
      randomBytesAsHexString: string,
      reFetchGame: (gameId: string, txDigest?: string) => Promise<void>
    ): Promise<HandleCreateGameSuccessResponse | null> => {
      if (!counterId) {
        toast.error("You need to own a Counter NFT to play");
        return null;
      }

      if (!currentAccount) {
        toast.error("Please connect your wallet first");
        return null;
      }

      console.log("Creating game on OneChain...");
      setIsCreateGameLoading(true);
      
      const tx = new Transaction();
      const betAmountCoin = tx.splitCoins(tx.gas, [tx.pure.u64(0.2 * Number(MIST_PER_SUI))]);
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::single_player_blackjack::place_bet_and_create_game`,
        arguments: [
          tx.pure.string(randomBytesAsHexString),
          tx.object(counterId!),
          betAmountCoin,
          tx.object(process.env.NEXT_PUBLIC_HOUSE_DATA_ID!),
        ],
      });

      console.log("Executing transaction on OneChain...");
      
      return new Promise((resolve, reject) => {
        signAndExecuteTransaction(
          {
            transaction: tx,
            account: currentAccount,
          },
          {
            onSuccess: async (result) => {
              try {
                // Wait for the transaction to be processed
                await suiClient.waitForTransaction({
                  digest: result.digest,
                  timeout: 10_000,
                });

                // Get the full transaction details
                const resp = await suiClient.getTransactionBlock({
                  digest: result.digest,
                  options: {
                    showObjectChanges: true,
                    showEffects: true,
                  },
                });

                const status = resp?.effects?.status.status;
                if (status !== "success") {
                  console.log(resp.effects);
                  setIsCreateGameLoading(false);
                  toast.error("Game creation failed");
                  reject(new Error("Game not created"));
                  return;
                }

                const createdObjects = resp.objectChanges?.filter(
                  ({ type }) => type === "created"
                ) as SuiObjectChangeCreated[];
                
                const createdGame = createdObjects.find(({ objectType }) =>
                  objectType.endsWith("single_player_blackjack::Game")
                );
                
                if (!createdGame) {
                  setIsCreateGameLoading(false);
                  toast.error("Game not created");
                  reject(new Error("Game not created"));
                  return;
                }

                const { objectId } = createdGame;
                console.log("Created game id on OneChain:", objectId);
                reFetchGame(objectId, resp.effects?.transactionDigest!);
                setIsCreateGameLoading(false);
                setIsInitialDealLoading(true);
                toast.success("Game created on OneChain!");
                
                const dealResult = await makeInitialDealRequest({
                  gameId: objectId,
                  txDigest: resp.effects?.transactionDigest!,
                });
                resolve(dealResult);
              } catch (error) {
                console.error(error);
                setIsCreateGameLoading(false);
                toast.error("Transaction processing failed");
                reject(error);
              }
            },
            onError: (err) => {
              console.log(err);
              setIsCreateGameLoading(false);
              toast.error("Game creation failed");
              reject(err);
            }
          }
        );
      });
    },
    [currentAccount, signAndExecuteTransaction, suiClient]
  );

  // Passes the txDigest from the game creation tx to the API
  // So that the API will waitForTransactionBlock on it before making the initial deal
  const makeInitialDealRequest = async ({
    gameId,
    txDigest,
  }: HandleCreateGameSuccessResponse): Promise<HandleCreateGameSuccessResponse | null> => {
    console.log("Making initial deal request to the API...");
    return axios
      .post(`/api/games/${gameId}/deal`, {
        txDigest,
      })
      .then((resp) => {
        const { message, txDigest } = resp.data;
        console.log(message);
        setIsInitialDealLoading(false);
        return {
          gameId,
          txDigest,
        };
      })
      .catch((error) => {
        console.log(error);
        toast.error("Game created, but initial deal failed.");
        setIsInitialDealLoading(false);
        return null;
      });
  };

  return {
    isCreateGameLoading,
    isInitialDealLoading,
    handleCreateGameAndDeal,
  };
};
