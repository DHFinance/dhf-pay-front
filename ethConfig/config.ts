import {
  Config, Sepolia,
  Mainnet,
} from '@usedapp/core';


export const configDapp: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    [Sepolia.chainId]: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
  },
};

export const SEPOLIA_SCAN_URL = 'https://sepolia.etherscan.io';
