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
        url: 'https://frankysnotes.com/feeds/posts/default?alt=rss', 
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
        id: 'feed-yt-playlist',
        url: 'https://www.youtube.com/feeds/videos.xml?playlist_id=PL4NfFPd0l1UYpeQxjGdmKjNRoXru2u1TI', 
        type: 'yt' 
    },
    {
        id: 'feed-yt-playlist-fr',
        url: 'https://www.youtube.com/feeds/videos.xml?playlist_id=PLl0dy42acVd_vwIUN2y3LvDq8VOUIj6Dk', 
        type: 'yt' 
    }
];

// YouTube thumbnail helper function
function getYouTubeThumbnail(link) {
    // Extract video ID from YouTube link
    const match = link.match(/[?&]v=([^&]+)/);
    if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    
    // For youtu.be short links
    const short = link.match(/youtu\.be\/([^?&]+)/);
    if (short && short[1]) {
        return `https://img.youtube.com/vi/${short[1]}/mqdefault.jpg`;
    }
    
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

// Create feed item HTML
function createFeedItem(item, type) {
    if (type === 'yt') {
        const thumb = getYouTubeThumbnail(item.link);
        return `
            <div style="margin-bottom: 0.7em; display: flex; align-items: center; gap: 0.7em;">
                ${thumb ? `<a href="${item.link}" target="_blank" rel="noopener">
                    <img src="${thumb}" alt="Video thumbnail" 
                         style="width: 70px; height: 40px; object-fit: cover; border-radius: 4px;">
                </a>` : ''}
                <div>
                    <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
                    <br>
                    <span style="font-size: 0.85em; color: gray;">${formatDate(item.pubDate)}</span>
                </div>
            </div>
        `;
    } else {
        return `
            <div style="margin-bottom: 0.7em;">
                <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
                <br>
                <span style="font-size: 0.85em; color: gray;">${formatDate(item.pubDate)}</span>
            </div>
        `;
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
