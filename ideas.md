# Security Monitoring Camera FAQ System - Design Philosophy

## Design Direction Selection

### Selected Approach: Modern Professional Style
**Design Movement**: Contemporary business design + tech-forward aesthetic

**Core Principles**: 
The system prioritizes information clarity through visual hierarchy and strategic whitespace, allowing users to quickly locate answers. Every design element serves the user's search and comprehension needs. A deep blue color palette combined with clean typography conveys safety, security, and professionalism—essential for the security industry. Usability is paramount, with a three-tier progressive disclosure: search, categorization, and answers.

**Color Philosophy**: 
The primary color is deep blue (#1e40af), which communicates professionalism, security, and trustworthiness. Light gray (#f3f4f6) serves as a secondary color to enhance content readability. Teal (#0891b2) provides interactive feedback and highlights key elements. Text uses deep gray (#1f2937) for high contrast and strong legibility. The background is pure white to maintain simplicity and professionalism.

**Layout Paradigm**: 
A fixed search bar and category navigation occupy the top. The left sidebar contains fixed category menus with B2B/B2C switching. The center content area displays question lists and answer details. The footer includes feedback modules. For responsive design, tablets and smaller devices hide the left sidebar in favor of a top tab interface.

**Signature Elements**: 
The search icon and input field emphasize the search functionality's importance. Question cards feature a blue left border with bold questions and indented answers. Category tags use rounded corners with light blue backgrounds and highlight on interaction.

**Interaction Philosophy**: 
Search provides real-time feedback, displaying matching results as the user types. Category switching is instantaneous with no loading delays. Clicking a question expands detailed answers smoothly. Feedback submission requires no page refresh, showing success confirmation immediately.

**Animation Guidelines**: 
Question expansion uses 0.2s ease-in-out with smooth height transitions. Search results fade in over 0.15s for quick responsiveness. Category switching transitions background colors over 0.1s with subtle feedback. Feedback submission includes button loading states and success indicators, with the entire flow completing in 0.3s.

**Typography System**: 
Headlines use Poppins Bold (English) and Noto Sans SC Bold (Chinese) for strong visual weight. Body text uses Inter Regular (English) and Noto Sans SC Regular (Chinese) for readability. Sizes follow: H1 32px, H2 24px, H3 18px, body 14px, small text 12px. Line heights are 1.6 for body text and 1.4 for headlines. Font weights range from 400-500 for body and 600-700 for headlines.

---

## Implementation Notes

**Bilingual Support**:
- All UI text, FAQ content, and user-facing messages support English and Chinese
- Default language: English on first load
- Language switcher button in top navigation (EN / 中文)
- Language preference stored in localStorage for persistence

**B2B vs B2C Differentiation**:
- B2B focus: bulk purchasing, project deployment, device networking, batch management, after-sales support, customization solutions, invoicing
- B2C focus: device selection, home installation, mobile app connection, recording management, alarm settings, night vision, troubleshooting, warranty

**Responsive Design**:
- Desktop: Left sidebar + center content + right feedback
- Tablet: Top navigation tabs + center content + bottom feedback
- Mobile: Hamburger menu + full-width content + sticky search

**Accessibility**:
- High contrast text on all backgrounds
- Keyboard navigation support for all interactive elements
- Clear focus indicators
- ARIA labels for screen readers
