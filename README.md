# Ladr GeoGebra — AI GeoGebra Graphing Calculator

Ladr GeoGebra is a modern, web-based mathematics platform that combines the power of GeoGebra with a premium, glassmorphic user interface. Built with **React** and **Vite**, it offers a seamless experience for graphing, geometry, and 3D calculations, augmented by an AI-styled assistant interface.

## 🚀 Technologies

- **Core Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast HMR and optimized builds.
- **Mathematics Engine**: [GeoGebra Web API](https://www.geogebra.org/wiki/en/Reference:GeoGebra_Apps_API)
- **Styling**: Vanilla CSS3 with advanced features (CSS Variables, Glassmorphism, Animations).
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```bash
ladr-geogebra/
├── index.html              # Application entry point (injects GeoGebra script)
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.jsx            # React root
│   ├── App.jsx             # Main layout component
│   ├── index.css           # Global styles and CSS variables
│   └── components/
│       ├── TopBar.jsx      # Navigation and mode switcher
│       ├── Sidebar.jsx     # AI Assistant chat interface
│       ├── GGBApplet.jsx   # React wrapper for GeoGebra applet
│       └── CanvasAnimation.jsx # Decorative animation for the sidebar
└── legacy_backup/          # Backup of the original HTML/CSS version
```

## ✨ Features

- **Multi-Mode Calculator**: Switch instantly between:
    - 📈 **Graphing**: Standard function plotting.
    - 🧊 **3D Calculator**: 3D surfaces and objects.
    - 📐 **Geometry**: Interactive Euclidean geometry.
    - 🧮 **CAS**: Computer Algebra System for symbolic math.
- **AI Assistant Interface**:
    - A Sidebar styled as an AI chat functionality.
    - **Command Execution**: Directly execute GeoGebra commands (e.g., `f(x) = x^2`, `Polygon(...)`) through the chat input.
    - **Interactive Suggestions**: Quick-start prompts for common mathematical tasks.
- **Premium UI/UX**:
    - Dark mode by default with Glassmorphism effects.
    - Specialized animations (Canvas-based spider-web network) in the welcome card.
    - Responsive layout handling GeoGebra resize events automatically.

## 🛠️ Usage

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Building for Production

Create an optimized build in the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 📝 Notes

- **GeoGebra Injection**: The app loads the GeoGebra deploy script from `https://www.geogebra.org/apps/deployggb.js` in `index.html`. Ensure you have internet access to load this resource.
- **Command Syntax**: The AI input currently accepts direct GeoGebra commands. Separate multiple commands with newlines.

---

*Powered by DeepSeek & GeoGebra*
