# ECC Department Library Management System

A seamless, cross-platform mobile application built using **React Native** and **Expo**, designed specifically for the Electronics & Communication (ECC) Department to manage book issues, track overdue records, and handle library statistics.

---

## 🚀 Tech Stack

- **Framework:** React Native + Expo (SDK 54)
- **Navigation:** React Navigation v7 (Native Stack & Bottom Tabs)
- **State Management:** React Context API (`AppContext`)
- **Data Persistence:** AsyncStorage (`@react-native-async-storage/async-storage`)
- **Icons:** Expo Vector Icons / Ionicons
- **UI Components:** Custom atomic UI components configured in `theme.js`

---

## 🏗️ Architecture & Folder Structure

```
c:\Users\anila\Mobile-App\
├── app.json                  # Expo configuration (bundle ID, package name, SDK config)
├── App.js                    # Main Entry point: Wraps context and navigator
├── src/
│   ├── components/
│   │   └── theme.js          # Design System: COLORS, FONTS, SIZES, SHADOWS, Card Component
│   ├── context/
│   │   └── AppContext.js     # Core Logic: Handles login session, book issues, fines, states
│   ├── data/
│   │   └── mockData.js       # Database Mock: USERS, BOOKS, ISSUED_BOOKS, CATEGORIES
│   ├── navigation/
│   │   └── AppNavigator.js   # Router: Switches between Student/Librarian stacks based on role
│   ├── screens/
│   │   ├── auth/             # Login Screen
│   │   ├── librarian/        # Librarian-specific views (Dashboard, Add Book, Return, etc.)
│   │   └── student/          # Student-specific views (Dashboard, History, My Books, etc.)
```

---

## 👥 Authentication & Roles

The app supports Role-Based Access Control (RBAC). Upon login, the app checks the user role and switches the React Navigation Stack entirely.

### 1. Student Portal
- **Dashboard:** At-a-glance view of max limits, current borrowed books, overdue warnings.
- **Browse Books:** Search by title/author and filter by Engineering Categories (VLSI, Communication, Electronics).
- **Book Details:** Real-time checking if a physical copy is in stock.
- **My Books:** Real-time countdown on days remaining until due dates.
- **History:** Complete log of all past transactions.

### 2. Librarian Portal
- **Dashboard:** Global statistics (total books, active issues, total fine pending, recent activity feed).
- **Issue Book Wizard:** 3-step dynamic flow (Search Student → Search Book → Confirm Issue).
- **Return & Fine System:** Automatic calculation of late limits (₹5/day). Immediate fine tracking on return.
- **Overdue Console:** Filtered list of strictly overdue items for easy tracking.
- **Add/Manage Books:** Dynamic library inventory addition.
- **Student Tracker:** Real-time visibility into specific student possession and pending limits.

---

## 💾 Core Logic (`AppContext.js`)

The `AppContext` is the brain of the application. It manages:
- **Persistent Sessions (AsyncStorage):** Upon successful login, the `userId` is saved locally. If the app is force-closed or the website is refreshed, `isRestoringSession` triggers, fetching the ID stealthily so the user bypasses the login screen.
- **Transaction Engine (`issueBook` / `returnBook`):** 
  - Restricts students from passing the limit (3 books).
  - Automatically calculates 14-day checkout windows.
  - Automates inventory counts (decrements `availableCopies` on issue, increments on return).
- **Date/Time Parsing:** Built-in ISO string conversions to track exact due dates and parse fine equations (`Math.ceil((today - dueDate) / 86400000)`).

---

## 🎨 Theme & Design System (`theme.js`)

All styling parameters are abstracted perfectly for future scalability and dark-mode adaptation. 
- **Brand Colors:** Deep Blue (`#1A56DB`), Success Green (`#10B981`), Danger Red (`#EF4444`).
- **Typography Engine:** Scalable SIZES (`xs` to `xxxl`).
- **Shadow Maps:** Custom iOS/Android drop-shadow standardization `SHADOWS.small` / `SHADOWS.medium`.

---

## 🔐 Demo Credentials

*(Sourced straight from `mockData.js`)*

**Librarian Account:**
- **Email:** `namitha@ecc.edu`
- **Password:** `lib123`

**Student Accounts:**
- **Email:** `mrinalini@ecc.edu` | **Password:** `mrinalini123`
- **Email:** `aazim@ecc.edu` | **Password:** `aazim123`
- **Email:** `abdul@ecc.edu` | **Password:** `abdul123`
- **Email:** `nikhil@ecc.edu` | **Password:** `nikhil123`
- **Email:** `namitha@ecc.edu` | **Password:** `namitha123`
