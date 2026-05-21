# Requirements Document

## Introduction

This document specifies the requirements for integrating Bitrefill API into the imToken Wallet Demo project. The integration adds a "conversational crypto spending" experience, allowing users to browse gift card catalogs, purchase gift cards using natural language AI intent, manage purchased cards in a local vault, and view aggregated balances — all while preserving existing wallet functionality and using tcx-wasm for transaction signing.

## Glossary

- **Shop_Module**: The new tab/page component that provides gift card catalog browsing, search, and filtering capabilities
- **AI_Intent_Engine**: The extended AI assistant component that parses natural language purchase requests and orchestrates the purchase flow
- **Gift_Card_Vault**: The local encrypted storage system for purchased gift card codes and metadata
- **Balance_Dashboard**: The aggregated view showing crypto balances across all chains plus total gift card value
- **Bitrefill_API_Client**: The frontend utility module that communicates with Bitrefill REST API endpoints
- **Payment_Flow_Engine**: The orchestration logic that creates invoices, constructs transactions, signs via tcx-wasm, and simulates payment completion
- **Product_Card**: A UI component displaying a single gift card product with name, denomination, supported crypto, and discount info
- **Invoice**: A Bitrefill payment request containing a payment address and crypto amount
- **tcx-wasm**: Token Core WebAssembly library used for all cryptographic signing operations

## Requirements

### Requirement 1: Gift Card Catalog Browsing

**User Story:** As a wallet user, I want to browse available gift cards from Bitrefill, so that I can find products to purchase with my cryptocurrency.

#### Acceptance Criteria

1. WHEN the user navigates to the Shop tab, THE Shop_Module SHALL fetch and display product listings from the Bitrefill_API_Client
2. WHEN the user selects a country filter, THE Shop_Module SHALL display only products available in the selected country
3. THE Shop_Module SHALL default the country filter to China
4. WHEN the user selects a category filter, THE Shop_Module SHALL display only products matching the selected category
5. THE Shop_Module SHALL support the following categories: food, e-commerce, gaming, phone top-up, and entertainment
6. WHEN the user enters a keyword of at least 1 character in the search field, THE Shop_Module SHALL display only products whose name or description contains the keyword as a case-insensitive substring match
7. THE Product_Card SHALL display the product name, denomination range, supported cryptocurrencies, and discount percentage
8. WHILE the Bitrefill_API_Client is fetching data, THE Shop_Module SHALL display a loading indicator
9. IF the Bitrefill_API_Client returns an error, THEN THE Shop_Module SHALL display an error message indicating the nature of the failure and a retry button that re-triggers the data fetch
10. IF the applied filters or search keyword yield zero matching products, THEN THE Shop_Module SHALL display an empty-state message indicating no products were found for the current criteria
11. WHEN the user applies multiple filters simultaneously (country, category, and search keyword), THE Shop_Module SHALL display only products that satisfy all active filter conditions

### Requirement 2: AI Intent Purchase Flow

**User Story:** As a wallet user, I want to describe what I want to buy in natural language, so that the AI assistant finds matching products and guides me through the purchase.

#### Acceptance Criteria

1. WHEN the user submits a natural language purchase request of up to 200 characters, THE AI_Intent_Engine SHALL parse the intent to extract product type, denomination, and currency
2. IF the AI_Intent_Engine extracts a product type but the denomination or currency is missing, THEN THE AI_Intent_Engine SHALL prompt the user to provide the missing fields before querying products
3. WHEN the AI_Intent_Engine identifies a purchase intent with product type, denomination, and currency, THE AI_Intent_Engine SHALL query the Bitrefill_API_Client for matching products
4. WHEN matching products are found, THE AI_Intent_Engine SHALL display up to 5 matching products and allow the user to select one, showing product name, denomination, supported cryptocurrencies, and discount percentage for each
5. WHEN the user selects a product and confirms the purchase, THE Payment_Flow_Engine SHALL create an Invoice via the Bitrefill_API_Client
6. WHEN an Invoice is created, THE Payment_Flow_Engine SHALL construct a transaction with the invoice payment address as recipient and the invoice amount as value
7. WHEN the transaction is constructed, THE Payment_Flow_Engine SHALL sign it using tcx-wasm signTransaction
8. WHEN the transaction is signed, THE Payment_Flow_Engine SHALL display the raw signed transaction without broadcasting
9. WHEN the signed transaction is displayed, THE Payment_Flow_Engine SHALL simulate a payment success webhook callback
10. WHEN payment success is simulated, THE Payment_Flow_Engine SHALL display a mock gift card code to the user
11. IF the AI_Intent_Engine cannot extract a product type from the user input, THEN THE AI_Intent_Engine SHALL display a message listing 3 example purchase phrases the user can try
12. IF no matching products are found, THEN THE AI_Intent_Engine SHALL inform the user that no products matched and suggest refining the product type or denomination

