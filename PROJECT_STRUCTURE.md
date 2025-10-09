# OneFrame - Complete React/Next.js Project Documentation

## 🎯 Project Overview
A fully responsive vehicle customization landing page built with Next.js 14, TypeScript, Tailwind CSS, featuring dark/light mode, internationalization (English/Arabic), and interactive 3D carousel.

---

## 📁 Project Structure

```
oneframe/
├── src/
│   └── app/
│       ├── api/
│       │   └── send/
│       │       └── route.ts              # API endpoint for form submission
│       ├── assets/
│       │   └── logo.jpeg.jpg
│       ├── compenents/                   # All React components
│       │   ├── DetailsModal.tsx          # Product details modal with blur backdrop
│       │   ├── Footer.tsx                # Fixed footer with contact & social links
│       │   ├── LanguageProvider.tsx      # i18n context (EN/AR)
│       │   ├── LanguageToggle.tsx        # Language switcher button
│       │   ├── Navbar.tsx                # (Legacy - replaced by TopBar)
│       │   ├── Orderform.tsx             # Order form with vehicle dropdown
│       │   ├── ProductDetails.tsx        # Product card in modal
│       │   ├── ThemeToggle.tsx           # Dark/Light mode toggle
│       │   ├── ThreeDCarousel.tsx        # 3D rotating carousel
│       │   └── TopBar.tsx                # Sticky header with logo & controls
│       ├── favicon.ico
│       ├── globals.css                   # Global styles + dark mode CSS vars
│       ├── layout.tsx                    # Root layout with providers
│       └── page.tsx                      # Main landing page
├── public/
│   ├── logo.png
│   ├── van.png
│   └── window.svg
├── .env.local                            # Environment variables (Telegram bot)
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── PROJECT_STRUCTURE.md                  # This file
```

---

## ✅ Implemented Features

### 1. **Dark/Light Mode Toggle** ✓
- **Location**: `src/app/compenents/ThemeToggle.tsx`
- **Behavior**:
  - Toggles `html.dark` class on document root
  - Persists preference in `localStorage`
  - Syncs with system preference on first load
  - All components respond with `dark:` Tailwind variants
- **Backgrounds**:
  - Light mode: `bg-white`
  - Dark mode: `bg-gray-950`
- **Implementation**:
  ```tsx
  // Pre-hydration script in layout.tsx ensures no flash
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    root.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    setTheme(next);
  };
  ```

### 2. **3D Carousel with Responsive Cards** ✓
- **Location**: `src/app/compenents/ThreeDCarousel.tsx`
- **Features**:
  - Responsive card sizing based on viewport width
  - Smooth rotation with inertia and auto-spin after idle
  - Mouse tilt effect on Y-axis
  - Drag/swipe support (mouse + touch)
  - `backface-visibility: hidden` prevents card back from showing
  - Cards scale larger on mobile for better visibility
- **Responsive Breakpoints**:
  ```tsx
  if (w < 400) setDims({ cardW: 120, cardH: 160, radius: 180 });
  else if (w < 640) setDims({ cardW: 140, cardH: 190, radius: 200 });
  else if (w < 1024) setDims({ cardW: 160, cardH: 210, radius: 220 });
  else setDims({ cardW: 180, cardH: 240, radius: 240 });
  ```
- **Animation**: Uses `requestAnimationFrame` for 60fps smooth rotation
- **Card Actions**: Buy (left) and Details (right) buttons with event propagation stopped

### 3. **Vehicle Type Selection (Dropdown)** ✓
- **Location**: `src/app/compenents/Orderform.tsx`
- **Type**: Changed from `number` input to `<select>` dropdown
- **Allowed Values**:
  - `van`
  - `camaro`
  - `land rover`
  - `bike`
  - `f1`
  - `mercedes gtr`
