# About

Implements an Ethereum contract which allows easy swapping of ETH for [ATS20](https://etherscan.io/token/0xe41dd6e41f8f9962c5103d95d95f5d9b82d90fdf).  
It is deployed on the Ethereum mainnet at address [0xcc1320a48c76385e17e4e1c759ce8ea1d11687c2](https://etherscan.io/address/0xcc1320a48c76385e17e4e1c759ce8ea1d11687c2).  

This facility was created for Ethereum community members who are looking for a convenient way to get hold of some ATS(20), e.g. in order to interact with the ARTIS blockchain.

The price of ATS20 is defined in the contract, configurable by the contract owner.  
The currently configured price can be determined by [reading the contract](https://etherscan.io/address/0xcc1320a48c76385e17e4e1c759ce8ea1d11687c2#readContract) field `erc20mUSDPrice`. The unit is milli-USD per ATS20. At the time of writing, it's set to 85, meaning that 1 ATS20 will cost the ETH equivalent of 0.085 USD.  
In order to determine the ETH equivalent of a given amount of USD, the contract uses the [Medianizer contract](https://github.com/makerdao/medianizer) of the [MakerDAO system](https://makerdao.com/). That's the same on-chain ETH price feed which is used by the contracts governing the [DAI stablecoin](https://makerdao.com/en/dai).

# How to use

Simple: Send the amount of ETH you want to have swapped to the contract address `0xcc1320a48c76385e17e4e1c759ce8ea1d11687c2`     
<img src="qrcode_0xcc1320a48c76385e17e4e1c759ce8ea1d11687c2.png" width="300px">

The transaction will fail if the gas limit is set too low (< 60,000) or if the contract doesn't have enough ATS20 to execute the swap. Of course you won't lose your ETH in those cases.  
You can check the current ATS20 balance of the contract [here](https://etherscan.io/token/0xe41dd6e41f8f9962c5103d95d95f5d9b82d90fdf?a=0xcc1320a48c76385e17e4e1c759ce8ea1d11687c2). In case it's less than what you want/need, feel free to contact us.    
Once you got the ATS20, you may want to convert it to ATS on ARTIS Σ1. Read on in order to find out how to do that.

# How to test

In order to test the contract, install the dependencies with `npm i`, then run `npm run test`.  
This will spawn a test blockchain in the background and run the tests in the _test_ directory.

# ATS20 and ATS

ATS is the native token of the [ARTIS](https://artis.eco/) blockchain.  
ATS20 is an [ERC20](https://eips.ethereum.org/EIPS/eip-20) token (more specifically, also a [ERC677](https://github.com/ethereum/EIPs/issues/677) token) which is a representation of ATS on the Ethereum mainnet.  

ATS20 tokens can be created only by transferring ATS from ARTIS Σ1 to Ethereum via the bridge set up for that purpose.    
That bridge consists of a set of [contracts](https://github.com/lab10-coop/artis-bridge-contracts) and of instances of an [oracle application](https://github.com/lab10-coop/artis-bridge-oracle) which are run by the so-called _bridge authorities_.  
The [authorities of the ATS<->ATS20 bridge](https://bridge.artis.network/status) are a subset of the [authorities of the ARTIS Σ1 consensus protocol](https://trustnodes.artis.network/).  

With the Dapp at https://bridge.artis.network ([source](https://github.com/lab10-coop/artis-bridge-ui)) you can convert ATS20 on Ethereum to ATS on ARTIS Σ1 or the other way round.  
In order to choose the direction, just connect your Metamask to the network from which the transfer starts.  
E.g. in order to convert ATS20 to ATS, connect your Metamask to Ethereum. Reload the Dapp and you should have your Ethereum ATS20 balance on the left and the ARTIS Σ1 balance on the right, with the option to convert ATS20 to ATS.  
If you [connect your Metamask to ARTIS Σ1](https://github.com/lab10-coop/sigma1#use-with-metamask) and then reload the Dapp, it should be the other way round.

At the time of writing, the **price** of 1 ATS20 is set to the USD equivalent of 0.073 EUR ([background](https://www.finanz.at/ratgeber/waehrungsrechner/eur-ats/)).  

## Contact

For further questions, you can contact us at https://gitter.im/lab10-collective/Lobby
