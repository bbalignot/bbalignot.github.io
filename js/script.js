```javascript
// ===========================
// DATA MANAGEMENT
// ===========================

let articlesData = [];
let photosData = [];
let videosData = [];
let currentLightboxIndex = 0;

// Initialize data from localStorage
function initializeData() {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
        const data = JSON.parse(saved);
        articlesData = data.articles || [];
        photosData = data.photos || [];
        videosData = data.videos || [];
    }
}

function saveData() {
    const data = {
        articles: articlesData,
        photos: photosData,
        videos: videosData
    };
    localStorage.setItem('portfolioData', JSON.stringify(data));
}

// ===========================
// ARTICLES FUNCTIONS
// ===========================

function loadArticles() {
    initializeData();
    const container = document.getElementById('articles-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (articlesData.length === 0) {
        container.innerHTML = '<p class="no-items">No articles added yet. Add your first article below.</p>';
        return;
    }
    
    articlesData.forEach((article, index) => {
        const card = createArticleCard(article, index);
        container.appendChild(card);
    });
}

function createArticleCard(article, index) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="article-card-content">
            <h3>${escapeHtml(article.title)}</h3>
            <div class="article-meta">
                <span class="article-outlet">${escapeHtml(article.outlet)}</span>
                <span>${formattedDate}</span>
            </div>
            ${article.description ? `<p class="article-description">${escapeHtml(article.description)}</p>` : ''}
            <a href="${escapeHtml(article.url)}" target="_blank" class="article-link">Read Full Article →</a>
            <button onclick="deleteArticle(${index})" class="delete-btn">Delete</button>
        </div>
    `;
    
    return card;
}

function setupArticleForm() {
    const form = document.getElementById('articleForm');
    if (!form) return;
    
    initializeData();
    loadArticles();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const article = {
            title: document.getElementById('articleTitle').value,
            outlet: document.getElementById('articleOutlet').value,
            date: document.getElementById('articleDate').value,
            url: document.getElementById('articleURL').value,
            description: document.getElementById('articleDescription').value
        };
        
        articlesData.push(article);
        saveData();
        
        form.reset();
        loadArticles();
        alert('Article added successfully!');
    });
}

function deleteArticle(index) {
    if (confirm('Delete this article?')) {
        articlesData.splice(index, 1);
        saveData();
        loadArticles();
    }
}

