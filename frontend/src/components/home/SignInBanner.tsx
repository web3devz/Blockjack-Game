import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useConnectWallet, useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const SignInBanner = () => {
  const { mutate: connect } = useConnectWallet();
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // If already connected, show different content
  if (currentAccount) {
    return (
      <div className="flex flex-col items-center space-y-[20px]">
        <div className="bg-white flex flex-col p-[60px] max-w-[480px] mx-auto rounded-[24px] items-center space-y-[60px]">
          <Image
            src="/general/onechain-logo-green.svg"
            alt="OneChain"
            width={160}
            height={20}
          />
          <div className="flex flex-col space-y-[30px] items-center">
            <div className="flex flex-col space-y-[20px] items-center">
              <div className="font-[700] text-[20px] text-center">
                Wallet Connected! <br /> Ready to Play OneChain Blackjack
              </div>
              <div className="text-center text-opacity-90 text-[14px] text-[#4F4F4F]">
                Your wallet is connected and ready to go! You can now enjoy a seamless, 
                fair, and thrilling blackjack experience on the OneChain blockchain.
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 w-full">
                <div className="text-xs text-green-600 font-medium">Connected Address:</div>
                <div className="text-xs text-green-800 font-mono">
                  {currentAccount.address.slice(0, 12)}...{currentAccount.address.slice(-8)}
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push("/new")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200"
            >
              Start Playing
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center text-white text-[12px]">
          <div className="text-center">Learn more about OneChain at</div>
          <Link
            href="https://doc-testnet.onelabs.cc"
            target="_blank"
            rel="noopenner noreferrer"
            className="underline"
          >
            doc-testnet.onelabs.cc
          </Link>
        </div>
      </div>
    );
  }

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // Prioritize OneChain wallet detection
      let availableWallet = wallets.find(wallet => {
        return wallet && wallet.name && (
          wallet.name.toLowerCase().includes('onechain') ||
          wallet.name.toLowerCase().includes('onelabs')
        ) && wallet.features && wallet.features['standard:connect']
      });
      
      // Fallback to any wallet with connect feature
      if (!availableWallet) {
        availableWallet = wallets.find(wallet => {
          return wallet && wallet.features && wallet.features['standard:connect']
        });
      }
      
      if (!availableWallet) {
        setIsLoading(false);
        toast.error("No OneChain wallet found. Please install the OneChain wallet extension.");
        return;
      }

      connect(
        { wallet: availableWallet },
        {
          onSuccess: () => {
            setIsLoading(false);
            toast.success(`Connected to ${availableWallet?.name || 'wallet'} successfully!`);
            router.push("/new");
          },
          onError: (error) => {
            setIsLoading(false);
            console.error("Wallet connection error:", error);
            const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
            toast.error(`Failed to connect wallet: ${errorMessage}`);
          },
        }
      );
    } catch (error) {
      setIsLoading(false);
      console.error("Connect function error:", error);
      toast.error("Failed to initialize wallet connection");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-[20px]">
      <div className="bg-white flex flex-col p-[60px] max-w-[480px] mx-auto rounded-[24px] items-center space-y-[60px]">
        <Image
          src="/general/onechain-logo-green.svg"
          alt="OneChain Labs"
          width={160}
          height={20}
        />
        <div className="flex flex-col space-y-[30px] items-center">
          <div className="flex flex-col space-y-[20px] items-center">
            <div className="font-[700] text-[20px] text-center">
              Connect Wallet and Play <br /> OneChain Blackjack
            </div>
            <div className="text-center text-opacity-90 text-[14px] text-[#4F4F4F]">
              Welcome to OneChain Blackjack – where blockchain meets Blackjack!
              Experience the fusion of cutting-edge technology and classic card
              gaming. Connect your wallet now for a seamless, fair, and thrilling adventure on
              the OneChain blockchain. Good luck at the tables!
            </div>
          </div>
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center text-white text-[12px]">
        <div className="text-center">Learn more about OneChain at</div>
        <Link
          href="https://doc-testnet.onelabs.cc"
          target="_blank"
          rel="noopenner noreferrer"
          className="underline"
        >
          doc-testnet.onelabs.cc
        </Link>
      </div>
    </div>
  );
};
