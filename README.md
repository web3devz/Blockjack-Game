# OneChain Blockjack Game

## Overview
OneChain Blockjack is a decentralized card game built on the OneChain blockchain. It combines the classic Blackjack gameplay with the power of blockchain technology, ensuring transparency, fairness, and immutability. Players can interact with the game using their OneChain-compatible wallets and enjoy a seamless gaming experience with OCT tokens.

## OneChain Blockjack Modules

### `single_player_blackjack.move`

Defines the game object and provides methods to create and play a game. The overall flow is:

- **Admin** (owner of the HouseCap object) invokes `initialize_house_data` (one-time setup).
- **Player** invokes `place_bet_and_create_game` to start a new game with randomness and a bet.
- **Dealer** invokes `first_deal` to perform the initial deal.
- **Player** invokes `do_hit` to request a hit (minting and transferring a `HitRequest`).
- **Dealer** invokes `hit` to process the hit action.
- **Player** invokes `do_stand` to request a stand (minting and transferring a `StandRequest`).
- **Dealer** invokes `stand` to process the stand action.

### `counter_nft.move`

Defines the Counter NFT object, used as a unique VRF input for every game. Players must create a Counter NFT before their first game. The UI can automate this during game creation.

## Quickstart

1. Navigate to the setup directory: `cd setup/`
2. Install dependencies: `npm i`
3. Set up environment variables as described in `setup/README.md`
4. Deploy contracts: `./publish.sh testnet`
5. Initialize house data: `npm run init-house` (admin account needs at least 10 OCT + gas)
6. Go to the frontend directory: `cd ../frontend/`
7. Install frontend dependencies: `npm i`
8. Start the development server: `npm run dev`

## Gameplay

- 1-1 game: player vs. dealer (machine).
- Dealer has a public BLS key.
- Player generates randomness, places bet, and starts the game.
- Dealer backend signs and executes the initial deal.
- Player can _Hit_ or _Stand_:
    - _Stand_: Dealer draws until reaching >= 17, then compares sums to declare the winner.
    - _Hit_: Dealer draws a card for the player.
- Each action (Deal, Hit, Stand) involves two transactions: one from the player (intent), one from the dealer (execution).

**Stake is fixed at 0.2 OCT**

## Game Flow

The sequence diagram below illustrates the game flow:

![Sequence Diagram](onechain_blackjack_sequence_diagram.png)

### Source Code Directory Structure

- `contracts/`: Move smart contracts (`blackjack` package)
- `frontend/`: Frontend application (React/Next.js/Tailwind CSS)
- `setup/`: TypeScript project for environment setup, OneChain SDK integration, and deployment scripts

```
OneChain-blockjack/
├── contracts/          # Smart contracts written in Move
├── frontend/           # Frontend application (React/Next.js)
├── setup/              # Deployment and utility scripts
├── tests/              # Unit and integration tests
├── README.md           # Project documentation
└── package.json        # Project dependencies and scripts
```

## How to Start the Game
1. **Clone the Repository**  
    ```bash
    git clone https://github.com/lorine93s/OneChain-blockjack.git
    cd onechain-blockjack
    ```

2. **Install Dependencies**  
    Navigate to the frontend directory and install dependencies:
    ```bash
    cd frontend
    npm install
    ```

3. **Environment Setup**  
    Create a `.env.local` file in the frontend directory with required OneChain configuration (see frontend README for details).

4. **Deploy Smart Contracts** (Optional - contracts are already deployed)
    Ensure you have the OneChain CLI tools installed and configured. Then, deploy the contracts:  
    ```bash
    cd setup
    npm install
    ./publish.sh testnet
    ```

5. **Run the Frontend**  
    Start the frontend application:  
    ```bash
    cd frontend
    npm run dev
    ```

6. **Play the Game**  
    Open your browser and navigate to `http://localhost:3000`. Connect your OneChain wallet and start playing!

## Features
- Decentralized gameplay powered by OneChain blockchain.
- Transparent and fair card dealing using verifiable randomness.
- OneChain wallet integration for seamless OCT token transactions.
- Real-time balance updates and transaction tracking.
- Responsive design for desktop and mobile devices.

## Token Requirements
- Game requires OCT tokens for betting (0.2 OCT per game).
- Use the built-in faucet feature to get testnet OCT tokens.
- Balance is displayed in the top-right corner of the game interface.

## Wallet Connection
The game supports automatic OneChain wallet detection and connection. Supported wallets:
- OneChain Wallet
- OneLabs Wallet
- Any wallet compatible with OneChain network

## Prerequisites
- Node.js (v16 or higher) and npm installed.
- OneChain CLI tools (for contract deployment).
- A OneChain-compatible wallet (e.g., OneChain Wallet, OneLabs Wallet).
- OneChain testnet OCT tokens for gameplay.

## Contributing
Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author
Kien Lam
