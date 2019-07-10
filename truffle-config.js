/**
 * Docs: truffleframework.com/docs/advanced/configuration
 */

const PrivateKeyProvider = require("truffle-privatekey-provider");
// dummy as fallback for when a readonly connection is enough
const DUMMY_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000001';

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    local: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    // Ethereum mainnet
    mainnet_infura: {
      provider: () => new PrivateKeyProvider(process.env.PRIVKEY || DUMMY_PRIVKEY, `https://mainnet.infura.io`),
      network_id: 1,
      gasPrice: process.env.GASPRICE_GWEI*1E9 || 5111*1E6,
      gas: process.env.GASLIMIT || 1200000,
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.9",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "petersburg"
      }
    }
  }
};
