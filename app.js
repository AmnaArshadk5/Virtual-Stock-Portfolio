// Contract configuration
const contractABI = [
    "function registerUser() external",
    "function cashBalance(address) public view returns (uint256)",
    "function getSymbols() external view returns (string[] memory)",
    "function pricePerShare(string) public view returns (uint256)",
    "function buyStock(string memory symbol, uint256 qty) external",
    "function sellStock(string memory symbol, uint256 qty) external",
    "function depositVirtual(uint256 amount) external",
    "function resetPortfolio() external",
    "function getAllHoldings(address) external view returns (string[] memory, uint256[] memory)",
    "function getPortfolioValue(address) public view returns (uint256)"
];

const contractAddress = "0xa29ac49e928b1ccbefcc14fc3231197e679a8344";
let provider, signer, contract, userAddress;

// Update status message
function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('statusMessage');
    if (!statusElement) return;
    
    const statusIcon = statusElement.querySelector('.status-icon i');
    const statusText = statusElement.querySelector('.status-text');
    
    if (statusText) statusText.textContent = message;
    statusElement.className = `status-bar ${type}`;
    
    switch(type) {
        case 'success':
            statusIcon.className = 'fas fa-check-circle';
            break;
        case 'error':
            statusIcon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            statusIcon.className = 'fas fa-info-circle';
    }
    
    console.log('Status:', message);
}

// Set loading state
function setLoading(loading) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (loading) {
            btn.classList.add('loading');
        } else {
            btn.classList.remove('loading');
        }
    });
}

// Connect to MetaMask
async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        updateStatus('MetaMask not installed. Please install MetaMask to continue.', 'error');
        return;
    }

    try {
        setLoading(true);
        updateStatus('Connecting to MetaMask...');
        
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        if (!accounts.length) {
            updateStatus('No accounts found. Please unlock MetaMask.', 'error');
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = accounts[0];

        // Update wallet display
        const walletElement = document.getElementById('walletAddress');
        if (walletElement) {
            walletElement.innerHTML = `<i class="fas fa-wallet"></i> ${userAddress.slice(0, 8)}...${userAddress.slice(-6)}`;
        }

        // Get ETH balance
        const balance = await provider.getBalance(userAddress);
        const ethBalance = parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
        const ethBalanceElement = document.getElementById('ethBalance');
        if (ethBalanceElement) {
            ethBalanceElement.textContent = `${ethBalance} ETH`;
        }

        updateStatus('Successfully connected to MetaMask! Click "Load Contract" to continue.', 'success');

    } catch (error) {
        console.error('MetaMask connection error:', error);
        updateStatus('Connection failed: ' + error.message, 'error');
    } finally {
        setLoading(false);
    }
}

// Load contract - SIMPLIFIED VERSION
async function loadContract() {
    if (!signer) {
        updateStatus('Please connect MetaMask first.', 'error');
        return;
    }

    try {
        setLoading(true);
        updateStatus('Loading smart contract...');
        
        // Create contract instance
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // Test with a simple view function first
        try {
            const symbols = await contract.getSymbols();
            updateStatus(`Contract loaded! ${symbols.length} stocks available.`, 'success');
        } catch (error) {
            updateStatus('Contract loaded but some functions may not work.', 'warning');
        }
        
        // Load data without auto-registering
        await populateSymbols();
        await checkBalance();
        await loadHoldings();

    } catch (error) {
        console.error('Contract load error:', error);
        updateStatus('Failed to load contract: ' + error.message, 'error');
    } finally {
        setLoading(false);
    }
}

// Register user with proper error handling
// Register user with proper error handling
async function registerUser() {
    if (!contract) {
        updateStatus('Please load the contract first.', 'error');
        return;
    }

    try {
        setLoading(true);
        updateStatus('Registering your account...');
        
        const tx = await contract.registerUser();
        updateStatus('Registration submitted. Waiting for confirmation...');
        
        await tx.wait();
        // ----------------------------------------------------------------------------------
        // *** THIS LINE IS MODIFIED: Changed $100 to $1000 ***
        // ----------------------------------------------------------------------------------
        updateStatus('Successfully registered! You now have $1000 virtual cash.', 'success'); 
        
        await checkBalance();
        await loadHoldings();

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('Already registered')) {
            updateStatus('You are already registered!', 'success');
            await checkBalance();
        } else {
            updateStatus('Registration failed: ' + error.message, 'error');
        }
    } finally {
        setLoading(false);
    }
}