- **Validation**: HTML5 `required` attribute ensures selection
- **State Management**: Controlled component with `useState`
- **Implementation**:
  ```tsx
  <select
    name="productId"
    value={selectedProduct}
    onChange={(e) => setSelectedProduct(e.target.value)}
    required
    className="w-full border p-3 rounded bg-white dark:bg-gray-800"
  >
    <option value="" disabled>Select Vehicle Type</option>
    <option value="van">Van</option>
    {/* ... other options */}
  </select>
  ```

### 4. **Fixed Footer Component** ✓
- **Location**: `src/app/compenents/Footer.tsx`
- **Position**: Fixed at bottom using flexbox layout (`mt-auto`)
- **Sections**:
  1. **Brand**: Logo + description
  2. **Contact**: Email + phone with icons
  3. **Social Media**: Facebook, Instagram, Twitter (clickable icons)
  4. **Copyright**: Dynamic year
- **Responsive**: 3-column grid on desktop, stacks on mobile
- **Dark Mode**: Full support with `dark:` variants

### 5. **Sticky Top Bar / Navbar** ✓
- **Location**: `src/app/compenents/TopBar.tsx`
- **Position**: `sticky top-0 z-50` - always visible, doesn't scroll away
- **Layout**:
  - Left: Theme toggle button
  - Center: Brand logo (responsive sizing)
  - Right: Language toggle button
- **Styling**: Semi-transparent backdrop with blur effect
- **Responsive**: Logo scales down on mobile (w-28 → w-36)

---

## 🎨 Styling & Design

### Tailwind CSS Configuration
- **Dark Mode**: Class-based (`html.dark`)
- **Colors**:
  - Primary: Cyan-600
  - Light BG: White
  - Dark BG: Gray-950
  - Borders: Gray-200 (light) / Gray-700 (dark)

### Global Styles (`globals.css`)
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

html.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

### Responsive Design
- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Carousel**: Larger cards on mobile for better UX
- **Forms**: Full-width on mobile, max-width on desktop
- **Footer**: Stacks vertically on mobile

---

## 🌐 Internationalization (i18n)

### Language Provider
- **Location**: `src/app/compenents/LanguageProvider.tsx`
- **Supported Languages**: English (en), Arabic (ar)
- **Features**:
  - Context-based state management
  - `localStorage` persistence
  - Automatic RTL/LTR direction switching
  - Translation function `t(key)`

### Translation Keys
```tsx
const dict = {
  makeOrderTitle: { en: 'MakeOrder', ar: 'اتمم الطلب' },
  buy: { en: 'Buy', ar: 'شراء' },
  details: { en: 'Details', ar: 'تفاصيل' },
  // ... 15+ keys total
};
```

### Usage
```tsx
const { t, lang, toggleLang } = useI18n();
<h1>{t('makeOrderTitle')}</h1>
```

---

## 🔧 Technical Implementation

### State Management
- **React Hooks**: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`
- **Context API**: LanguageProvider for global i18n state
- **Local Storage**: Theme and language persistence

### Animation Strategy
- **Carousel**: `requestAnimationFrame` for smooth 60fps rotation
- **Spinner**: CSS `@keyframes` with transform rotation
- **Transitions**: Tailwind `transition` utilities
- **Note**: Framer Motion not used (native CSS/JS animations instead for better performance)

### Form Handling
- **Validation**: HTML5 attributes (`required`, `type="email"`, `maxLength`)
- **Submission**: Async POST to `/api/send`
- **Feedback**: Loading state + success message
- **Reset**: Form clears after successful submission

### API Integration
- **Endpoint**: `/api/send/route.ts`
- **Method**: POST
- **Payload**: `{ productId, name, email, number, message }`
- **Integration**: Telegram Bot API
- **Environment Variables**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

---

## 🚀 Key Components Breakdown

### 1. ThreeDCarousel.tsx
```tsx
// Responsive dimensions
const [dims, setDims] = useState({ cardW, cardH, radius });

