# Mazda AI Co-Pilot: 2026 Fleet Explorer

A highly interactive, responsive landing page showcasing the complete 2026 Mazda vehicle fleet with a real-time AI Chat Assistant that dynamically filters and scores vehicles based on user intent.

## 🚀 Quick Start

### Option 1: Instant Browser Preview (Recommended)
Open `mazda-copilot.html` in any modern web browser. The app loads instantly with all dependencies via CDN.

### Option 2: React Component Integration
Copy `MazdaAICoPilot.jsx` into your React project:
```bash
npm install lucide-react
```
Then import and use the component in your application.

### Option 3: Full React Project Setup
```bash
npm create vite@latest mazda-copilot -- --template react
cd mazda-copilot
npm install lucide-react
npm run dev
```

---

## 🎯 Core Features

### 1. **Dynamic Vehicle Grid (65% Desktop Width)**
- **Real-Time Filtering**: Category quick-tabs instantly filter vehicles
  - All Vehicles
  - Crossovers & SUVs
  - Electrified
  - Cars
- **AI Match Score Badges**: Each vehicle displays a dynamic `[AI Match: XX%]` badge
- **Smart Visibility Logic**: Vehicles scoring below 50% get `opacity-40` + subtle blur effect to reduce cognitive load
- **Responsive Layout**: 
  - 2 columns on desktop/tablet
  - 1 column on mobile
  - Smooth hover animations (scale-105, shadow enhancement)

### 2. **Mazda AI Co-Pilot Chat (35% Desktop Width)**
- **Sticky Sidebar**: Fixed positioning on desktop; sticky mobile drawer on touch devices
- **Smart Chat Stream**: Messages alternate between user (red, right-aligned) and AI (gray, left-aligned)
- **Animated AI Thinking**: 3-dot bouncing animation while processing queries
- **Real-Time Personalization**: Vehicle grid re-sorts and re-scores instantly based on query

### 3. **Query Pills (Pre-Built Scenarios)**
Three clickable test scenarios:

| Pill | Keywords Triggered | Top Match |
|------|---|---|
| "I need an outdoor-friendly SUV with excellent fuel economy." | `outdoor`, `suv`, `efficient`, `fuel`, `hybrid` | CX-50 Hybrid (98%) |
| "Show me a spacious family vehicle with 3 rows of seats." | `family`, `spacious`, `3-row`, `seats`, `phev` | CX-90 PHEV (96%) |
| "I want an affordable, fun weekend car with sports car handling." | `affordable`, `fun`, `performance`, `sporty`, `convertible` | MX-5 Miata (99%) |

### 4. **The 2026 Mazda Fleet Dataset**

| Vehicle | Category | Price | Seats | Engine | Standout Feature |
|---------|----------|-------|-------|--------|-----------------|
| **CX-5** | Crossovers & SUVs | $31,000 | 5 | 2.5L Skyactiv-G | Stretched 4.5" wheelbase, Google Built-In |
| **CX-50 Hybrid** | Electrified | $34,750 | 5 | 2.5L Hybrid (38 MPG) | 551-mile range, off-road modes |
| **CX-70** | Crossovers & SUVs | $42,750 | 5 | 3.3L Turbo Inline-6 | 340 HP, massive cargo space |
| **CX-90 PHEV** | Electrified | $50,695 | 7 | e-Skyactiv PHEV (56 MPGe) | 3-row, electric-only commuting |
| **Mazda3 Hatchback** | Cars | $25,650 | 5 | 2.5L Naturally Aspirated | Premium cabin, urban parking-friendly |
| **MX-5 Miata** | Cars | $30,430 | 2 | 2.0L Skyactiv-G | Perfect 50:50 balance, convertible joy |

---

## 🧠 AI Matching Algorithm

