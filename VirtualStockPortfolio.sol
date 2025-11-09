// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStockPortfolio {
    address public owner;
    uint256 public constant INITIAL_BALANCE = 1000;
    
    string[] public symbols;
    mapping(string => uint256) public pricePerShare;
    mapping(address => uint256) public cashBalance;
    mapping(address => mapping(string => uint256)) public holdings;
    mapping(address => bool) public registered;
    
    event Registered(address user);
    event Bought(address user, string symbol, uint256 qty);
    
    constructor() {
        owner = msg.sender;
        // Add some default stocks
        symbols.push("AAPL");
        symbols.push("GOOG"); 
        symbols.push("TSLA");
        pricePerShare["AAPL"] = 10;
        pricePerShare["GOOG"] = 20;
        pricePerShare["TSLA"] = 25;
    }
    
    function registerUser() external {
        require(!registered[msg.sender], "Already registered");
        registered[msg.sender] = true;
        cashBalance[msg.sender] = INITIAL_BALANCE;
        emit Registered(msg.sender);
    }
    
    function buyStock(string calldata symbol, uint256 qty) external {
        require(registered[msg.sender], "Register first");
        require(pricePerShare[symbol] > 0, "Invalid symbol");
        require(qty > 0, "Invalid quantity");
        
        uint256 totalCost = pricePerShare[symbol] * qty;
        require(cashBalance[msg.sender] >= totalCost, "Not enough cash");
        
        cashBalance[msg.sender] -= totalCost;
        holdings[msg.sender][symbol] += qty;
        
        emit Bought(msg.sender, symbol, qty);
    }
    
    function getSymbols() external view returns (string[] memory) {
        return symbols;
    }
    
    function addSymbol(string calldata symbol, uint256 price) external {
        require(msg.sender == owner, "Only owner");
        symbols.push(symbol);
        pricePerShare[symbol] = price;
    }
}