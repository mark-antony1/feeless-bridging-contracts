// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "ds-test/test.sol";

import "../Application.sol"; 
import "../Token.sol"; 

contract ContractTest is DSTest {
    Application application;
    Token token;

    function setUp() public {
        application = new Application(0x4f9B2913e5D80A2B74b187F6286B8580F42D1a8f);
        token = new Token("AUSDC", "AUSDC", address(application));
        application.setTokenContract(address(token));

        address randomAddress = address(0x4f9B2913e5D80A2B74b187F6286B8580F42D1a8f);
        application.setTrustedRemote(69, abi.encode(randomAddress));
        address trustedRemoteLookup = application.retrieveTrustedRemoteLookup(69);
        assertTrue(trustedRemoteLookup == randomAddress);
    }

    function testExample() public {
        assertTrue(true);
    }
}
