// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
pragma abicoder v2;

import "./NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IToken.sol";

contract Application is NonblockingLzApp {

    uint public counter;
    address public tokenContract;
    address public admin;

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {
        admin = msg.sender;
    }

    function setTokenContract(address _tokenContract) public adminOnly {
        require(tokenContract == address(0));
        tokenContract = _tokenContract;
    }

    function setTrustedRemoteLookup(address _desintationContract, uint16 _chainId) public adminOnly {
        setTrustedRemoteLookup(_desintationContract, _chainId);
    }

    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory _srcAddress, uint64 _nonce, bytes memory _payload) internal override {
        address srcAddress = abi.decode(_payload, (address));
        address lookupAddress = abi.decode(trustedRemoteLookup[_srcChainId], (address));
        require(lookupAddress == srcAddress);
        (address recipient, uint amount) = abi.decode(_payload, (address, uint));

        IToken(tokenContract).mintMore(recipient, amount);
    }

    function transfer(uint16 _dstChainId, address _recipient, uint _amount) public payable {
        
        bytes memory payload = (abi.encode(_recipient, _amount));
        
        IToken(tokenContract).burnTokens(_amount);
        // We must update the trustedRemoteLookup mapping to include the 
        // contract address on the chain we want to send to before calling _lsZend()
        _lzSend(_dstChainId, payload, payable(msg.sender), address(0x0), bytes(""));
    }

    modifier adminOnly() {
        require(msg.sender == admin);
        _;
    }
}