function loadFeaturedArticles() {
    initializeData();
    const container = document.getElementById('featured-articles');
    if (!container) return;
    
    const featured = articlesData.slice(0, 3);
    container.innerHTML = '';
    
    featured.forEach(article => {
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
        
        const item = document.createElement('div');
        item.className = 'featured-item';
        item.innerHTML = `
            <div style="background-color: #ecf0f1; height: 200px; display: flex; align-items: center; justify-content: center; color: #7f8c8d;">
                <span>Article</span>
            </div>
            <div class="featured-item-content">
                <h3>${escapeHtml(article.title)}</h3>
                <p>${escapeHtml(article.outlet)}</p>
                <div class="meta">${formattedDate}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// ===========================
// PHOTO GALLERY FUNCTIONS
// ===========================

function loadGallery() {
    initializeData();
    const container = document.getElementById('gallery-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (photosData.length === 0) {
        container.innerHTML = '<p class="no-items">No photos added yet. Start by uploading your first photo.</p>';
        return;
    }
    
    photosData.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${escapeHtml(photo.thumbnail)}" alt="${escapeHtml(photo.title)}" onclick="openLightbox(${index})">
            <div class="gallery-item-overlay">
                <h4>${escapeHtml(photo.title)}</h4>
                <p>${escapeHtml(photo.caption)}</p>
            </div>
        `;
        container.appendChild(item);
    });
    
    setupGalleryFilters();
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const photo = photosData[index];
    const lightbox = document.getElementById('lightbox');
    
    document.getElementById('lightbox-image').src = escapeHtml(photo.full);
    document.getElementById('lightbox-title').textContent = escapeHtml(photo.title);
    document.getElementById('lightbox-caption').textContent = escapeHtml(photo.caption);
    
    const meta = photo.location || '';
    document.getElementById('lightbox-meta').textContent = meta;
    
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

function nextPhoto() {
    currentLightboxIndex = (currentLightboxIndex + 1) % photosData.length;
    openLightbox(currentLightboxIndex);
}

function prevPhoto() {
    currentLightboxIndex = (currentLightboxIndex - 1 + photosData.length) % photosData.length;
    openLightbox(currentLightboxIndex);
}

function setupGalleryFilters() {
    const closeBtn = document.querySelector('.lightbox-close');
    const nextBtn = document.querySelector('.lightbox-next');
    const prevBtn = document.querySelector('.lightbox-prev');
    
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', nextPhoto);
    if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
}

function loadFeaturedPhotos() {
    initializeData();
    const container = document.getElementById('featured-photos');
    if (!container) return;
    
    const featured = photosData.slice(0, 3);
    container.innerHTML = '';
    
    featured.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'featured-item';
        item.innerHTML = `
            <img src="${escapeHtml(photo.thumbnail)}" alt="${escapeHtml(photo.title)}" style="cursor: pointer;" onclick="openLightbox(${index})">
            <div class="featured-item-content">
                <h3>${escapeHtml(photo.title)}</h3>
                <p>${escapeHtml(photo.caption)}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

// ===========================
// VIDEO FUNCTIONS
// ===========================

function loadVideos() {
    initializeData();
    const container = document.getElementById('videos-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (videosData.length === 0) {
        container.innerHTML = '<p class="no-items">No videos added yet. Add your first video below.</p>';
        return;
    }
    
    videosData.forEach((video, index) => {
        const card = createVideoCard(video, index);
        container.appendChild(card);
    });
}

function createVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'video-card';
    
    let embedCode = '';
    
    switch(video.source) {
        case 'vimeo':
            embedCode = `<iframe src="https://player.vimeo.com/video/${video.id}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
            break;
        case 'youtube':
            embedCode = `<iframe src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>`;
            break;
        case 'googledrive':
            embedCode = `<iframe src="https://drive.google.com/file/d/${video.id}/preview" frameborder="0" allowfullscreen></iframe>`;
            break;
        case 'other':
            embedCode = video.id;
            break;
    }
    
    card.innerHTML = `
        <div class="video-embed-container">
            ${embedCode}
        </div>
        <div class="video-card-content">
            <h3>${escapeHtml(video.title)}</h3>
            ${video.description ? `<p>${escapeHtml(video.description)}</p>` : ''}
            <button onclick="deleteVideo(${index})" class="delete-btn">Delete</button>
        </div>
    `;
    
    return card;
}

function setupVideoForm() {
    const form = document.getElementById('videoForm');
    if (!form) return;
    
    initializeData();
    loadVideos();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const video = {
            title: document.getElementById('videoTitle').value,
            source: document.getElementById('videoSource').value,
            id: document.getElementById('videoID').value,
            description: document.getElementById('videoDescription').value
        };
        
        videosData.push(video);
        saveData();
        
        form.reset();
        loadVideos();
        alert('Video added successfully!');
    });
}

function deleteVideo(index) {
    if (confirm('Delete this video?')) {
        videosData.splice(index, 1);
        saveData();
        loadVideos();
    }
}

function loadFeaturedVideos() {
    initializeData();
    const container = document.getElementById('featured-videos');
    if (!container) return;
    
    const featured = videosData.slice(0, 3);
    container.innerHTML = '';
    
    featured.forEach((video, index) => {
        const item = document.createElement('div');
        item.className = 'featured-item';
        
        let thumbnail = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%23fff"%3EVideo%3C/text%3E%3C/svg%3E';
        
        item.innerHTML = `
            <img src="${thumbnail}" alt="${escapeHtml(video.title)}" style="height: 200px; object-fit: cover;">
            <div class="featured-item-content">
                <h3>${escapeHtml(video.title)}</h3>
                <p>${escapeHtml(video.description.substring(0, 80))}...</p>
            </div>
        `;
        container.appendChild(item);
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Mobile menu toggle (optional)
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
});
```
