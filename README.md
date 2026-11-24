# AquaRush — Emergency Drinking Water Tanker Supply Booking System

## Project objective
Develop a responsive, interactive frontend application that helps residents access and manage emergency drinking water tanker bookings without relying on backend services.

## Technologies used
- HTML5 — structure and forms
- CSS3 — layout, styling and responsive design
- JavaScript — booking logic, calculations, validation and interactions
- Browser localStorage — demo data storage

No React, Node.js, TypeScript or JavaScript framework is used.

## Main features
1. Homepage and tanker catalogue.
2. Tanker capacities: 2,000 L, 3,000 L, 5,000 L and 10,000 L.
3. Sample price per tanker.
4. Search tanker options.
5. Cart with quantity changes and removal.
6. Customer details and delivery address form.
7. Preferred delivery date and time slot.
8. Normal delivery: ₹0 extra charge.
9. Fast delivery: ₹100 extra charge.
10. Emergency delivery: ₹500 extra charge.
11. Booking confirmation and unique booking ID.
12. Track bookings using the customer email.
13. Cancel pending bookings.
14. Admin demo login and dashboard.
15. Admin can update booking statuses and manage tanker capacity, price and stock.

## Sample tanker prices
- 2,000 L: ₹1,200
- 3,000 L: ₹1,800
- 5,000 L: ₹2,800
- 10,000 L: ₹5,000

These are illustrative project values, not real supplier quotations. They can be changed from the admin dashboard.

## How to run on your computer
1. Download and extract the ZIP file.
2. Open the extracted `AquaRush` folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. The website will open in your browser.

You can also open `index.html` directly in a browser, but Live Server is recommended.

## Admin demonstration
- Open `admin.html`.
- Demo password: `admin123`.

This is only a frontend demonstration password, not secure authentication.

## GitHub Pages deployment
1. Sign in to GitHub and create a new public repository named `aquarush`.
2. Extract this ZIP.
3. Upload all files inside the `AquaRush` folder to the repository root (not the ZIP file itself).
4. Open repository **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`.
7. Save and wait for GitHub Pages to publish.
8. Your website URL will look like `https://YOUR-USERNAME.github.io/aquarush/`.

## Important limitations
- This is a frontend-only educational prototype.
- localStorage saves data only in the same browser profile on the same device. It does not share bookings between different users or devices.
- The admin demo password is not secure authentication.
- There is no real tanker dispatch, live GPS tracking, online payment, supplier connection or real-time stock verification.
- Delivery date and time are requested preferences, not guaranteed appointments.
- All prices and sample booking data are for demonstration only.
- Do not enter real sensitive customer information.
