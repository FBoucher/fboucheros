# Bio Pages Documentation

This repository contains two variations of Frank Boucher's biography page.

## Pages

### Variation 1: Card-Based Layout (`bio-v1.html`)
- **Design**: Professional card-based grid layout
- **Best For**: Easy scanning of different bio lengths
- **Features**: 
  - Three bio cards displayed in a responsive grid
  - Hover effects on each card
  - Icon-based headings (📝, 📄, 😄)
  - Cards rearrange to single column on mobile

### Variation 2: Single-Column Layout (`bio-v2.html`)
- **Design**: Modern vertical stacked sections
- **Best For**: Reading flow and emphasis on the long bio
- **Features**:
  - Vertically stacked sections with left accent border
  - Highlighted "Long Bio" section with gradient background
  - Emoji-based headings for modern appeal
  - Clean reading experience on all devices

## Common Features

Both variations include:

✅ **High-Quality Photo**: Frank's photo with downloadable option (1920x1080 JPEG)  
✅ **Language Toggle**: Switch between English and French (persisted in localStorage)  
✅ **Theme Toggle**: Light and dark mode matching the main site theme  
✅ **Three Bio Versions**:
- **Short Bio**: Concise 3-4 sentence overview
- **Long Bio**: Complete professional biography
- **Funny Bio**: Humorous yet professional biography

✅ **MVP Recognition**: Displays 4x Microsoft Azure MVP award  
✅ **Responsive Design**: Optimized for mobile, tablet, and desktop  
✅ **Social Media Links**: Same social icons as main site  
✅ **Easy Navigation**: Links to return to homepage and switch between variations

## File Structure

```
/
├── bio-v1.html       # Variation 1: Card-based layout
├── bio-v2.html       # Variation 2: Single-column layout
├── bio.css           # Shared styles for both variations
├── bio.js            # JavaScript for theme toggle, language toggle, and download
└── images/
    └── frank_boucher_bonjour-hi.jpg  # High-quality photo (1920x1080)
```

## Usage

### Accessing the Bio Pages

- **Variation 1**: `https://fboucheros.com/bio-v1.html`
- **Variation 2**: `https://fboucheros.com/bio-v2.html`

### Photo Download

Click the "Download High-Quality Photo" button to download Frank's photo in high resolution (1920x1080 JPEG format, 96 DPI).

### Language Toggle

Use the EN/FR toggle buttons in the header to switch between English and French content. Your preference is saved automatically.

### Theme Toggle

Click the moon icon in the header to switch between light and dark themes. Your preference is saved automatically.

## Bio Versions

### Short Bio (English)
Perfect for: Conference speaker introductions, podcast descriptions, brief profiles

### Long Bio (English)
Perfect for: Media kits, detailed profiles, speaking engagements, professional documentation

### Funny Bio (English)
Perfect for: Informal events, tech community meetups, social media profiles, personal blog

All three versions are available in both English and French.

## Technical Details

- **No Build Process**: Pure static HTML/CSS/JavaScript
- **No Dependencies**: Uses only CDN resources (Google Fonts, Bootstrap Icons)
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation
- **Performance**: Lightweight (under 50KB total)
- **Mobile-First**: Responsive design with mobile breakpoints at 768px and 480px

## Customization

The theme colors and styling are defined in `bio.css` using CSS custom properties, making it easy to customize colors while maintaining consistency with the main site.

## Maintenance

These bio pages share the same design system as the main site (`index.html`), using the same:
- Color scheme (CSS custom properties)
- Typography (Poppins font)
- Icon set (Bootstrap Icons)
- Social media links
- Footer layout

When updating social links or contact information, remember to update both the main site and bio pages.
