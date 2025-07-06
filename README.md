# 📺 TV Show Dashboard

A responsive Vue 3 + TypeScript application that fetches, categorizes, and displays TV shows by genre using the [TVMaze API](https://www.tvmaze.com/api). Shows are sorted by rating within genres, and the app includes search functionality and a detailed show view.

---

## 🌐 Live Demo

Check out the live version of the app here:  
[https://vue-tv-show-dashboard.vercel.app/](https://vue-tv-show-dashboard.vercel.app/)

---

## 🧠 Features

- 🔍 Search TV shows by name
- 🎭 Categorize shows by genre
- ⭐ Sort shows by rating
- 🖼️ Horizontal scrolling sections per genre
- 📄 View detailed info for each show
- 📱 Fully responsive UI
- ➕ Load more shows with pagination
- 🧪 Unit testing with Vitest

---

## 🧰 Tech Stack

- **Framework**: Vue 3 + Composition API
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Testing**: Vitest + Vue Test Utils
- **Tooling**: Vite

---

## 🚀 Getting Started

### Prerequisites

- Node.js: **v18.13.0** or higher (LTS recommended)
- npm: **v9+**

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tv-show-dashboard.git
cd tv-show-dashboard

# Install dependencies
npm install
```

### ▶️ Run the app locally

```bash
npm run dev
```

Then open your browser to [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Watch mode (optional)
npm run test:watch
```

---

## 📁 Project Structure

```bash
src/
├── assets/                # Tailwind CSS entry
├── components/            # Reusable UI components
│   ├── GenreSection.vue
│   ├── ShowCard.vue
│   └── SearchBar.vue
├── pages/                 # Page-level views
│   ├── Home.vue
│   └── ShowDetails.vue
├── services/              # API interaction
│   └── tvmaze.ts
├── stores/                # Pinia store
│   └── shows.ts
├── router/                # Vue Router setup
│   └── index.ts
├── App.vue
└── main.ts
```

---

## 🧱 Architectural Decisions

- **Vue 3 with Composition API** was used to follow modern best practices and ensure better code organization.
- **Pinia** was chosen over Vuex for its simplicity and native Vue 3 support.
- **Tailwind CSS** provides fast, responsive UI development with utility-first classes.
- **Service abstraction layer** isolates API logic from components, making the app easier to maintain and test.
- **Component-first structure** ensures maximum reusability and testability.
- **Pagination Support** via the TVMaze `?page=` parameter allows for better performance by fetching shows in chunks and loading more as needed.

---

## 🔗 API Reference

- **Get paginated shows**: `https://api.tvmaze.com/shows?page=0`
- **Search shows**: `https://api.tvmaze.com/search/shows?q=QUERY`
- **Get show by ID**: `https://api.tvmaze.com/shows/:id`

Note: Since the API doesn't have a direct "by genre" endpoint, we categorize manually by reading the `genres` array from each show. Pagination is supported using the `?page=` query param (each page = up to 250 shows).

---

## 📸 Screenshots (optional)
_Add some screenshots here if submitting or deploying._

---

## 📄 License

This project is for educational and demonstration purposes only.

---

## 👋 Author

Developed by Reuben Stone (www.reubenstone.co.uk)

> Designed for the ABN AMRO Frontend Developer Assessment
