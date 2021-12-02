//SPDX-License-Identifier: Unlicense
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor() ERC20("Anuroop", "ANT") Ownable() {
        _mint(msg.sender, 10000000 * 10**18);
    }
}
