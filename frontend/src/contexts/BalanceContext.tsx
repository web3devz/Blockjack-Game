import { useContext, useEffect, useState, createContext, useCallback, useMemo, useRef } from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import BigNumber from "bignumber.js";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { useSui } from "@/hooks/useSui";

export const useBalance = () => {
  const context = useContext(BalanceContext);
  return context;
};

interface BalanceContextProps {
  balance: BigNumber;
  isLoading: boolean;
  handleRefreshBalance: () => void;
}

export const BalanceContext = createContext<BalanceContextProps>({
  balance: BigNumber(0),
  isLoading: true,
  handleRefreshBalance: () => {},
});

export const BalanceProvider = ({ children }: ChildrenProps) => {
  const [balance, setBalance] = useState(BigNumber(0));
  const [isLoading, setIsLoading] = useState(false);
  const { suiClient } = useSui();
  const currentAccount = useCurrentAccount();
  
  // Use refs to prevent excessive calls - CRITICAL for preventing loops
  const isRefreshingRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);
  const currentAddressRef = useRef<string | null>(null);

  // SINGLE balance refresh function - this is the ONLY function that should fetch balance
  const handleRefreshBalance = useCallback(async () => {
    const address = currentAccount?.address;
    if (!address || isRefreshingRef.current) {
      return;
    }

    // Prevent calls more frequent than every 5 seconds
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < 5000) {
      console.log("Balance refresh throttled - too soon since last call");
      return;
    }

    isRefreshingRef.current = true;
    lastRefreshTimeRef.current = now;
    setIsLoading(true);
    
    console.log(`Refreshing OCT balance for ${address}...`);
    
    try {
      const resp = await suiClient.getBalance({
        owner: address,
      });
      
      const newBalance = BigNumber(resp.totalBalance).dividedBy(
        BigNumber(Number(MIST_PER_SUI))
      );
      
      setBalance(newBalance);
      console.log(`Balance updated: ${newBalance.toString()} OCT`);
    } catch (err) {
      console.error("Error fetching OCT balance:", err);
      setBalance(BigNumber(0));
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [currentAccount?.address, suiClient]);

  // Effect that ONLY runs when account changes
  useEffect(() => {
    const address = currentAccount?.address;
    
    // Only proceed if address actually changed
    if (address === currentAddressRef.current) {
      return;
    }
    
    currentAddressRef.current = address || null;
    
    if (!address) {
      setBalance(BigNumber(0));
      setIsLoading(false);
      isRefreshingRef.current = false;
      return;
    }

    // Reset throttling when account changes
    lastRefreshTimeRef.current = 0;
    handleRefreshBalance();
  }, [currentAccount?.address, handleRefreshBalance]);

  const contextValue = useMemo(
    () => ({ balance, handleRefreshBalance, isLoading }),
    [balance, handleRefreshBalance, isLoading]
  );

  return (
    <BalanceContext.Provider value={contextValue}>
      {children}
    </BalanceContext.Provider>
  );
};
