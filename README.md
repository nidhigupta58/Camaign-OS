# Campaign OS: Ecosystem Intelligence Console

![Campaign OS Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000)

## 🌐 The Product
**Campaign OS** is a high-fidelity campaign management and simulation platform designed for grassroots initiatives, non-profits, and community organizers. It acts as an "Operating System" for social impact, providing a unified console to manage multiple campaign nodes, track real-time community engagement, and simulate ecosystem growth.

The application uses a **Geometric Balance** design language—a technical, premium aesthetic that prioritizes data density, visual hierarchy, and structural clarity.

---

## 🚀 Why We Built It
Organizing modern movements often involves fragmented tools—spreadsheets for members, disparate apps for polls, and scattered feeds for discussions. We built Campaign OS to solve the **Coordination Gap**.

We wanted to create a tool where "Intelligence" meets "Action." By treating ogni campaign as a "Node" in a larger ecosystem, organizers can see cross-campaign trends, automate member engagement simulations, and make data-driven decisions through a single, cohesive interface.

---

## 🛠️ Key Features

### 1. Unified Campaign Console
Manage dozens of initiatives simultaneously. Each campaign (or "node") has its own specialized goals:
- **Awareness**: Focus on reach and member growth.
- **Feedback**: Focus on community insight and discussion.
- **Voting**: Focus on decentralized decision-making through polls.

### 2. Live Activity Simulation
The system features a built-in **Activity Simulation Engine**. It generates synthetic community behavior—joins, likes, comments, and votes—allowing you to test your ecosystem's performance and visualization under various load conditions.

### 3. Global Ecosystem Feed
An aggregated "Intelligence Stream" that pulls real-time posts and sentiment data from every active campaign into a single master view.

### 4. Node Telemetry & Analytics
Deep-dive into performance metrics including:
- **Retention Rate**: Tracking member long-term commitment.
- **Engagement Velocity**: Real-time activity tracking via Area and Bar charts.
- **Sync Protocol**: Manual node reconciliation functionality to ensure local state aligns with global metadata.

### 5. Seamless Portability (Share Logic)
Every campaign node is fully portable. The built-in sharing system generates a base64-encoded metadata string that can be shared across domains. The system is designed to be **auto-adaptable** to any host domain using dynamic origin detection.

---

## 💎 Design Philosophy
Campaign OS is built with a **Technical Brutalist** yet polished aesthetic:
- **Typography**: Inter (Sans) for UI clarity and JetBrains Mono for technical telemetry data.
- **Color Palette**: A "Slate & Indigo" core, moving away from default gradients towards architectural depth and high-contrast logic gates.
- **Motion**: Purposeful layout animations using `motion` to reinforce structural changes (e.g., drawer transitions, filter expansions).

---

## 🛠️ Tech Stack
- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **State Management**: Zustand (with Persistence)
- **Styling**: Tailwind CSS
- **Animations**: Motion (framer-motion)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner (Premium Toasts)

---

## 🏃 How to Run the System

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd campaign-os
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The app will typically be available at `http://localhost:3000`.

### Building for Production
To generate a production-ready static site:
```bash
npm run build
```
The optimized files will be in the `dist/` directory.

---

## 📡 Deployment
Campaign OS is designed to be **domain-agnostic**. Simply host the contents of the `dist` folder on any static hosting provider (Vercel, Netlify, Cloud Run). The internal sharing and synchronization logic will automatically adapt to your chosen domain.

---
*Built for the future of community coordination.*
