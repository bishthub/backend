const getChains = async (req, res) => {
  const rubic = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      image:
        'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
      chainName: 'Ethereum Mainnet',
      chainId: 1,
      rpc: ['https://ethereum.publicnode.com', 'https://mainnet.infura.io/v3'],
      blockchain: 'ETH',
    },
    {
      id: 'binance-smart-chain',
      name: 'BNB Chain',
      image:
        'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
      chainName: 'BNB Chain',
      chainId: 56,
      rpc: ['https://bsc-dataseed.binance.org'],
      blockchain: 'BSC',
    },
    {
      id: 'polygon',
      name: 'Polygon',
      image:
        'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
      chainName: 'Polygon Mainnet',
      chainId: 137,
      rpc: [
        'https://polygon-mainnet.infura.io/v3/37addaa8def54eaeb07fa65b939e93e5',
      ],
      blockchain: 'POLYGON',
    },
  ];

  const nitro = [
    {
      id: 'fuji',
      name: 'Fuji',
      image:
        'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
      chainName: 'Avalanche Fuji',
      chainId: 43113,
      rpc: [],
    },
    {
      id: 'mumbai',
      name: 'Mumbai',
      image:
        'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
      chainName: 'Polygon Mumbai',
      chainId: 80001,
      rpc: [],
    },
    {
      id: 'goerli',
      name: 'Goerli',
      image:
        'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
      chainName: 'Ethereum Goerli',
      chainId: 5,
      rpc: [],
    },
    {
      id: 'near',
      name: 'Near',
      image:
        'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
      chainName: 'Near Testnet',
      chainId: 'near-testnet',
      rpc: [],
    },
    {
      id: 'tron',
      name: 'Tron',
      image:
        'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
      chainName: 'Tron Shasta Testnet',
      chainId: 2494104990,
      rpc: [],
    },
  ];

  res.json({
    rubic,
    nitro,
  });
};

module.exports = { getChains };
