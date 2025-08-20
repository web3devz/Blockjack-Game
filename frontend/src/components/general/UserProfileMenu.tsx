import Link from "next/link";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { formatString } from "@/helpers/formatString";

export const UserProfileMenu = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  if (!currentAccount) {
    return null;
  }

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-end">
        <div className="text-sm font-medium text-gray-900">
          {formatAddress(currentAccount.address)}
        </div>
        <div className="text-xs text-gray-500">OneChain Wallet</div>
      </div>
      <div className="flex items-center space-x-2">
        <Link
          href="/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          New Game
        </Link>
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};
