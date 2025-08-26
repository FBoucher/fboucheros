// Theme toggle functionality
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

// Initialize theme on page load
(function() {
    const theme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();

// RSS Feed configuration
const feeds = [
    { 
        id: 'feed-blog', 
        url: 'https://frankysnotes.com/feeds/posts/default', 
        type: 'rss' 
    },
    { 
        id: 'feed-cloud', 
        url: 'https://www.cloudenfrancais.com/feed.rss', 
        type: 'rss' 
    },
    { 
        id: 'feed-yt-fboucheros', 
        url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCAr20GBQayL-nFPWFnUHNAA', 
        type: 'yt' 
    },
    { 
        id: 'feed-yt-cloud', 
        url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UChFOuhUf12hIVEdcnaSUNzA', 
        type: 'yt' 
    },
    {
        id: 'feed-yt-behindmycloud',
        url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCzX9-dTqz-kG5q1-uys_NGw', 
        type: 'yt' 
    },
    {
        id: 'feed-yt-external-playlist',
        url: 'https://www.youtube.com/feeds/videos.xml?playlist_id=PL4NfFPd0l1UYpeQxjGdmKjNRoXru2u1TI', 
        type: 'yt' 
    },
    {
        id: 'feed-yt-external-playlist-fr',
        url: 'https://www.youtube.com/feeds/videos.xml?playlist_id=PLl0dy42acVd_vwIUN2y3LvDq8VOUIj6Dk', 
        type: 'yt' 
    }
];

// YouTube thumbnail helper function with fallbacks
function getYouTubeThumbnail(link) {
    let videoId = null;
    
    // Extract video ID from YouTube link
    const match = link.match(/[?&]v=([^&]+)/);
    if (match && match[1]) {
        videoId = match[1];
    }
    
    // For youtu.be short links
    const short = link.match(/youtu\.be\/([^?&]+)/);
    if (short && short[1]) {
        videoId = short[1];
    }
    
    // For YouTube Shorts URLs (e.g., youtube.com/shorts/videoId)
    const shorts = link.match(/\/shorts\/([^?&]+)/);
    if (shorts && shorts[1]) {
        videoId = shorts[1];
    }
    
    if (!videoId) {
        return null;
    }
    
    // Return high quality thumbnail - works for both regular videos and Shorts
    // YouTube generates thumbnails for all videos including Shorts
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Function to create thumbnail with fallback handling
function createYouTubeThumbnailElement(videoId, link) {
    const thumbnailQualities = [
        'hqdefault.jpg',    // High quality (480x360)
        'mqdefault.jpg',    // Medium quality (320x180)
        'default.jpg'       // Default quality (120x90)
    ];
    
    let currentQuality = 0;
    
    function tryNextThumbnail(img) {
        if (currentQuality < thumbnailQualities.length - 1) {
            currentQuality++;
            img.src = `https://img.youtube.com/vi/${videoId}/${thumbnailQualities[currentQuality]}`;
        }
    }
    
    const img = document.createElement('img');
    img.src = `https://img.youtube.com/vi/${videoId}/${thumbnailQualities[0]}`;
    img.alt = 'Video thumbnail';
    img.style.width = '70px';
    img.style.height = '40px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '4px';
    img.onerror = () => tryNextThumbnail(img);
    
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener';
    linkElement.appendChild(img);
    
    return linkElement;
}

// Extract thumbnail from RSS content
function getRSSContentThumbnail(item) {
    // Try to get thumbnail from various RSS/Atom fields
    if (item.thumbnail && item.thumbnail.trim()) {
        return makeAbsoluteUrl(item.thumbnail);
    }
    
    // Check for Atom-style media thumbnail
    if (item['media:thumbnail'] && item['media:thumbnail'].url) {
        return makeAbsoluteUrl(item['media:thumbnail'].url);
    }
    
    // Check for media:content (common in Atom feeds)
    if (item['media:content'] && item['media:content'].url && item['media:content'].type && item['media:content'].type.startsWith('image/')) {
        return makeAbsoluteUrl(item['media:content'].url);
    }
    
    // Try to extract image from content/description first (more relevant than enclosure)
    const content = item.content || item.description || '';
    const imgMatch = content.match(/<img[^>]+src=['"]([^'"]+)['"][^>]*>/i);
    if (imgMatch && imgMatch[1]) {
        const imgUrl = makeAbsoluteUrl(imgMatch[1]);
        // Skip very small images (likely icons) and prefer larger content images
        if (imgUrl && !imgUrl.includes('icon') && !imgUrl.includes('logo') && !imgUrl.endsWith('logo3.png')) {
            return imgUrl;
        }
    }
    
    // Check for enclosure (RSS style) - use as fallback
    if (item.enclosure && item.enclosure.link) {
        // Check if it's an image enclosure or if type indicates image
        if (!item.enclosure.type || item.enclosure.type.startsWith('image/')) {
            const enclosureUrl = makeAbsoluteUrl(item.enclosure.link);
            // Only use enclosure if it's clearly an image or we have no other options
            if (enclosureUrl && (enclosureUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) || item.enclosure.type)) {
                return enclosureUrl;
            }
        }
    }
    
    // Look for WordPress featured image pattern (often in Atom feeds)
    const wpFeaturedMatch = content.match(/wp-content\/uploads\/[^'">\s]+\.(jpg|jpeg|png|gif|webp)/i);
    if (wpFeaturedMatch && wpFeaturedMatch[0]) {
        return makeAbsoluteUrl(wpFeaturedMatch[0]);
    }
    
    // Look for any /content/images/ pattern (specific to Cloud en Français)
    const contentImageMatch = content.match(/\/content\/images\/[^'">\s]+\.(jpg|jpeg|png|gif|webp)/i);
    if (contentImageMatch && contentImageMatch[0]) {
        return makeAbsoluteUrl(contentImageMatch[0]);
    }
    
    // Return null if no image found (no placeholder)
    return null;
}

// Format date helper function
function formatDate(dateString) {
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (error) {
        return 'Date unavailable';
    }
}

// Helper function to convert relative URLs to absolute URLs
function makeAbsoluteUrl(url, baseUrl = 'https://www.cloudenfrancais.com') {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${baseUrl}${url}`;
    return url;
}

// Create feed item HTML
function createFeedItem(item, type) {
    // Convert relative URLs to absolute URLs for Cloud en Français feed
    const absoluteLink = makeAbsoluteUrl(item.link);
    
    if (type === 'yt') {
        const thumb = getYouTubeThumbnail(absoluteLink);
        
        // Extract video ID for advanced thumbnail handling
        let videoId = null;
        const matchVideo = absoluteLink.match(/[?&]v=([^&]+)/);
        const matchShort = absoluteLink.match(/youtu\.be\/([^?&]+)/);
        const matchShorts = absoluteLink.match(/\/shorts\/([^?&]+)/);
        
        if (matchVideo && matchVideo[1]) {
            videoId = matchVideo[1];
        } else if (matchShort && matchShort[1]) {
            videoId = matchShort[1];
        } else if (matchShorts && matchShorts[1]) {
            videoId = matchShorts[1];
        }
        
        return `
            <div style="margin-bottom: 0.7em; display: flex; align-items: center; gap: 0.7em;">
                ${thumb ? `<a href="${absoluteLink}" target="_blank" rel="noopener">
                    <img src="${thumb}" alt="Video thumbnail" 
                         style="width: 70px; height: 40px; object-fit: cover; border-radius: 4px;"
                         onerror="this.src='https://img.youtube.com/vi/${videoId}/mqdefault.jpg'; this.onerror=function(){this.src='https://img.youtube.com/vi/${videoId}/default.jpg';};">
                </a>` : ''}
                <div>
                    <a href="${absoluteLink}" target="_blank" rel="noopener">${item.title}</a>
                    <br>
                    <span style="font-size: 0.85em; color: gray;">${formatDate(item.pubDate)}</span>
                </div>
            </div>
        `;
    } else {
        const thumb = getRSSContentThumbnail(item);
        if (thumb) {
            return `
                <div style="margin-bottom: 0.7em; display: flex; align-items: center; gap: 0.7em;">
                    <a href="${absoluteLink}" target="_blank" rel="noopener">
                        <img src="${thumb}" alt="Blog post thumbnail" 
                             style="width: 70px; height: 40px; object-fit: cover; border-radius: 4px;"
                             onerror="this.style.display='none'; this.parentNode.style.display='none';">
                    </a>
                    <div>
                        <a href="${absoluteLink}" target="_blank" rel="noopener">${item.title}</a>
                        <br>
                        <span style="font-size: 0.85em; color: gray;">${formatDate(item.pubDate)}</span>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="margin-bottom: 0.7em;">
                    <a href="${absoluteLink}" target="_blank" rel="noopener">${item.title}</a>
                    <br>
                    <span style="font-size: 0.85em; color: gray;">${formatDate(item.pubDate)}</span>
                </div>
            `;
        }
    }
}

// Load and display RSS feeds
function loadFeeds() {
    feeds.forEach(feed => {
        const feedElement = document.getElementById(feed.id);
        
        if (!feedElement) {
            console.warn(`Feed element with id '${feed.id}' not found`);
            return;
        }

        // Show loading state
        feedElement.innerHTML = '<em>Loading...</em>';

        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.items || data.items.length === 0) {
                    feedElement.innerHTML = '<em>No recent posts found.</em>';
                    return;
                }

                // Show only the 3 most recent items
                const recentItems = data.items.slice(0, 3);
                feedElement.innerHTML = recentItems
                    .map(item => createFeedItem(item, feed.type))
                    .join('');
            })
            .catch(error => {
                console.error(`Error loading feed ${feed.id}:`, error);
                feedElement.innerHTML = '<em>Unable to load feed.</em>';
            });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadFeeds);
