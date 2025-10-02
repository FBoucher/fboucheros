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

// Language toggle functionality
function switchLanguage(lang) {
    // Hide all language content
    document.querySelectorAll('.lang-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected language content
    document.querySelectorAll(`.lang-${lang}`).forEach(el => {
        el.classList.add('active');
    });
    
    // Update active button state
    document.querySelectorAll('.language-toggle button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchLanguage('${lang}')"]`).classList.add('active');
    
    // Save preference
    localStorage.setItem('bioLanguage', lang);
}

// Initialize language on page load
(function() {
    const lang = localStorage.getItem('bioLanguage') || 'en';
    switchLanguage(lang);
})();

// Download photo functionality
function downloadPhoto() {
    const link = document.createElement('a');
    link.href = './images/frank_boucher_bonjour-hi.jpg';
    link.download = 'frank_boucher_photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
