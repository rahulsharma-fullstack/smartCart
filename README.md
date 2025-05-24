# smartCart
## AI-Driven Personalized Recommendation and In-Store Navigation System

Tired of frustrated shoppers wandering lost in your aisles? SmartCart is the AI-powered solution that personalizes the shopping experience and helps customers find what they need faster with easy-to-use in-store navigation. In present, retail businesses are increasingly pressured to boost sales, improve customer experience and organize their operations to remain competitive. SmartCart targets to address both of these areas by engaging artificial intelligence(AI) and machine learning technologies to provide customer personalized product recommendations while at the same time guiding them through the store using in-store navigation tools. SmartCart is useful for retail stores with a large inventory of items for example grocery stores, department stores, and large retail chains, where customers often find themselves confused by the wide range of products available. By initiating this technology, retail businesses can offer a specialized shopping experience for customers, thereby increasing customer satisfaction and loyalty, while also collecting important valuable data on consumer behaviour and priorities.


![Screenshot 2024-12-13 005621](https://github.com/user-attachments/assets/7ae06b90-62fc-44b3-a42d-952c5e83584c)



# Project Title: SmartCart

## Description

SmartCart is a web application designed to enhance the in-store shopping experience. It allows users to navigate store aisles, locate products, scan barcodes using their device camera, and manage a smart shopping cart. The application leverages Firebase for backend services (Firestore, Authentication, Hosting, Functions) and a modern React frontend stack.

## Features

*   **Interactive Store Map:** Users can view a map of the store (`StoreAisle.jsx`, `public/map.png`) and locate specific products within aisles.
*   **Barcode Scanning:** The application allows users to scan product barcodes (`BarcodeScanner.jsx`, `react-qr-barcode-scanner`, `react-zxing`) to get detailed information and add items to their cart.
*   **Smart Shopping Cart:** Users can manage their shopping cart (`CartIcon.tsx`, `CartScreen.jsx`), view items, and proceed to a simulated checkout (`CheckoutScreen.jsx`).
*   **User Authentication:** Secure login and registration powered by Firebase Authentication (`LoginScreen.jsx`, `AuthContext.jsx`).
*   **Product Search & Details:** Users can search for products (`SearchScreen.jsx`) and view detailed information about each product (`ProductDetailScreen.jsx`, `ProductListScreen.jsx`).
*   **Centralized State Management:** Utilizes React Context API for managing global state like cart items (`CartContext.tsx`) and authentication status (`AuthContext.jsx`).
*   **GraphQL API:** Uses Firebase DataConnect for querying backend data (`dataconnect/` directory).

## Technologies Used

*   **Frontend:**
    *   React (`react`, `react-dom`)
    *   Vite (build tool, dev server)
    *   React Router (`react-router-dom`) for navigation
    *   Tailwind CSS (utility-first CSS framework)
    *   Lucide React (`lucide-react`) for icons
    *   Barcode Scanning Libraries (`react-qr-barcode-scanner`, `react-zxing`)
    *   PostCSS (`postcss`, `autoprefixer`) for CSS processing
    *   JavaScript (JSX)
*   **Backend:**
    *   Firebase
        *   Firestore (NoSQL database)
        *   Firebase Authentication (user management)
        *   Firebase Hosting (static site hosting)
        *   Firebase Functions (serverless backend logic, see `firebase.json`)
    *   Firebase DataConnect (GraphQL for Firebase data, see `dataconnect/` directory)
*   **Linting:**
    *   ESLint (`eslint`, `eslint-plugin-react`, `@eslint/js`, `globals`)

## Directory Structure

*   `public/`: Static assets (images, global `index.html`).
*   `src/`: Main application source code.
    *   `assets/`: Static assets used by components (e.g., SVGs).
    *   `components/`: Reusable React components (e.g., `BarcodeScanner.jsx`, `CartIcon.tsx`).
    *   `context/`: React Context API providers (e.g., `AuthContext.jsx`, `CartContext.tsx`).
    *   `data/`: JSON data files (e.g., `products.json`).
    *   `firebaseConfig.js`: Firebase project initialization.
    *   `pages/`: Top-level route components (e.g., `LoginScreen.jsx`, `ProductListScreen.jsx`).
    *   `main.jsx`: Main entry point of the React application.
    *   `App.jsx`: Root application component with routing setup.
*   `dataconnect/`: Firebase DataConnect configuration (schema, queries, mutations).
*   `functions/`: Firebase Cloud Functions (Node.js backend code).
*   `vite.config.js`: Vite configuration.
*   `tailwind.config.js`: Tailwind CSS configuration.
*   `postcss.config.js`: PostCSS configuration.
*   `firebase.json`: Firebase project configuration (hosting, functions, firestore rules etc.).

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Add a Web app to your Firebase project.
    *   In your Firebase project settings, copy your Firebase project configuration object (apiKey, authDomain, projectId, etc.).
    *   Create a `src/firebaseConfig.js` file (or update the existing one) with your Firebase configuration:
        ```javascript
        // src/firebaseConfig.js
        import { initializeApp } from "firebase/app";
        import { getFirestore } from "firebase/firestore";
        import { getAuth } from "firebase/auth"; // Ensure other services like getStorage are imported if used

        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID",
          // measurementId: "YOUR_MEASUREMENT_ID" // Optional, for Analytics
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        // const storage = getStorage(app); // If you use Firebase Storage

        export { db, auth, app }; // export other services like storage if initialized
        ```
    *   **Authentication:** In the Firebase console, enable the authentication methods you plan to use (e.g., Email/Password, Google Sign-In).
    *   **Firestore:** In the Firebase console, create a Firestore database. Set up security rules (e.g., in `firestore.rules` - not present in `ls` output, but should be created).
    *   **Firebase CLI:** Make sure you have the Firebase CLI installed (`npm install -g firebase-tools`) and are logged in (`firebase login`).
    *   Initialize Firebase in your project directory if not already done (though `.firebaserc` and `firebase.json` suggest it is):
        ```bash
        firebase init
        ```
        Ensure Hosting, Functions, Firestore, and Emulators (optional, for local development) are configured.
    *   **Deploy Firebase Artifacts:**
        *   Firestore rules: `firebase deploy --only firestore:rules` (if you have a `firestore.rules` file)
        *   Firestore indexes: `firebase deploy --only firestore:indexes` (if you have a `firestore.indexes.json` file)
        *   DataConnect schema and connectors: `firebase deploy --only dataconnect`
        *   Firebase Functions: `firebase deploy --only functions`

4.  **HTTPS Setup (Development):**
    *   The Vite configuration (`vite.config.js`) is set up for HTTPS using `cert.key` and `cert.crt`.
    *   You will need to generate these files (e.g., using mkcert) or modify `vite.config.js` to run on HTTP for local development if HTTPS is not required.
    *   Example for generating self-signed certificates (for development only):
        ```bash
        # Install mkcert (follow OS-specific instructions: https://github.com/FiloSottile/mkcert)
        mkcert -install
        mkcert localhost
        # This will create localhost.pem (cert) and localhost-key.pem (key)
        # Rename them to cert.crt and cert.key respectively and place them in the project root.
        ```
    *   Alternatively, comment out or remove the `server.https` section in `vite.config.js` for HTTP.

5.  **Environment Variables:**
    *   Ensure any other necessary environment variables (e.g., for third-party API keys not part of `firebaseConfig.js`) are set up. This project might use a `.env` file for Vite (e.g., `VITE_API_KEY=...`).

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the application, typically on `https://localhost:5173` (Vite's default with HTTPS). The `--host` flag in `package.json` script makes it accessible on your local network.

7.  **Linting:**
    Check for code style issues:
    ```bash
    npm run lint
    ```

## Usage

## Usage

1.  Navigate to the application URL in your browser.
2.  **Login/Register:** Create an account or log in if you have existing credentials.
3.  **Search Products:** Use the search bar to find products.
4.  **Browse Products:** Navigate through product listings or categories.
5.  **View Product Details:** Click on a product to see more information.
6.  **Locate Products:** Use the store map feature to find products in specific aisles.
7.  **Scan Barcodes:** Use the barcode scanning feature (requires camera access, typically prompted by the browser) to identify products and add them to your cart.
8.  **Manage Cart:** View items in your cart (`/cart` page), adjust quantities, and proceed to the checkout screen (`/checkout`).

## Contributing

We welcome contributions to enhance the features and functionality of this application. Please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch:**
    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  **Make your changes:** Implement your feature or bug fix.
4.  **Commit your changes:**
    ```bash
    git commit -m "feat: Describe your feature or fix"
    ```
5.  **Push to your branch:**
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Submit a Pull Request:** Open a pull request against the `main` (or `master`) branch of the original repository.
7.  **Code Style:** Please ensure your code adheres to the existing linting rules (ESLint).

## License

This project is licensed under the MIT License. See the `LICENSE` file for details. (Note: A `LICENSE` file was not listed in the `ls()` output. If one doesn't exist, it should be created, typically containing the MIT License text).
