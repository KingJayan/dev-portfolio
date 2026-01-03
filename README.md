
<div align="center">
  <h1 align="center">Sketchbook Portfolio</h1>
  <p align="center">A creative, single-page developer portfolio with a unique hand-drawn aesthetic.</p>
</div>

<div align="center">
  <a href="https://jayanpatel.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/framer-%230055FF.svg?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br/>

## Features

- **Sketchbook Design**: Custom doodle UI with wobbly borders, paper textures, and messy fonts.
- **Interactivity**:
    - **Free Draw Mode**: Toggle a pencil to draw anywhere on the screen.
    - **Chalkboard Support**: Switch between "Paper" (Light) and "Blackboard" (Dark) modes.
- **3D Parallax Follow Hero**: Mouse-driven parallax effect with floating elements and physics-based animations.
- **Responsive & Single Page**: Smooth scrolling navigation that handles mobile and desktop gracefully.
- **Internationalization**: Built-in simple language translation support.
- **Serverless**: Vercel Serverless Functions for handling contact form submissions.

## Getting Started

#### Prerequisites

You need `node` and `npm` installed.

#### Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/KingJayan/dev-portfolio.git
    cd dev-portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run locally**
    ```bash
    npm run dev
    ```

4.  **Build**
    ```bash
    npm run build
    ```

## Configuration

Edit `src/portfolio.config.ts` to update your personal information, projects, and skills.

```typescript
export const portfolioConfig = {
  personal: {
    name: "Your Name",
    // ...
  },
  // ...
};
```

## Contributing

Feel free to fork this project and use it as a base for your own portfolio!

<a href="https://github.com/KingJayan/dev-portfolio/fork" target="_blank">
  <img src="https://img.shields.io/github/forks/KingJayan/dev-portfolio?style=social" alt="Fork" />
</a>

## License

Open source. Use it, break it, fix it.

---

<div align="center">
  <sub>Built with ❤️ by Jayan Patel</sub>
</div>
