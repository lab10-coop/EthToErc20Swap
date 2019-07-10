pragma solidity >=0.5.0 <0.6.0;

contract MakerPriceFeedMock {
    // the actual value of it at the time of writing. See https://etherscan.io/address/0x729D19f657BD0614b4985Cf1D82531c67569197B#readContract
    // as uint, it's 243317500000000000000
    bytes32 feedValue = 0x00000000000000000000000000000000000000000000000d30b56919401bc000;

    function read() external view returns (bytes32) {
        return feedValue;
    }

    function readAsUint() external view returns(uint) {
        return uint(feedValue);
    }

    // this is just easier than messing around with BN in JS
    function readAsUintInMillis() external view returns(uint) {
        return uint(feedValue) / 1E15;
    }
}
