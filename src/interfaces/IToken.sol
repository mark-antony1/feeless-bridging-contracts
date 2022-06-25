// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IToken is IERC20 {

    function mintMore(address recipient, uint amount) external;

    function burnTokens(uint amount) external;
}