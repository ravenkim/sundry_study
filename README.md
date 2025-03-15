# tweakcn

A visual editor for ShadCN UI components. Currently in beta with button component support.

## About

tweakcn is a tool that helps you customize ShadCN UI components visually. Instead of writing code manually, you can use the visual editor to create and customize components, then copy the generated code into your project.

Currently in beta, we're starting with the button component. Support for all other ShadCN components will be added in future releases.

## Current Features

- Visual button customizer with real-time preview
- Full control over:
  - Colors (background, text, border)
  - Dimensions (padding, border radius)
  - Typography (font size, weight, transform)
  - Effects (shadow, transitions)
  - States (hover, focus, active)
- Export to multiple formats:
  - React component
  - CSS
  - Tailwind config
  - ShadCN config
- Responsive design with mobile support

## Roadmap

- [ ] Add support to import `ui` folder
- [ ] Add support for all ShadCN components
- [ ] Add component templates
- [ ] Add theme support
- [ ] Add component library export
- [ ] Add collaboration features

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jnsahaj/tweakcn.git
cd tweakcn
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