### Requirement 3: Gift Card Vault Storage

**User Story:** As a wallet user, I want my purchased gift cards stored securely on my device, so that I can access them later without relying on external servers.

#### Acceptance Criteria

1. WHEN a purchase is completed, THE Gift_Card_Vault SHALL encrypt the gift card data using AES encryption and store it in localStorage
2. THE Gift_Card_Vault SHALL store the following fields for each card: product name, denomination, gift card code, purchase timestamp, and chain used
3. WHEN the user opens the Gift Card Vault view, THE Gift_Card_Vault SHALL decrypt and display all stored gift cards sorted by purchase timestamp in descending order (newest first)
4. WHEN the user clicks the copy button on a gift card, THE Gift_Card_Vault SHALL copy the gift card code to the system clipboard and display a confirmation indicator for 2 seconds
5. WHEN the user deletes a gift card, THE Gift_Card_Vault SHALL display a confirmation prompt, and upon user acceptance, remove the card from localStorage
6. WHEN the user exports gift cards, THE Gift_Card_Vault SHALL generate a downloadable JSON file containing all stored cards with their decrypted data (product name, denomination, gift card code, purchase timestamp, and chain used)
7. IF localStorage is unavailable or full, THEN THE Gift_Card_Vault SHALL display an error message indicating storage is unavailable and preserve any unsaved card data in memory until the user resolves the issue
8. IF decryption of stored gift card data fails, THEN THE Gift_Card_Vault SHALL display an error message indicating the affected cards could not be read and continue displaying any successfully decrypted cards

### Requirement 4: Balance Aggregation Dashboard

**User Story:** As a wallet user, I want to see my total crypto balance and gift card value in one place, so that I can understand my overall spending power at a glance.

#### Acceptance Criteria

1. THE Balance_Dashboard SHALL display the cryptocurrency balance for each derived chain address in its native token unit, along with a combined total expressed in the wallet's selected fiat currency
2. THE Balance_Dashboard SHALL display the total gift card value as the sum of all stored gift card denominations from the Gift_Card_Vault, grouped by denomination currency
3. WHEN the wallet has no derived addresses, THE Balance_Dashboard SHALL display zero in the wallet's selected fiat currency for the crypto balance section
4. WHEN the Gift_Card_Vault is empty, THE Balance_Dashboard SHALL display zero for the gift card value section
5. WHEN a new gift card is purchased, THE Balance_Dashboard SHALL update the gift card total to include the new card denomination within 2 seconds of purchase completion
6. IF the Balance_Dashboard fails to retrieve cryptocurrency balance data from any chain, THEN THE Balance_Dashboard SHALL display an error indicator for the affected chain and offer a retry option while preserving any previously loaded balances
7. WHEN the Balance_Dashboard view is opened or returned to, THE Balance_Dashboard SHALL refresh all displayed balances from their respective data sources

### Requirement 5: Existing Functionality Preservation

**User Story:** As a wallet user, I want all existing wallet features to continue working after the Bitrefill integration, so that I do not lose any current capabilities.

#### Acceptance Criteria

1. THE Shop_Module SHALL be appended as a new tab after the existing four tabs (Create, Import, Sign, Security) without altering the order, labels, icons, or behavior of those existing tabs
2. THE AI_Intent_Engine SHALL continue to resolve all existing commands (show address, prove ownership, sign message, export keystore, copy addresses) to the same navigation targets and action outputs as the pre-integration version, and new Shop-related commands SHALL NOT override or shadow existing command patterns
3. THE Payment_Flow_Engine SHALL invoke the existing tcx-wasm signTransaction function in src/lib/tcx.ts for all transaction signing without modifying its function signature or internal logic
4. THE Shop_Module SHALL use only packages already listed in package.json dependencies for UI rendering (shadcn/ui, Tailwind CSS, lucide-react, class-variance-authority, clsx, tailwind-merge) and SHALL NOT add new UI framework or component library dependencies
5. WHEN the user interacts with existing Create, Import, Sign, or Security tabs, THE application SHALL produce the same rendered output, accept the same inputs, and return the same functional results (wallet creation, address derivation, message signing, keystore export) as the pre-integration version for identical user inputs
6. THE Shop_Module SHALL not modify the existing WalletData interface or the shared wallet state structure used by existing tabs

