//SPDX-License-Identifier: Unlicense
pragma solidity >=0.6.0 <0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor() ERC20("Anuroop Token", "ANT") Ownable() {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
