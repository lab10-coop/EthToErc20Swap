const SwapContract = artifacts.require('EthToErc20Swap');
const ERC20Contract = artifacts.require('MinimalERC20');
const PriceFeedContract = artifacts.require('MakerPriceFeedMock');

const utils = require('./utils');

const BN = web3.utils.BN;

let priceFeedContract;
let erc20Contract;
let swapContract;

contract('EthToErc20Swap', (accounts) => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const newOwner = accounts[3];
    // random address without funds
    const receiver = "0x848ced4b7411c8961bec77c6a110d7f4bfdbad87";

    const initialERC20Price = 200;
    const initialERC20Funds = 10000;

    describe('unfunded swap contract', function () {
        before(async () => {
            priceFeedContract = await PriceFeedContract.new();
        });

        beforeEach(async () => {
            // initialAmount, name, decimals, symbol
            erc20Contract = await ERC20Contract.new(web3.utils.toWei("100000"), "Test Token", 18, "TTT");
            swapContract = await SwapContract.new(priceFeedContract.address, erc20Contract.address, initialERC20Price);
            // fund the swap contract with erc20 tokens
            await erc20Contract.transfer(swapContract.address, web3.utils.toWei(initialERC20Funds.toString()));
        });

        it('make a swap of 1 ETH', async () => {
            const swapTokBal = await erc20Contract.balanceOf(swapContract.address);
            const swapAmountBN = web3.utils.toWei(new BN(1));

            const ethPriceInmUSD = await priceFeedContract.readAsUintInMillis();
            const expectedERC20AmountBN = swapAmountBN.mul(new BN(ethPriceInmUSD)).div(new BN(initialERC20Price));

            await web3.eth.sendTransaction({
                from: user1,
                to: swapContract.address,
                value: swapAmountBN
            });

            const user1Erc20BalanceAfter = await erc20Contract.balanceOf(user1);
            assert.strictEqual(expectedERC20AmountBN.toString(), user1Erc20BalanceAfter.toString());
        });

        it('withdraw all ETH', async () => {
            // make a swap in order to have some ETH in the contract
            await web3.eth.sendTransaction({
                from: user1,
                to: swapContract.address,
                value: web3.utils.toWei("0.1")
            });

            // withdrawing to a different account makes testing easier, because the gas fees don't mess with the balance

            // should fail if not done by owner
            utils.assertRevert(swapContract.withdrawEthTo(receiver, { from: user1 }));

            const swapBalanceBefore = await web3.eth.getBalance(swapContract.address);
            await swapContract.withdrawEthTo(receiver, { from: owner });
            const receiverBalanceAfter = await web3.eth.getBalance(receiver);
            const swapBalanceAfter = await web3.eth.getBalance(swapContract.address);

            assert.strictEqual(receiverBalanceAfter, swapBalanceBefore);
            assert.strictEqual(swapBalanceAfter, "0");
        });

        it('withdraw all ERC20 tokens', async () => {
            // should fail if not done by owner
            utils.assertRevert(swapContract.withdrawErc20To(receiver, { from: user1 }));

            const swapBalanceBefore = await erc20Contract.balanceOf(swapContract.address);
            await swapContract.withdrawErc20To(receiver, { from: owner });
            const receiverBalanceAfter = await erc20Contract.balanceOf(receiver);
            const swapBalanceAfter = await erc20Contract.balanceOf(swapContract.address);

            assert.strictEqual(receiverBalanceAfter.toString(), swapBalanceBefore.toString());
            assert.strictEqual(swapBalanceAfter.toString(), "0");
        });

        it('change owner', async () => {
            // disallow to random dudes
            utils.assertRevert(swapContract.setOwner(newOwner, { from: user1 }));

            await swapContract.setOwner(newOwner, { from: owner });

            // check correct ownership switching with a privileged method...
            // should fail for old owner
            utils.assertRevert(swapContract.withdrawErc20To(receiver, { from: owner }));
            // ... and succeed for the new one
            await swapContract.withdrawErc20To(receiver, { from: newOwner });
        });

        it('swap fails due to insufficient ERC20 funds', async () => {
            // first withdraw the ERC20 tokens
            //await swapContract.withdrawErc20To(receiver, { from: owner });

            const bal = await erc20Contract.balanceOf(swapContract.address);

            utils.assertRevert(web3.eth.sendTransaction({
                from: user1,
                to: swapContract.address,
                value: web3.utils.toWei("0.1")
            }));
        });
    });
});