### Score Calculation Logic
```
Base Score (default) = 30%

For each vehicle:
  - Count keyword matches from query against vehicle attributes
  - Each matched keyword = +16 points per keyword hit
  - Final Score = min(99%, max(20%, baseScore + matches))
  
Sorting: Highest score → Lowest score (top-to-bottom)
```

### Visibility & Highlighting
- **≥ 50% Match**: Full opacity, scale animations on hover, interactive
- **< 50% Match**: `opacity-40 blur-sm` → visual de-emphasis without hiding
- **Top Vehicle**: First card in sorted order, fully highlighted

### Example: Query "outdoor-friendly SUV with fuel economy"

Tokenized Keywords: `['outdoor', 'friendly', 'suv', 'with', 'fuel', 'economy']`
After filtering (3+ char words): `['outdoor', 'friendly', 'economy', 'fuel']`

| Vehicle | Attribute Matches | Score | Ranking |
|---------|---|---|---|
| CX-50 Hybrid | `outdoor`, `efficient` (proxy for economy) | 98% | 🥇 1st |
| CX-5 | `family` (family-friendly) | 45% | 5th (blurred) |
| Miata | None | 20% | 6th (blurred) |

---

## 📱 Responsive Design

### Desktop (1024px+)
- 65/35 split view
- Fixed sidebar
- Full vehicle card details visible

### Tablet (768px – 1023px)
- 50/50 split
- Sidebar still fixed
- 2-column grid on left

### Mobile (< 768px)
- Full-screen vehicle grid
- Floating message icon (bottom-right)
- Click to toggle sticky chat drawer (slides from right)
- Overlay dismissible with X button

---

## 🎨 Design System

### Color Palette
- **Primary**: Mazda Red (`#dc2626` / `bg-red-600`)
- **Neutral**: Gray scale (`gray-50` → `gray-900`)
- **Accent**: AI Match badge (`red-600`) with lightning icon

### Typography
- **H1 (Page Title)**: `text-3xl font-bold`
- **H2 (Vehicle Name)**: `text-xl font-bold`
- **Body**: `text-sm`
- **Labels**: `text-xs uppercase`

### Spacing & Layout
- **Section Padding**: `px-6 py-6` (24px)
- **Gap Between Cards**: `gap-6` (24px)
- **Chat Message Padding**: `px-4 py-3` (16px + 12px)
- **Input Height**: `py-2` (8px)

### Animations
- **Card Hover**: `hover:scale-105 transform transition-all duration-300`
- **Category Tab Click**: Instant color swap + shadow
- **Vehicle Opacity**: Smooth `transition-all duration-300`
- **Chat Message Appear**: Fade + slide (CSS built into React rendering)
- **AI Thinking**: 3-dot bounce animation with staggered `animationDelay`

---

## 🔧 Technical Implementation

### State Management
```javascript
- selectedCategory: String (category filter)
- chatMessages: Array<{ role, text }> (chat log)
- inputValue: String (current text input)
- currentQuery: String (active AI filter)
- isAnalyzing: Boolean (loading state for AI thinking)
- showChatMobile: Boolean (mobile drawer toggle)
```

### Key Algorithms
1. **calculateMatchScore(vehicle, keywords)** → Scores vehicle based on keyword overlap
2. **filteredAndScoredVehicles** (useMemo) → Optimized re-calculation on category/query change
3. **handleQueryPill(index)** → Simulates 1.2s AI processing, updates grid instantly
4. **handleSubmitQuery()** → Manual text submission with same flow

### Performance Optimizations
- `useMemo` to prevent unnecessary recalculations of scored vehicle list
- `useRef` for chat auto-scroll (DOM mutation only)
- Conditional rendering for loading animation
- CSS transitions instead of JavaScript animations

---

## 📊 User Flow

