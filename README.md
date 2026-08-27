# Wak Web - Next.js Multi-vendor Platform

A beautiful, high-performance, and responsive multi-vendor e-commerce and services platform built with Next.js 16 (Turbopack) and Tailwind CSS v4.

---

## 🌟 Key Features

- **Nested Category Dropdown**: A premium two-column categories menu separating **Products** and **Services** subcategories, illustrated with custom Lucide icons.
- **Dynamic Mode Switcher**: Centered tab controller to toggle between **Products** and **Services** mode on the landing page, updating global context dynamically via a synchronized `user-mode` cookie.
- **Static Header Navigation**: Consistent and persistent header navigation (`Home | Shop | Services | Contact Us`) for a seamless browsing experience.
- **Marquee Animations**: Custom CSS animations for scrolling product brand logos and service provider cards.
- **Mobile-Responsive Menus**: Adaptive slide-out navigation drawers and layouts optimized for all device sizes.
- **Optimized Builds**: Leverages Next.js App Router, React Server Components (RSC), and Turbopack for lightning-fast loads.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Carousel**: [Swiper](https://swiperjs.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MithilaKhan/Wak-web.git
   cd Wak-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Build & Deploy

### Production Build

Verify TypeScript compilation and compile optimized pages:
```bash
npm run build
```

### Deploy to Vercel

To deploy to production using Vercel CLI:
```bash
npx vercel --prod
```
Alternatively, link this repository to Vercel in your Vercel Dashboard for automated Git-triggered deployments on push.