// Populate symbols with fallback
async function populateSymbols() {
    const select = document.getElementById('symbolSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select a stock...</option>';
    
    let symbols = [];
    try {
        symbols = await contract.getSymbols();
    } catch (error) {
        console.log('Failed to get symbols, using fallback:', error.message);
        symbols = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NFLX', 'META'];
    }
    
    for (const symbol of symbols) {
        const option = document.createElement('option');
        option.value = symbol;
        
        try {
            const price = await contract.pricePerShare(symbol);
            const priceValue = parseInt(price.toString());
            option.textContent = `${symbol} - $${priceValue}`;
        } catch (priceError) {
            // Fallback to estimated price
            const estimatedPrice = Math.floor(Math.random() * 200) + 50;
            option.textContent = `${symbol} - $${estimatedPrice} (est.)`;
        }
        
        select.appendChild(option);
    }
}

// Check balance
async function checkBalance() {
    if (!contract || !userAddress) return;

    try {
        const cash = await contract.cashBalance(userAddress);
        const cashAmount = cash.toString();
        
        const cashBalanceElement = document.getElementById('cashBalance');
        const portfolioValueElement = document.getElementById('portfolioValue');
        
        if (cashBalanceElement) cashBalanceElement.textContent = `$${cashAmount}`;
        if (portfolioValueElement) portfolioValueElement.textContent = `$${cashAmount}`;
        
        // Update funds display
        const fundsElement = document.getElementById('currentFunds');
        if (fundsElement) {
            fundsElement.textContent = `Current funds: $${cashAmount}`;
            fundsElement.style.color = parseInt(cashAmount) > 0 ? '#059669' : '#dc2626';
        }
        
        console.log('Balance checked:', cashAmount);

    } catch (error) {
        console.log('Balance check failed:', error.message);
    }
}

// Load holdings with better error handling
async function loadHoldings() {
    const holdingsBody = document.getElementById('holdingsBody');
    if (!holdingsBody) return;

    try {
        const [symbols, quantities] = await contract.getAllHoldings(userAddress);
        
        if (!symbols.length) {
            showNoHoldings();
            return;
        }
        
        holdingsBody.innerHTML = '';
        let hasAnyHoldings = false;
        
        for (let i = 0; i < symbols.length; i++) {
            const quantity = parseInt(quantities[i].toString());
            if (quantity > 0) {
                hasAnyHoldings = true;
                const symbol = symbols[i];
                
                try {
                    const price = await contract.pricePerShare(symbol);
                    const priceValue = parseInt(price.toString());
                    const totalValue = quantity * priceValue;
                    
                    const row = holdingsBody.insertRow();
                    row.innerHTML = `
                        <td class="stock-symbol">${symbol}</td>
                        <td>${quantity}</td>
                        <td>$${priceValue}</td>
                        <td class="positive">$${totalValue}</td>
                    `;
                } catch (priceError) {
                    const row = holdingsBody.insertRow();
                    row.innerHTML = `
                        <td class="stock-symbol">${symbol}</td>
                        <td>${quantity}</td>
                        <td>N/A</td>
                        <td>N/A</td>
                    `;
                }
            }
        }
        
        if (!hasAnyHoldings) {
            showNoHoldings();
        }
        
    } catch (error) {
        console.error('Holdings load error:', error);
        showNoHoldings();
    }
}

function showNoHoldings() {
    const holdingsBody = document.getElementById('holdingsBody');
    if (!holdingsBody) return;
    
    holdingsBody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align: center; padding: 40px; color: var(--gray-600);">
                <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <br>
                No holdings yet. Start trading to build your portfolio.
            </td>
        </tr>
    `;
}

// Buy stock with balance check
async function buyStock() {
    if (!contract) {
        updateStatus('Please load the contract first.', 'error');
        return;
    }

    const symbol = document.getElementById('symbolSelect').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!symbol) {
        updateStatus('Please select a stock symbol.', 'error');
        return;
    }

    if (!quantity || quantity <= 0) {
        updateStatus('Please enter a valid quantity.', 'error');
        return;
    }

    try {
        setLoading(true);
        updateStatus(`Buying ${quantity} shares of ${symbol}...`);
        
        const tx = await contract.buyStock(symbol, quantity);
        updateStatus('Transaction submitted. Waiting for confirmation...');
        
        await tx.wait();
        updateStatus(`Successfully purchased ${quantity} shares of ${symbol}!`, 'success');
        
        await checkBalance();
        await loadHoldings();

    } catch (error) {
        console.error('Buy error:', error);
        
        if (error.message.includes('Not enough cash')) {
            updateStatus('Not enough virtual cash! You need to deposit more funds.', 'error');
        } else if (error.message.includes('execution reverted')) {
            updateStatus('Transaction failed. The contract rejected the purchase.', 'error');
        } else {
            updateStatus('Buy failed: ' + error.message, 'error');
        }
    } finally {
        setLoading(false);
    }
}

// Sell stock
async function sellStock() {
    if (!contract) {
        updateStatus('Please load the contract first.', 'error');
        return;
    }

    const symbol = document.getElementById('symbolSelect').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!symbol) {
        updateStatus('Please select a stock symbol.', 'error');
        return;
    }

    try {
        setLoading(true);
        updateStatus(`Selling ${quantity} shares of ${symbol}...`);
        
        const tx = await contract.sellStock(symbol, quantity);
        updateStatus('Transaction submitted. Waiting for confirmation...');
        
        await tx.wait();
        updateStatus(`Successfully sold ${quantity} shares of ${symbol}!`, 'success');
        
        await checkBalance();
        await loadHoldings();

    } catch (error) {
        console.error('Sell error:', error);
        updateStatus('Sell failed: ' + error.message, 'error');
    } finally {
        setLoading(false);
    }
}

// Reset portfolio
async function resetPortfolio() {
    if (!contract) {
        updateStatus('Please load the contract first.', 'error');
        return;
    }

    try {
        setLoading(true);
        updateStatus('Resetting your portfolio...');
        
        const tx = await contract.resetPortfolio();
        updateStatus('Reset transaction submitted. Waiting for confirmation...');
        
        await tx.wait();
        updateStatus('Portfolio reset successfully!', 'success');
        
        await checkBalance();
        await loadHoldings();

    } catch (error) {
        console.error('Reset error:', error);
        updateStatus('Reset failed: ' + error.message, 'error');
    } finally {
        setLoading(false);
    }
}

// Deposit virtual funds
async function depositVirtual() {
    if (!contract) {
        updateStatus('Please load the contract first.', 'error');
        return;
    }

    try {
        setLoading(true);
        updateStatus('Depositing $500 virtual cash...');
        
        const tx = await contract.depositVirtual(500);
        updateStatus('Deposit transaction submitted. Waiting for confirmation...');
        
        await tx.wait();
        updateStatus('Successfully deposited $500!', 'success');
        
        await checkBalance();

    } catch (error) {
        console.error('Deposit error:', error);
        
        if (error.message.includes('execution reverted')) {
            updateStatus('Deposit function not available in this contract.', 'error');
        } else {
            updateStatus('Deposit failed: ' + error.message, 'error');
        }
    } finally {
        setLoading(false);
    }
}

// Switch to Sepolia
async function switchToSepolia() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
        });
        updateStatus('Switched to Sepolia network.', 'success');
    } catch (error) {
        updateStatus('Failed to switch network.', 'error');
    }
}

// Refresh everything
async function refreshAll() {
    if (!contract) {
        updateStatus('Please load the contract first.', 'error');
        return;
    }
    
    await checkBalance();
    await loadHoldings();
    await populateSymbols();
    updateStatus('Portfolio refreshed!', 'success');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up event listeners...');
    
    // Add event listeners
    document.getElementById('connectBtn').addEventListener('click', connectMetaMask);
    document.getElementById('loadBtn').addEventListener('click', loadContract);
    document.getElementById('registerBtn').addEventListener('click', registerUser);
    document.getElementById('buyBtn').addEventListener('click', buyStock);
    document.getElementById('sellBtn').addEventListener('click', sellStock);
    document.getElementById('depositBtn').addEventListener('click', depositVirtual);
    document.getElementById('resetBtn').addEventListener('click', resetPortfolio);
    document.getElementById('switchBtn').addEventListener('click', switchToSepolia);
    document.getElementById('refreshPortfolioBtn').addEventListener('click', refreshAll);
    document.getElementById('checkBalanceBtn').addEventListener('click', checkBalance);

    // Initialize
    if (typeof window.ethereum !== 'undefined') {
        updateStatus('MetaMask detected. Click "Connect MetaMask" to start trading.');
    } else {
        updateStatus('MetaMask not found. Please install MetaMask to use this application.', 'error');
    }
});