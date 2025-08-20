# OneChain Blockjack Frontend

This is a [Next.js](https://nextjs.org/) project for the OneChain Blockjack game, a decentralized blackjack game built on the OneChain blockchain.

## Quick Start

- Install the npm dependencies with: `npm install`
- Set up environment variables (see below)
- Start the development server with `npm run dev`
- Build the project with: `npm run build`
- Serve the built project with: `npm run start`

## Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```bash
# OneChain Network Configuration
NEXT_PUBLIC_ONECHAIN_RPC_URL=https://rpc-testnet.onelabs.cc:443
NEXT_PUBLIC_ONECHAIN_NETWORK=onechain-testnet

# Contract Configuration (provided after deployment)
NEXT_PUBLIC_HOUSE_DATA_ID=your_house_data_id
NEXT_PUBLIC_PACKAGE_ID=your_package_id

# Admin Configuration (for backend services)
ADMIN_SECRET_KEY=your_admin_private_key
```

### Secret Environment Variables

The following variables should be stored in `.env.local` and never committed to git:
- `ADMIN_SECRET_KEY` (private key of the OneChain account that acts as the house)

## Wallet Integration

The frontend supports OneChain wallet integration with the following features:
- Automatic wallet detection (OneChain Wallet, OneLabs Wallet)
- Direct wallet connection without Google OAuth
- OCT token balance display and management
- Testnet faucet integration for getting OCT tokens

## OneChain Integration Features

- **OCT Token Support**: All transactions use OCT (OneChain Token) instead of SUI
- **OneChain Explorer**: Transaction links redirect to OneChain explorer (onescan.cc)
- **OneChain RPC**: Uses OneChain testnet RPC endpoints
- **Wallet Compatibility**: Supports OneChain-compatible wallets

## Directories Structure

- `src/`
  - `app/`: Next.js app router pages and layouts
    - Contains all the .tsx files that are rendered as pages of the UI
    - Organized in subdirectories based on the desired URL path
    - For more details, see: [NextJS App Router: Defining Routes](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
  - `components/`: React components
    - `general/`: Shared components (Balance, Loading, etc.)
    - `home/`: Home page specific components
    - `layouts/`: Layout components
    - `ui/`: UI library components (Radix/Shadcn)
  - `contexts/`: React Providers and Contexts
    - `BalanceContext.tsx`: OCT token balance management
  - `hooks/`: Custom React hooks
    - `useSui.ts`: OneChain client integration
    - `useRequestSui.ts`: OCT faucet integration
    - `useBlackjackGame.ts`: Game state management
  - `helpers/`: Utility functions
    - `formatSUIAmount.ts`: Token amount formatting
    - `getSuiExplorerLink.ts`: OneChain explorer links
  - `types/`: TypeScript interfaces
    - `GameOnChain.ts`: Game state types
  - `config/`: Configuration files
    - `onechainConfig.ts`: OneChain network configuration

## Main Libraries Used

- **UI Components:**
  - [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
  - [Shadcn](https://ui.shadcn.com/) - Beautiful, reusable components
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

- **OneChain Integration:**
  - [@mysten/dapp-kit](https://www.npmjs.com/package/@mysten/dapp-kit) - Wallet connection
  - [@mysten/sui](https://www.npmjs.com/package/@mysten/sui) - OneChain SDK
  - Custom OneChain configuration for network compatibility

- **State Management:**
  - React Context for global state
  - Custom hooks for blockchain interactions

- **Utilities:**
  - [BigNumber.js](https://www.npmjs.com/package/bignumber.js) - Precise number calculations
  - [React Hot Toast](https://react-hot-toast.com/) - Beautiful notifications

## Game Features

- **Wallet Connection**: Direct OneChain wallet integration
- **Token Management**: OCT token balance display and faucet access
- **Game Play**: Full blackjack game with hit/stand mechanics
- **Transaction Tracking**: Real-time transaction status and explorer links
- **Responsive Design**: Works on desktop and mobile devices

## Development

### Adding New Pages

This project uses [NextJS App Router](https://nextjs.org/docs/app/building-your-application/routing):
- Create directories under `src/app/` for new routes
- Add `page.tsx` files to define page components
- Export components as default exports

### OneChain Integration

The app integrates with OneChain through:
- Custom `useSui` hook that connects to OneChain RPC
- Wallet providers configured for OneChain compatibility
- Transaction signing and execution through OneChain network
- OCT token balance management and faucet integration

### Adding New Pages

This project uses [NextJS App Router](https://nextjs.org/docs/app/building-your-application/routing):
- Create directories under `src/app/` for new routes
- Add `page.tsx` files to define page components
- Export components as default exports

### Game Integration Features

- **Form Handling**: [React hook form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Carousels**: [React slick](https://www.npmjs.com/package/react-slick) for card displays
- **PWA Support**: [Next PWA](https://www.npmjs.com/package/next-pwa) for mobile app experience

### API Endpoints

To add a new endpoint in the `/api/example` path:
- Head into `/app/src/app/api` directory
- Create an `example` directory with a `route.ts` file
- Export functions based on HTTP methods (`GET`, `POST`, etc.)
- For dynamic routing, follow [NextJS Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

### Learn More

To learn more about Next.js and OneChain integration:
- [Next.js Documentation](https://nextjs.org/docs)
- [OneChain Documentation](https://docs.onelabs.cc/)
- [Next.js GitHub repository](https://github.com/vercel/next.js/)