### Requirement 6: Bitrefill API Client

**User Story:** As a developer, I want a dedicated API client module for Bitrefill, so that all API interactions are centralized and maintainable.

#### Acceptance Criteria

1. THE Bitrefill_API_Client SHALL support the GET /products endpoint for fetching product catalogs
2. THE Bitrefill_API_Client SHALL support the GET /products/{id} endpoint for fetching product details
3. THE Bitrefill_API_Client SHALL support the POST /invoices endpoint for creating payment invoices
4. THE Bitrefill_API_Client SHALL support the GET /invoices/{id} endpoint for checking invoice status
5. THE Bitrefill_API_Client SHALL authenticate requests using an API key read from an environment variable, and SHALL include the key in every outbound request as an authorization header
6. IF the API key environment variable is not set or is empty at the time of a request, THEN THE Bitrefill_API_Client SHALL return a structured error object indicating a missing configuration and SHALL NOT send the request to the remote server
7. IF an API request receives a non-2xx HTTP response, THEN THE Bitrefill_API_Client SHALL return a structured error object containing the HTTP status code and the error message from the response body
8. IF an API request fails due to a network error or exceeds a timeout of 30 seconds, THEN THE Bitrefill_API_Client SHALL return a structured error object containing an error type distinguishing network failure from timeout and a descriptive message
9. WHILE an API request is in progress, THE Bitrefill_API_Client SHALL expose a loading state with a boolean value of true, and SHALL set the loading state to false once the request completes or fails

### Requirement 7: Payment Confirmation Modal

**User Story:** As a wallet user, I want to review and confirm payment details before signing a transaction, so that I do not accidentally spend my cryptocurrency.

#### Acceptance Criteria

1. WHEN the user initiates a purchase, THE Payment_Flow_Engine SHALL display a confirmation modal within 500 milliseconds that blocks interaction with background content until the user confirms or cancels
2. THE confirmation modal SHALL display: product name, denomination, crypto amount, payment chain, and the full recipient address
3. WHEN the user confirms in the modal, THE Payment_Flow_Engine SHALL proceed with transaction construction and signing
4. WHEN the user cancels in the modal, THE Payment_Flow_Engine SHALL abort the purchase flow and return to the product view without submitting any transaction
5. WHILE the transaction is being signed, THE confirmation modal SHALL display a visual loading indicator with a text label indicating that signing is in progress, and SHALL disable the confirm and cancel actions
6. IF the transaction signing fails or does not complete within 30 seconds, THEN THE Payment_Flow_Engine SHALL stop the signing attempt, display an error message indicating the failure reason, and allow the user to retry or cancel without any funds being deducted

### Requirement 8: Error Handling and Loading States

**User Story:** As a wallet user, I want clear feedback during operations, so that I understand what is happening and can recover from errors.

#### Acceptance Criteria

1. WHILE any asynchronous operation (wallet creation, address derivation, message signing, transaction signing, or API request) is in progress, THE application SHALL display an animated spinner icon adjacent to or replacing the triggering action button, and SHALL disable that button to prevent duplicate submissions
2. IF a network request to the Bitrefill API does not receive a response within 15 seconds, THEN THE application SHALL abort the request and display an error message indicating the request timed out
3. IF a network request to the Bitrefill API returns a non-success response or a connection error, THEN THE application SHALL display an error message that includes the nature of the failure (timeout, connection refused, or server error) and SHALL preserve any user-entered form data
4. IF transaction signing via tcx-wasm fails, THEN THE Payment_Flow_Engine SHALL display the error reason returned by tcx-wasm and SHALL present a retry button that re-attempts the signing operation using the same parameters without requiring the user to re-enter data
5. IF the user has no wallet loaded, THEN THE Shop_Module SHALL disable purchase actions and display a prompt directing the user to the Create or Import wallet tab before attempting a purchase
