// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
pragma abicoder v2;

import "./NonblockingLzApp.sol";
import "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import "./interfaces/IToken.sol";
import "./interfaces/ILayerZeroEndpoint.sol";

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

    function retrieveTrustedRemoteLookup(uint16 _chainId) public view returns (address) {
        return abi.decode(trustedRemoteLookup[_chainId], (address));
    }

    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory _srcAddress, uint64 _nonce, bytes memory _payload) internal override {
        address srcAddress = abi.decode(_payload, (address));
        address lookupAddress = abi.decode(trustedRemoteLookup[_srcChainId], (address));
        require(lookupAddress == srcAddress);
        (address recipient, uint amount) = abi.decode(_payload, (address, uint));

        IToken(tokenContract).mintMore(recipient, amount);
    }

    function transfer(uint16 _dstChainId, address _recipient, uint _amount) public payable {
        
        bytes memory payload = abi.encode(_recipient, _amount);
        IToken(tokenContract).transferFrom(msg.sender, address(this), _amount);
        IToken(tokenContract).burnTokens(_amount);
        // We must update the trustedRemoteLookup mapping to include the 
        // contract address on the chain we want to send to before calling _lsZend()
        _lzSend(_dstChainId, payload, payable(msg.sender), address(0x0), bytes(""));
    }
    
    // FIXME: Not sure if this is how we're supposed to estimate the fee
    // NOTE: msg.value must be the SAME as the estimated fee
    // function estimateFee(uint16 _dstChainId, address _recipient, uint _amount) public view returns (uint) {
    //     bytes memory payload = abi.encode(_recipient, _amount);
    //     (uint nativeFee, uint zroFee) = ILayerZeroEndpoint(lzEndpoint).estimateFees(_dstChainId, address(this), payload, false, "");
    //     return nativeFee;
    // }
    
    modifier adminOnly() {
        require(msg.sender == admin);
        _;
    }
}
