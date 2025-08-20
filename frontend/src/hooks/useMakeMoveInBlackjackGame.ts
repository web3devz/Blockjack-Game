import { Transaction } from "@mysten/sui/transactions";
import { SuiObjectChangeCreated } from "@mysten/sui/client";
import { useCallback, useState } from "react";
import { GameOnChain } from "@/types/GameOnChain";
import toast from "react-hot-toast";
import axios from "axios";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useSui } from "./useSui";

interface HandleHitOrStandProps {
  move: "hit" | "stand";
  game: GameOnChain | null;
  gameId: string;
}

interface HandleSuccessResponse {
  gameId: string;
  txDigest: string;
}

interface OnRequestMoveSuccessProps {
  gameId: string;
  move: "hit" | "stand";
  txDigest: string;
  requestObjectId: string;
}

export const useMakeMoveInBlackjackGame = () => {
  const { suiClient } = useSui();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [isMoveLoading, setIsMoveLoading] = useState(false);

  const handleHitOrStand = useCallback(
    async ({
      move,
      game,
      gameId,
    }: HandleHitOrStandProps): Promise<HandleSuccessResponse | null> => {
      try {
        if (!game || !gameId) {
          toast.error("You need to create a game first");
          setIsMoveLoading(false);
          return null;
        }

        if (!currentAccount) {
          toast.error("Please connect your wallet first");
          return null;
        }

        setIsMoveLoading(true);

        const { player_sum } = game;

        console.log(`Executing ${move} on OneChain...`);

        // Create transaction for OneChain
        const tx = new Transaction();
        let request = tx.moveCall({
          target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::single_player_blackjack::do_${move}`,
          arguments: [tx.object(gameId), tx.pure.u8(player_sum)],
        });
        tx.transferObjects(
          [request],
          tx.pure.address(process.env.NEXT_PUBLIC_ADMIN_ADDRESS!)
        );

        return new Promise((resolve, reject) => {
          signAndExecuteTransaction(
            {
              transaction: tx,
              account: currentAccount,
            },
            {
              onSuccess: async (txResult) => {
                try {
                  // Wait for transaction confirmation
                  await suiClient.waitForTransaction({
                    digest: txResult.digest,
                    timeout: 10_000,
                  });

                  const transactionResult = await suiClient.getTransactionBlock({
                    digest: txResult.digest,
                    options: {
                      showEffects: true,
                      showObjectChanges: true,
                      showEvents: true,
                    },
                  });

                  if (transactionResult.effects?.status?.status !== "success") {
                    throw new Error("Transaction failed");
                  }

                  // Extract created objects
                  const createdObjects = transactionResult.objectChanges?.filter(
                    ({ type }) => type === "created"
                  ) as SuiObjectChangeCreated[];

                  const hitOrStandRequest = createdObjects.find(
                    ({ objectType }) =>
                      objectType ===
                      `${
                        process.env.NEXT_PUBLIC_PACKAGE_ADDRESS
                      }::single_player_blackjack::${move
                        .slice(0, 1)
                        .toUpperCase()
                        .concat(move.slice(1))}Request`
                  );

                  if (!hitOrStandRequest) {
                    throw new Error(
                      `No ${move}Request found in the transaction objects`
                    );
                  }

                  console.log({
                    [`${move}RequestId`]: hitOrStandRequest?.objectId,
                  });

                  // Success handler
                  const moveResult = await onRequestMoveSuccess({
                    move,
                    gameId,
                    requestObjectId: hitOrStandRequest?.objectId!,
                    txDigest: transactionResult.effects?.transactionDigest!,
                  });
                  resolve(moveResult);
                } catch (error) {
                  console.error(error);
                  toast.error(`Error processing ${move} transaction`);
                  setIsMoveLoading(false);
                  reject(error);
                }
              },
              onError: (error) => {
                console.error(error);
                toast.error(`Error executing ${move}`);
                setIsMoveLoading(false);
                reject(error);
              }
            }
          );
        });
      } catch (err) {
        console.error(err);
        toast.error(`Error executing ${move}`);
        setIsMoveLoading(false);
        return null;
      }
    },
    [currentAccount, signAndExecuteTransaction, suiClient]
  );

  const onRequestMoveSuccess = async ({
    gameId,
    move,
    txDigest,
    requestObjectId,
  }: OnRequestMoveSuccessProps): Promise<HandleSuccessResponse | null> => {
    return axios
      .post(`/api/games/${gameId}/${move}`, {
        requestObjectId,
        txDigest,
      })
      .then((resp) => {
        const { message, txDigest } = resp.data;
        console.log(message);
        setIsMoveLoading(false);
        return {
          gameId,
          txDigest,
        };
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Error executing ${move}`);
        setIsMoveLoading(false);
        return null;
      });
  };

  return {
    isMoveLoading,
    handleHitOrStand,
  };
};
