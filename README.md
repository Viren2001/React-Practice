# 💜 Expense Tracker - Premium Financial Dashboard

<p align="center">
  <img src="./public/banner.png" alt="Expense Tracker Banner" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-v12-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer--Motion-v12-FF0055?style=for-the-badge&logo=framer&logoColor=white" />
</p>

---

## ✨ Overview
A state-of-the-art, premium expense tracking application designed for precision and elegance. Built with a focus on high-end aesthetics (**Soft Lavender theme**) and seamless user experience, this tool simplifies financial management with intelligent automation and deep data insights.

## 🚀 Key Features
-   📈 **Pro Dashboard**: Real-time data visualizations using Area and Pie charts with flexible filtering (Monthly, Quarterly, Yearly).
-   🧾 **Receipt OCR**: Upload receipt images and let the app extract data automatically via Tesseract.js.
-   🔄 **Recurring Expenses**: Setup automated monthly tracking for subscription and fixed costs.
-   📂 **Smart Export**: Generate and download professional CSV reports compatible with Excel/Sheets.
-   🏷️ **Autocategorization**: Intelligent keyword detection to automatically categorize your spending.
-   📱 **Mobile First**: Fully responsive layout optimized for all device sizes.
-   🔒 **Enterprise Security**: Firestore security rules and environment-based credential management.

## 🛠️ Tech Stack
-   **Frontend**: React 19, Vite, Lucide React
-   **Animations**: Framer Motion
-   **Charts**: Recharts
-   **Backend/Auth**: Firebase Firestore & Auth
-   **Utilities**: Tesseract.js (OCR), Date-fns

## 🔒 Security Hardening
Recent updates have implemented:
-   **Environment Separation**: Sensitive API keys moved to `.env` files.
-   **Server-Side Rules**: Strict Firestore rules ensure data is private to each user.
-   **Input Sanitization**: Enhanced login/signup security prevents user enumeration.

## 🏁 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Firebase Account

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/Viren2001/React-Practice.git
    cd expense-tracker
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**
    Create a `.env` file in the root and add your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_key
    VITE_FIREBASE_AUTH_DOMAIN=your_domain
    VITE_FIREBASE_PROJECT_ID=your_id
    VITE_FIREBASE_STORAGE_BUCKET=your_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
4.  **Launch the App**
    ```bash
    npm run dev
    ```

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">Built with 💜 by Viren</p>