// Animation loop
useEffect(() => {
  const animate = () => {
    if (!isDraggingRef.current) {
      if (Math.abs(velocityRef.current) > 0.01) {
        rotationRef.current += velocityRef.current;
        velocityRef.current *= INERTIA_FRICTION;
      } else if (Date.now() - lastInteractionRef.current > IDLE_TIMEOUT) {
        rotationRef.current += AUTOSPIN_SPEED;
      }
    }
    // Apply transform
    wheelRef.current.style.transform = 
      `rotateX(${tiltRef.current}deg) rotateY(${rotationRef.current}deg)`;
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  animate();
}, []);
```

### 2. ThemeToggle.tsx
```tsx
const toggle = () => {
  const root = document.documentElement;
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  root.classList.toggle('dark', next === 'dark');
  localStorage.setItem('theme', next);
  setTheme(next);
};
```

### 3. OrderForm.tsx
```tsx
// Controlled select with validation
const [selectedProduct, setSelectedProduct] = useState("");

<select
  value={selectedProduct}
  onChange={(e) => setSelectedProduct(e.target.value)}
  required
>
  <option value="" disabled>Select Vehicle Type</option>
  <option value="van">Van</option>
  {/* ... */}
</select>
```

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Carousel cards: 120-140px width
- Logo: 28px (w-28)
- Footer: Single column stack
- Form: Full width with padding

### Tablet (640px - 1024px)
- Carousel cards: 160px width
- Logo: 36px (w-36)
- Footer: 2-column grid
- Form: Max-width 28rem

### Desktop (> 1024px)
- Carousel cards: 180px width
- Logo: 36px (w-36)
- Footer: 3-column grid
- Form: Centered with max-width

---

## 🎯 Accessibility Features

1. **Semantic HTML**: `<header>`, `<main>`, `<footer>`, `<section>`
2. **ARIA Labels**: All icon buttons have `aria-label`
3. **Keyboard Navigation**: All interactive elements focusable
4. **Focus Indicators**: `focus:ring-2 focus:ring-cyan-500`
5. **Color Contrast**: WCAG AA compliant in both modes
6. **Reduced Motion**: Respects `prefers-reduced-motion`

---

## 🔐 Environment Variables

Create `.env.local`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📦 Dependencies

### Core
- `next`: 15.1.4
- `react`: 19.0.0
- `react-dom`: 19.0.0
- `typescript`: ^5

### Styling
- `tailwindcss`: ^3.4.1
- `postcss`: ^8

### Utilities
- None (vanilla React hooks + CSS animations)

---

## ✨ Best Practices Implemented

1. **Component Modularity**: Each component is self-contained and reusable
2. **TypeScript**: Full type safety with interfaces
3. **Performance**: 
   - `useCallback` for stable function references
   - `useMemo` for expensive computations
   - `useRef` for DOM references without re-renders
4. **Code Organization**: Clear separation of concerns
5. **Comments**: Key logic explained inline
6. **Error Handling**: Try-catch blocks in async operations
7. **Responsive Design**: Mobile-first approach
8. **Accessibility**: ARIA labels, semantic HTML, keyboard support
9. **Dark Mode**: Comprehensive support across all components
10. **i18n**: Scalable translation system

---

## 🐛 Known Limitations

1. **Framer Motion**: Not used (native animations instead for better performance)
2. **Carousel Images**: Currently uses placeholder `/van.png` for all cards
3. **Product Data**: Hardcoded in components (could be moved to CMS/API)
4. **Form Validation**: Basic HTML5 only (could add Zod/Yup)

---

## 🚀 Future Enhancements

1. Add Framer Motion for advanced animations
2. Implement CMS for product data
3. Add image carousel in product details modal
4. Enhance form validation with schema validation
5. Add unit tests (Jest + React Testing Library)
6. Implement E2E tests (Playwright/Cypress)
7. Add analytics tracking
8. Implement SEO optimizations
9. Add loading skeletons
10. Implement error boundaries

---

## 📄 License

MIT License - Feel free to use this project as a template.

---

## 👨‍💻 Author

OneFrame Development Team

---

## 📞 Support

For issues or questions, contact: info@oneframe.com

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
