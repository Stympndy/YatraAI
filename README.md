# 🇮🇳 YatraAI — Smart India Travel Planner

> *Your intelligent, AI-powered companion for crafting breathtaking journeys across Incredible India.*

![YatraAI Banner](https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Overview

**YatraAI** is a next-generation travel planning web application built specifically for exploring India. Powered by cutting-edge AI (Google Gemini API) and rich interactive UI components, YatraAI takes the hassle out of vacation planning. From curating hyper-personalized day-by-day itineraries and local food hotspots to comparing transport options, finding hand-picked stays, and generating smart packing lists, YatraAI does it all in seconds.

Whether you're planning a serene backwater retreat in Kerala, a snowy mountain escape in Manali, a royal heritage tour in Rajasthan, or a sun-kissed beach holiday in Goa, YatraAI transforms your travel dreams into reality.

---

## 🚀 Key Features

### 1. 🤖 AI-Powered Itinerary Generation
- Generates dynamic, day-by-day itineraries tailored to your source, destination, duration, and group size.
- Intelligent fallback **Demo Mode** ensures seamless exploration even without an API key.

### 2. 🗺️ Interactive Step-by-Step Travel Wizard
- **Step 1: Explore & Itinerary** — Discover top attractions, hidden gems, and must-try local delicacies with vivid imagery and Google Maps integration.
- **Step 2: Transport Hub** — Compare flights, trains, and inter-city cabs with estimated costs, durations, and direct booking links.
- **Step 3: Stays & Accommodation** — Browse verified budget hostels, homestays, and luxury resorts with ratings and amenities.
- **Step 4: Budget & Expenses** — Real-time cost breakdown calculator across transport, stay, food, and local travel, plus an in-built expense-splitting tool for groups.

### 3. 🌦️ Smart Weather & Auto-Packing Checklist
- Destination-aware weather forecasts and seasonal advice.
- Interactive category-wise packing checklists (*Clothing, Essentials, Electronics, Documents*) with real-time progress tracking.

### 4. 📄 Professional PDF Itinerary Export
- Instantly compile your entire trip plan, cost estimates, and day-by-day schedule into a clean, printable/saveable PDF itinerary.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive UI design
- **Icons**: Lucide React
- **AI Integration**: `@google/genai` (Google Gemini SDK)
- **Build Tool**: Vite

---

## 📦 Getting Started & Installation

Follow these steps to run YatraAI locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/Stympndy/YatraAI.git
cd YatraAI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the app automatically switches to Demo Mode with sample trip plans).*

### 4. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🚢 Deployment

YatraAI is fully optimized for lightning-fast deployment on modern hosting platforms like **Vercel**, **Netlify**, or **Render**:

1. Push your code to GitHub.
2. Import the project into Vercel/Netlify.
3. Set the Build Command to `npm run build` and Output Directory to `dist`.
4. Add your `VITE_GEMINI_API_KEY` in the platform's Environment Variables settings.

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome! Feel free to fork the repository and submit a pull request.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Made with ❤️ for travelers exploring Incredible India.*

