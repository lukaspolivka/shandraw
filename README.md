# 🧩 Shandraw

**Shandraw** is a modern, smart, offline-ready DBML and ERD editor that helps you design, visualize, and share database schemas with an intuitive UI and real-time collaboration features. Whether you're a backend developer, database architect, or full-stack engineer, Shandraw makes your schema design process fast, collaborative, and beautiful.

---

## 🚀 Features

- ✏️ **DBML Code Editor** with CodeMirror, live syntax highlighting & autocomplete
- 🧠 **ER Diagram Generation** using React Flow
- 🔄 **Real-time Syncing** between code and diagram
- 📤 **Export Support**: PNG, SVG, PDF
- 📂 **Import/Export DBML** files easily
- 💾 **Offline Support** with IndexedDB caching
- 🔐 **Authentication**: JWT-based auth with Zustand
- 👤 **Role-based Access Control**: Super Admin, Admin, Staff, Cashier
- 📱 **Responsive UI** with mobile-friendly layout
- 🌗 **Light/Dark Themes** using Tailwind + ShadCN UI
- 📌 **Public/Private Project Sharing** with shareable links

---

## 🧑‍💻 Tech Stack

| Layer       | Technology                                |
|-------------|--------------------------------------------|
| Frontend    | Next.js (App Router), TypeScript           |
| Styling     | Tailwind CSS, ShadCN UI                    |
| Icons       | Lucide-react                               |
| State       | Zustand                                    |
| Auth        | JWT, Zod, Zustand                          |
| Database    | MongoDB with Prisma ORM                    |
| Offline     | IndexedDB via custom wrapper               |
| Editor      | CodeMirror, DBML parser                    |
| Diagrams    | React Flow                                 |
| Export      | html-to-image, jsPDF                       |

---

## 📦 Installation

```bash
git clone https://github.com/DevMFarhad/shandraw.git
cd shandraw
pnpm install
pnpm dev
```

## 🔐 Environment Setup

```bash
cp .env.example .env
```

## ⚙️ Script
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
```


<h2>🤝 Contributing</h2>
<ol>
  <li>Fork this repo</li>
  <li>Create a new branch</li>
  <li>Commit and push your changes</li>
  <li>Submit a pull request</li>
</ol>

<hr/>

<h2>📞 Contact</h2>
<p>For help or feature requests, contact us via <a href="https://mfarhad-dev.vercel.app">Mohammad Farhad</a> or open an issue.</p>

<hr/>

<h2>©️ Copyright</h2>
<p>© 2025 <strong>Shandraw</strong>. All rights reserved.<br/>
Developed by Mohammad Farhad.</p>
