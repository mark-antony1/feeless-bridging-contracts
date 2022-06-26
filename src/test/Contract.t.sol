// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "ds-test/test.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";

import "../Application.sol"; 
import "../Token.sol"; 

contract ContractTest is DSTest {
    Application application;
    Token token;
    Vm vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);


    function setUp() public {
        application = new Application(0xf69186dfBa60DdB133E91E9A4B5673624293d8F8);
        token = new Token("AUSDC", "AUSDC", address(application));
        application.setTokenContract(address(token));
        assertTrue(application.tokenContract() == address(token));

        address randomAddress = address(0x4f9B2913e5D80A2B74b187F6286B8580F42D1a8f);
        application.setTrustedRemote(10011, abi.encode(randomAddress));
        address trustedRemoteLookup = application.retrieveTrustedRemoteLookup(10011);

        assertTrue(trustedRemoteLookup == randomAddress);

        vm.prank(address(application));
        token.mintMore(address(application), 1000);
        assertTrue(token.balanceOf(address(application)) == 1000);

        console.log("about to go into transfer");
        application.transfer{value: 1000}(10011, randomAddress, 1000);
    }

    function testExample() public {
        assertTrue(true);
    }
}
