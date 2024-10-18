# **OvenFresh** (Food Ordering Website)

## Overview

**OvenFresh** is an online food ordering platform designed for users to browse, select, and order their favorite pizzas, salads, and desserts. Built with the **MERN (Next.js) ** stack, this project integrates a seamless UI with powerful backend features, allowing users to easily customize their orders, manage their cart, and make payments.

The application uses a dummy payment gateway to simulate the payment process, enabling users to experience a full checkout flow without handling real transactions.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [File Structure](#file-structure)
4. [Installation](#installation)

## Features

- **User Registration and Authentication**: Users can create accounts, log in, and manage their profiles securely.
- **Menu Browsing**: Easily browse through various categories, including pizzas, salads, and desserts.
- **Order Customization**: Users can customize their orders by selecting sizes and adding extra ingredients.
- **Shopping Cart Management**: Add, remove, and modify items in the cart before proceeding to checkout.
- **Dummy Payment Gateway**: Experience a complete payment flow using a simulated payment gateway.
- **Order History**: View past orders with detailed information about items and totals.
- **Admin Features**: Admins can create, edit, and delete their own menu items. No other admins can edit or view another admin's menu items. Admins can also create new categories for their menu items and Admins can also see the other users details.
- **Responsive Design**: The application is designed to work seamlessly on both desktop and mobile devices.

## Technologies Used

- **Frontend**:

  - **Next.js**: A React framework for server-rendered applications.
  - **React**: A JavaScript library for building user interfaces.
  - **Tailwind CSS**: A utility-first CSS framework for styling.

- **Backend**:

  - **Node.js**: JavaScript runtime for building the backend server.
  - **Express.js**: A web framework for Node.js to handle routing.
  - **MongoDB**: A NoSQL database for storing user and order data.
  - **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
  - **mongodb-adapter**: Adapter for NextAuth to integrate MongoDB authentication.
  - **NextAuth**: Authentication for Next.js applications.

- **Additional Libraries**:

  - **React Hot Toast**: For toast notifications.
  - **React Icons**: For using icons in the UI.
  - **Date-fns**: For date manipulation.
  - **Bcrypt.js**: For password hashing.
  - **Cloudinary**: For handling image uploads.
  - **Google Cloud console**: (OAuth) For handling authentication with NextAuth.

- **Development Tools**:
  - **ESLint**: For linting and ensuring code quality.
  - **PostCSS**: For processing CSS.

## File Structure

The project follows a structured file organization to facilitate development and maintenance. Below is an overview of the main directories and their contents:

1. **app**

   - **api**: Contains API routes for the backend server (auth, categories, menu, menu-items, orders, profile, saveOrder, upload, users).
   - **pages**: Contains pages for various routes (cart, categories, login, menu, menu-items, orders, payment, payment-success, profile, users).

2. **components**

   - **icons**: Reusable icon components (Bars2, ChevronDown, ChevronUp, Left, Plus, Right, ShoppingCart, Trash).
   - **layout**: Layout components for various sections of the app (AddressInputs, EditableImage, Footer, Header, HeroSection, HomeMenu, MenuItemForm, MenuItemPriceProps, OrderItem, SectionHeaders, UserDetails, UserForm, UserTabs).
   - **menu**: Components related to the menu and cart functionalities (AddToCartButton, CartProduct, MenuItem, MenuItemTile).

3. **libs**

   - **mongoConnect**: Utility for connecting to the MongoDB database.

4. **models**
   - **Category**: Schema for menu categories.
   - **MenuItem**: Schema for menu items.
   - **Order**: Schema for orders.
   - **User**: Schema for users.
   - **UserInfos**: Schema for additional user information.

## Installation

To get started with the **OvenFresh** food ordering app, follow these steps:

1. **Clone the repository**:

```bash=
   git clone https://github.com/replyre/food-ordering-app.git
```

2.**Navigate to the project directory**:

```
cd food-ordering-app
```

3.**Install the dependencies**:

```
npm install
```

4.  **Set up environment variables**: Create a `.env` file in the root directory and add your MongoDB connection string and other necessary environment variables:

```
MONGO_URI = your_mongodb_connection_string
NEXTAUTH_SECRET = your_nextauth_secret
SECRET = your_secret
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
```

5. **Run the development server**:

```
npm run dev
```

6. **Open your browser**: Visit [http://localhost:3000](http://localhost:3000) to view the application.
