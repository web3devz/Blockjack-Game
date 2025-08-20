import { getNetworkName } from "./getNetworkName";

interface GetSuiExplorerLinkProps {
  type: "module" | "object" | "address";
  objectId: string;
  moduleName?: string;
}

export const getSuiExplorerLink = ({
  type,
  objectId,
  moduleName,
}: GetSuiExplorerLinkProps) => {
  const networkName = getNetworkName();
  
  // Use OneChain explorer instead of Sui explorer
  if (type === "object") {
    return `https://onescan.cc/${networkName}/object/${objectId}`;
  } else if (type === "address") {
    return `https://onescan.cc/${networkName}/address/${objectId}`;
  } else {
    // For modules, fallback to object view
    return `https://onescan.cc/${networkName}/object/${objectId}`;
  }
};