```
1. User lands on page
   ↓ Default state: All 6 vehicles, 30% baseline match score
   ↓
2. User clicks a Query Pill (e.g., "outdoor-friendly SUV")
   ↓ Chat shows user message
   ↓ 1.2s loading animation with bouncing dots
   ↓ AI response appears in chat
   ↓ Vehicle grid re-scores instantly
   ↓ Cards re-order by new match score
   ↓ Sub-50% vehicles dim (opacity-40)
   ↓
3. User clicks "Learn More" on a vehicle card
   ↓ (CTA ready for integration with detail page)
   ↓
4. User toggles category filter
   ↓ Grid updates, match scores persist
   ↓
5. On mobile: User clicks chat icon → drawer slides in from right
   ↓ User dismisses drawer → slides back out
```

---

## 🛠️ Integration Points

### Ready for Backend Connection
- Replace hardcoded `MAZDA_FLEET` with API fetch
- Extend `calculateMatchScore()` to call ML scoring endpoint
- Connect "Learn More" button to vehicle detail page
- Add `localStorage` for chat history persistence

### Extensibility
- Add more vehicles to `MAZDA_FLEET` array
- Create additional query pills in `QUERY_PILLS`
- Customize AI responses in `AI_RESPONSES` object
- Adjust colors via Tailwind `from-red-600` class names
- Modify grid columns via Tailwind breakpoints (`grid-cols-1 md:grid-cols-2 lg:grid-cols-2`)

---

## 📦 Dependencies

### Production
- React 18+
- Tailwind CSS 3+
- Lucide React (icons)

### CDN Versions (HTML)
- React 18 (production build)
- React-DOM 18 (production build)
- Tailwind CSS 3 (via CDN)

---

## 🎬 Testing Scenarios

### Test 1: Default Load
- [ ] All 6 vehicles visible
- [ ] All vehicles at 30% match score
- [ ] Categories button shows "All Vehicles" selected
- [ ] Chat displays welcome message

### Test 2: Query Pill #1 (Outdoor SUV)
- [ ] CX-50 Hybrid scores 98% (top)
- [ ] CX-5 scores ~45% (dimmed)
- [ ] Miata/Mazda3 score ~20% (dimmed)
- [ ] Chat shows "Perfect! I've found our best outdoor-friendly SUVs..."
- [ ] AI thinking animation visible for 1.2s

### Test 3: Query Pill #2 (Family 3-Row)
- [ ] CX-90 PHEV scores 96% (top)
- [ ] CX-5 scores ~55% (visible but lower)
- [ ] 2-seat Miata scores ~20% (dimmed)

### Test 4: Query Pill #3 (Fun, Affordable Sports Car)
- [ ] Miata scores 99% (top)
- [ ] Mazda3 Hatchback scores ~70% (visible)
- [ ] CX-70 Luxury SUV scores ~20% (dimmed)

### Test 5: Category Filter
- [ ] Click "Electrified" → Shows only CX-50 Hybrid & CX-90 PHEV
- [ ] Match scores remain consistent
- [ ] Match scores persist when switching back to "All Vehicles"

### Test 6: Manual Text Input
- [ ] Type custom query (e.g., "luxury performance")
- [ ] Chat accepts input
- [ ] AI responds with top-matching vehicle
- [ ] Grid re-scores and re-orders

### Test 7: Mobile Responsiveness
- [ ] Resize to < 768px
- [ ] Chat drawer hidden, only icon visible
- [ ] Click icon → drawer slides in from right
- [ ] Click X → drawer slides back out
- [ ] Vehicle grid stacks to 1 column

---

## 🚀 Next Steps

1. **Backend Integration**: Fetch real-time Mazda inventory & pricing
2. **Analytics Tracking**: Log which query pills users click most
3. **A/B Testing**: Test different AI responses & match algorithms
4. **Deep Linking**: Share queries via URL (`?query=outdoor-suv`)
5. **Voice Input**: Add speech-to-text for queries
6. **Wishlist**: Save favorite vehicles to localStorage
7. **Financing Calculator**: Integrate payment estimator modal
8. **Live Inventory**: Show local dealer stock & availability

---

Made with ❤️ for next-gen automotive retail experiences.
