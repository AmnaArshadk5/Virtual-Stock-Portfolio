# Virtual Stock Portfolio DApp

## 📈 Overview

Virtual Stock Portfolio is a decentralized application (DApp) that allows users to trade virtual stocks on the blockchain. Built with Ethereum smart contracts and a modern web interface, it provides a realistic trading experience with virtual currency.

## 🚀 Features

- **Virtual Stock Trading**: Buy and sell stocks with virtual currency
- **Real-time Portfolio Tracking**: Monitor your holdings and portfolio value
- **Blockchain Integration**: Secure transactions on the Ethereum network
- **User-friendly Interface**: Modern, responsive design with real-time updates
- **Virtual Currency System**: Start with $1000 virtual cash for trading

## 🛠 Tech Stack

### Frontend
- **HTML5** - Structure and semantics
- **CSS3** - Modern styling with CSS variables and gradients
- **JavaScript ES6+** - Client-side logic
- **Ethers.js** - Blockchain interaction
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Blockchain
- **Ethereum** - Blockchain network
- **Solidity** - Smart contract language
- **MetaMask** - Wallet integration
- **Sepolia Testnet** - Development network

### Smart Contract
- **Address**: `0xc95b498c5d4b850c0b9a9e4c2b0492aa90437365`
- **Network**: Sepolia Testnet

## 📋 Prerequisites

Before running this DApp, ensure you have:

1. **Modern Web Browser** (Chrome, Firefox, Brave, or Edge)
2. **MetaMask Wallet** installed as a browser extension
3. **Sepolia ETH** for gas fees (get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/))
4. **Local Web Server** (for development)

## 🎯 Quick Start

### 1. Setup MetaMask
- Install [MetaMask](https://metamask.io/) browser extension
- Create or import a wallet
- Switch to **Sepolia Test Network**
- Get test ETH from a Sepolia faucet

### 2. Run the DApp
```bash
# Clone or download the project files
# Open terminal in project directory

# Start a local server (choose one method)
python -m http.server 8000
# OR
npx http-server
# OR
live-server
```

### 3. Access the DApp
- Open browser and navigate to `http://localhost:8000`
- The application will load automatically

## 🎮 How to Use

### Step-by-Step Trading

1. **Connect Wallet**
   - Click "Connect MetaMask"
   - Authorize the connection in MetaMask

2. **Load Contract**
   - Click "Load Contract"
   - Wait for contract connection confirmation

3. **Get Trading Funds**
   - Click "Get $1000"
   - Confirm transaction in MetaMask
   - Receive $1000 virtual cash

4. **Trade Stocks**
   - Select a stock from dropdown (✅ indicates affordable stocks)
   - Enter quantity (auto-adjusted if exceeds balance)
   - Click "Buy Stock"
   - Confirm transaction in MetaMask

5. **Monitor Portfolio**
   - View your holdings in the table
   - Track portfolio value in real-time
   - Use "Refresh" to update balances

## 📁 Project Structure

```
virtual-stock-portfolio/
├── index.html          # Main application file
├── styles.css          # All styling and responsive design
├── script.js           # Blockchain interaction logic
└── README.md          # This documentation file
```

## 🔧 Smart Contract Functions

The DApp interacts with these contract functions:

- `registerUser()` - Register and get initial virtual cash
- `cashBalance(address)` - Check user's virtual cash balance
- `getSymbols()` - Get available stock symbols
- `pricePerShare(string)` - Get current stock price
- `buyStock(string, uint256)` - Purchase stock shares
- `sellStock(string, uint256)` - Sell stock shares
- `depositVirtual(uint256)` - Add virtual cash (if available)
- `resetPortfolio()` - Reset user portfolio
- `getAllHoldings(address)` - Get user's stock holdings
- `getPortfolioValue(address)` - Calculate total portfolio value

## 🎨 UI Components

### Header
- App logo and title
- Wallet connection status
- ETH balance display

### Portfolio Overview
- Virtual cash balance
- Total portfolio value
- Action buttons (Register, Deposit, Refresh)

### Trading Interface
- Stock selection dropdown with prices
- Quantity input with validation
- Buy/Sell action buttons

### Holdings Table
- Real-time display of owned stocks
- Quantity, current price, and total value
- Empty state with helpful messaging

### Connection Panel
- MetaMask connection
- Contract loading
- Network switching

### Quick Actions
- Balance checking
- Portfolio reset
- Status updates

## 🔒 Security Features

- **MetaMask Integration** - Secure wallet connections
- **Transaction Validation** - Gas estimation and error handling
- **Balance Checks** - Prevent overspending
- **Input Validation** - Safe user inputs

## 🐛 Troubleshooting

### Common Issues

1. **"MetaMask not detected"**
   - Ensure MetaMask is installed and unlocked
   - Refresh the page after installing MetaMask

2. **"Insufficient funds"**
   - Get Sepolia test ETH from a faucet
   - Switch to Sepolia network in MetaMask

3. **"Contract not loaded"**
   - Check internet connection
   - Ensure correct contract address
   - Verify network is Sepolia

4. **"Transaction failed"**
   - Check gas fees are adequate
   - Ensure you have enough ETH for gas
   - Verify stock is affordable

5. **"Not enough cash"**
   - Use "Get $1000" button for more funds
   - Buy smaller quantities
   - Check stock prices before buying

### Debugging

Open browser console (F12) to see:
- Contract interaction logs
- Transaction status
- Error messages
- Balance updates

## 🌐 Network Information

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111 (0xaa36a7)
- **RPC URL**: Various public endpoints
- **Block Explorer**: [Sepolia Etherscan](https://sepolia.etherscan.io/)

## 🔄 Development

### Local Development
```bash
# Start development server
python -m http.server 8000

# Access at
http://localhost:8000
```

### Customization
- Modify `styles.css` for branding
- Update contract address in `script.js`
- Add new features to trading logic

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Verify MetaMask is connected to Sepolia
3. Ensure you have test ETH for gas fees
4. Check contract address is correct

## 📄 License

This project is for educational and demonstration purposes. Feel free to modify and use for learning blockchain development.

## 🚀 Live Demo

Access the live application at: `http://localhost:8000` (when running locally)

---

**Happy Trading!** 📊💹

*Note: This is a demonstration DApp using testnet. No real money or real stocks are involved.*