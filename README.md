# Stand

A customizable React Native/Expo application designed for interactive client experiences, featuring dynamic theming, quiz functionality, and a modern metallic aesthetic.

![Stand App Screenshot](assets/screenshot.png)

## Overview

Stand is a versatile mobile application built with React Native and Expo that can be easily adapted for different clients. The app features a sleek metallic design with customizable themes, interactive quizzes, and smooth navigation. Client-specific settings, including colors, logos, and quiz data, are defined in `src/constants`, making it easy to create unique experiences for each client.

## Key Features

- **Multi-client Support**
  - Dynamic client configuration
  - Client-specific assets and data loading
  - Customizable branding and themes

- **Interactive Quiz System**
  - Dynamic quiz categories (Smirnoff, Zoco, etc.)
  - Client-specific questions and answers
  - Real-time scoring and feedback

- **Modern Design**
  - Metallic/punk aesthetic with custom backgrounds
  - Responsive layout for modern devices
  - Smooth animations and transitions

- **Customizable Theming**
  - Client-specific color palettes
  - Custom fonts and sizing
  - Flexible component styling

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stand
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure client settings:
   - Open `src/constants/clients.js`
   - Set your desired client configuration
   - Add any client-specific assets

4. Start the development server:
   ```bash
   expo start
   ```

5. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## Usage & Configuration

### Switching Clients

1. Open `src/constants/clients.js`
2. Modify the `CLIENT` constant:
   ```javascript
   export const CLIENT = 'your-client-name';
   ```

### Adding a New Client

1. Create client-specific assets:
   ```
   /assets/clients/<client-name>/images/
   ```

2. Add quiz data:
   ```
   /src/data/<client-name>QuizData.js
   ```

3. Configure client settings in `src/constants/clients.js`:
   ```javascript
   export const CLIENTS = {
     'your-client-name': {
       colors: { ... },
       logo: require('...'),
       quizData: require('...'),
     }
   };
   ```

## Theming & Customization

### Theme Configuration

The app uses a centralized theme system defined in `src/constants/theme.js`:

```javascript
export const COLORS = {
  primary: '#...',
  secondary: '#...',
  // ...
};

export const FONTS = {
  regular: '...',
  medium: '...',
  bold: '...',
};

export const SIZES = {
  base: 8,
  small: 12,
  // ...
};
```

### Customizing Backgrounds

1. Replace the default metallic background:
   - Add your background image to `/assets/images/`
   - Update the background reference in your client configuration

2. Adjust color schemes:
   - Modify the color palette in your client's configuration
   - Update component styles as needed

## File Structure

```
stand/
├── assets/
│   ├── clients/
│   │   └── <client-name>/
│   │       └── images/
│   └── images/
│       └── metallic_background.png
├── src/
│   ├── components/
│   │   ├── CustomButton.tsx
│   │   └── ...
│   ├── constants/
│   │   ├── clients.js
│   │   └── theme.js
│   ├── data/
│   │   ├── smirnoff/
│   │   └── zoco/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── QuizScreen.tsx
│   │   └── ...
│   └── types/
├── app.json
├── package.json
└── README.md
```

## Contributing

We welcome contributions to Stand! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write clear commit messages
- Test changes across different clients
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using React Native and Expo 