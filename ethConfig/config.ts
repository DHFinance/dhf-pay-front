import {
  Config, Goerli,
  Mainnet,
} from '@usedapp/core';


export const configDapp: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    [Goerli.chainId]: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
  },
};

export const RINKEBY_SCAN_URL = 'https://goerli.etherscan.io';