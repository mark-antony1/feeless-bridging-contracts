pragma solidity ^0.8.4;

import "@openzeppelin-contracts/access/Ownable.sol";
import "@openzeppelin-contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public admin;

    constructor(string memory name, string memory symbol, address _admin) 
        ERC20(name, symbol) {
        admin = _admin;
    }

    function mintMore(uint amount, address recipient) public {
        require(msg.sender == admin);
        _mint(recipient, amount);
    }

    function burnTokens(uint amount) public {
        require(msg.sender == admin);
        _burn(msg.sender, amount);
    }
}