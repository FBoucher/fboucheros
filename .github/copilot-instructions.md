# FBoucheros Personal Website

FBoucheros is a static HTML, CSS, and JavaScript personal website for Frank Boucher, featuring social media integration, dark/light theme toggle, and RSS feed aggregation from multiple sources (blogs and YouTube channels).

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Serve the website locally:
  - **Python HTTP Server**: `cd /path/to/repo && python3 -m http.server 8000` -- starts immediately, no timeout needed
  - **Node.js http-server**: `npx http-server . -p 8000` -- starts immediately, no timeout needed  
  - **Simple file serving**: Any static file server works - no build process required
- View the website: Open `http://localhost:8000` in browser
- **NO BUILD PROCESS REQUIRED** - This is pure static HTML/CSS/JavaScript
- **NO DEPENDENCIES** - No package.json, no npm install needed
- **NO COMPILATION** - Files are served directly as-is

## Validation

- **ALWAYS manually validate any changes by running the website locally and testing core functionality**
- **Core validation scenarios after making changes:**
  1. **Theme Toggle Test**: Click the theme button (moon icon), verify the page switches between light and dark themes
  2. **Social Media Links Test**: Click at least 2-3 social media links, verify they open in new tabs with correct URLs
  3. **RSS Feed Display Test**: Check that RSS feed sections show either content or "Unable to load feed" (expected in sandboxed environments)
  4. **Responsive Design Test**: Resize browser window to mobile size, verify layout adapts properly
  5. **Header Image Test**: Verify the hero image loads and displays correctly
- **Take screenshots** when making visual changes to document the impact
- **RSS Feeds Note**: In sandboxed/testing environments, RSS feeds from api.rss2json.com will fail due to network restrictions. This is EXPECTED behavior - feeds will work in production environments with internet access.

## Manual Testing Commands

**All commands below have been validated to work:**

```bash
# Start local server (choose one):
python3 -m http.server 8000
# OR
npx http-server . -p 8000

# Test RSS API availability (will fail in sandboxed environments):
curl -I "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffrankysnotes.com%2Ffeeds%2Fposts%2Fdefault%3Falt%3Drss"

# Check file structure:
ls -la
# Expected output:
# CNAME
# README.md  
# favicon.ico
# images/
# index.html
# script.js
# style.css
```

## Repository Structure

```
/
├── .github/
│   └── copilot-instructions.md    # This file
├── images/
│   └── frank_boucher_bonjour-hi.jpg  # Header background image
├── CNAME                          # GitHub Pages domain config
├── README.md                      # Minimal project description
├── favicon.ico                    # Site favicon
├── index.html                     # Main webpage
├── script.js                      # Theme toggle and RSS feed logic
└── style.css                      # Responsive design with CSS variables
```

## Key Components

### Theme System
- **Light/Dark mode toggle** via CSS custom properties
- **Persistent theme** saved to localStorage
- **Auto-detection** of system preference on first visit
- **CSS Variables**: `--primary-text`, `--accent`, `--strip-bg`, `--strip-text`

### RSS Feed Integration
- **Multiple feed sources**: Personal blogs, YouTube channels, playlists
- **External API**: Uses rss2json.com for CORS-enabled RSS parsing
- **Graceful degradation**: Shows "Unable to load feed" when API unavailable
- **Feed types**: Standard RSS (`rss`) and YouTube XML (`yt`)

### Social Media Links
- **Consistent linking** to GitHub, Twitter/X, LinkedIn, Instagram, BlueSky, YouTube
- **Target="_blank"** with `rel="noopener"` for security
- **Icon consistency** using Bootstrap Icons CDN

## Common Development Tasks

### Adding New RSS Feed
1. **Edit script.js** - Add new feed object to `feeds` array:
   ```javascript
   {
       id: 'feed-new-source',
       url: 'https://example.com/feed.xml',
       type: 'rss' // or 'yt' for YouTube
   }
   ```
2. **Edit index.html** - Add corresponding div with matching id:
   ```html
   <div class="rss" id="feed-new-source">Loading...</div>
   ```
3. **Test locally** - Verify feed loads or shows error message gracefully

### Modifying Theme Colors
1. **Edit style.css** - Update CSS custom properties in `:root` and `[data-theme="dark"]`
2. **Test theme toggle** - Verify both light and dark modes look correct
3. **Check contrast** - Ensure text remains readable in both themes

### Updating Social Media Links
1. **Edit index.html** - Update href attributes in both header and footer sections
2. **Maintain consistency** - Ensure same links appear in header social icons and footer text links
3. **Test all links** - Verify they open in new tabs to correct destinations

## Troubleshooting

### RSS Feeds Not Loading
- **Expected in sandboxed environments** - api.rss2json.com may be blocked
- **Check browser console** - Look for CORS or network errors
- **Verify feed URLs** - Test individual RSS/XML sources directly
- **API limits** - rss2json.com has rate limiting for free tier

### Theme Toggle Not Working
- **Check JavaScript console** - Look for errors in theme toggle function
- **Verify localStorage** - Ensure browser supports localStorage
- **CSS variables** - Confirm all theme-related CSS custom properties are defined

### Mobile Layout Issues  
- **Responsive breakpoint** - Main breakpoint at 900px width
- **Flexbox layout** - Uses flex-direction: column on mobile
- **Test at multiple sizes** - Verify layout works from 320px to desktop

## Deployment

- **GitHub Pages ready** - Repository configured for GitHub Pages deployment
- **Custom domain** - CNAME file points to fboucheros.com
- **No build step** - Direct deployment of static files
- **Browser compatibility** - Works in all modern browsers (ES6+ required for theme toggle)

## Performance Notes

- **Instant load time** - No build process, minimal static assets
- **External dependencies**: Bootstrap Icons CDN, rss2json.com API
- **Image optimization** - Hero image should be optimized for web
- **Caching** - RSS feeds cached by api.rss2json.com, theme preference cached in localStorage