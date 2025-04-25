// News updater functionality
class NewsUpdater {
    constructor() {
        this.initializeEventListeners();
        console.log('NewsUpdater initialized');
    }

    loadNews() {
        // Get news from the main page if available
        const mainNewsContainer = document.querySelector('#news .news-container');
        if (mainNewsContainer) {
            this.displayNewsInCMS(mainNewsContainer);
        }
    }

    displayNewsInCMS(mainNewsContainer) {
        const cmsNewsList = document.querySelector('.news-list');
        if (!cmsNewsList) return;

        const newsCards = mainNewsContainer.querySelectorAll('.news-card');
        if (!newsCards || newsCards.length === 0) {
            cmsNewsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-newspaper"></i>
                    <p>No news items found</p>
                </div>
            `;
            return;
        }

        // Clone the news cards for the CMS view and add edit buttons
        cmsNewsList.innerHTML = Array.from(newsCards).map((card, index) => `
            <div class="news-card" data-id="${index}">
                <div class="news-image">
                    <img src="${card.querySelector('.news-image img').src}" alt="${card.querySelector('.news-image img').alt}">
                </div>
                <div class="news-content">
                    <span class="news-date">${card.querySelector('.news-date').textContent}</span>
                    <h3>${card.querySelector('h3').textContent}</h3>
                    <p>${card.querySelector('p').textContent}</p>
                    <div class="news-actions">
                        <button class="btn secondary-btn" onclick="newsUpdater.openEditModal(${index})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openEditModal(index) {
        const newsCards = document.querySelectorAll('#news .news-container .news-card');
        const card = newsCards[index];
        if (!card) {
            console.error('News card not found at index:', index);
            return;
        }

        const modal = document.getElementById('editNewsModal');
        if (!modal) {
            console.error('Modal element not found');
            return;
        }

        // Populate form fields
        document.getElementById('editNewsTitle').value = card.querySelector('h3').textContent;
        document.getElementById('editNewsDate').value = this.formatDateForInput(card.querySelector('.news-date').textContent);
        document.getElementById('editNewsContent').value = card.querySelector('p').textContent;
        document.getElementById('editNewsImage').value = card.querySelector('.news-image img').src;

        // Store the current edit index
        modal.dataset.editIndex = index;

        // Show modal
        modal.style.display = 'block';
    }

    closeEditModal() {
        const modal = document.getElementById('editNewsModal');
        if (modal) {
            modal.style.display = 'none';
            delete modal.dataset.editIndex;
            document.getElementById('editNewsForm').reset();
        }
    }

    updateArticle(index, updatedArticle) {
        // Update in main page
        const mainNewsCards = document.querySelectorAll('#news .news-container .news-card');
        const mainCard = mainNewsCards[index];
        
        // Update in CMS
        const cmsNewsCards = document.querySelectorAll('.news-list .news-card');
        const cmsCard = cmsNewsCards[index];

        if (mainCard && cmsCard) {
            // Update main page card
            mainCard.querySelector('h3').textContent = updatedArticle.title;
            mainCard.querySelector('.news-date').textContent = updatedArticle.date;
            mainCard.querySelector('p').textContent = updatedArticle.excerpt;
            mainCard.querySelector('.news-image img').src = updatedArticle.image;
            mainCard.querySelector('.news-image img').alt = updatedArticle.title;
            
            // Update CMS card
            cmsCard.querySelector('h3').textContent = updatedArticle.title;
            cmsCard.querySelector('.news-date').textContent = updatedArticle.date;
            cmsCard.querySelector('p').textContent = updatedArticle.excerpt;
            cmsCard.querySelector('.news-image img').src = updatedArticle.image;
            cmsCard.querySelector('.news-image img').alt = updatedArticle.title;

            // Update the article page link
            const filename = updatedArticle.title.toLowerCase().replace(/\s+/g, '-');
            const readMoreLink = mainCard.querySelector('.read-more');
            if (readMoreLink) {
                readMoreLink.href = `news/${filename}.html`;
            }

            this.showNotification('Changes saved successfully!', 'success');
            return true;
        }

        this.showNotification('Failed to update news item', 'error');
        return false;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    formatDateForInput(dateString) {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    }

    initializeEventListeners() {
        // Handle form submission
        const editForm = document.getElementById('editNewsForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const modal = document.getElementById('editNewsModal');
                const index = parseInt(modal.dataset.editIndex);
                
                if (isNaN(index)) return;

                const updatedArticle = {
                    title: document.getElementById('editNewsTitle').value,
                    date: document.getElementById('editNewsDate').value,
                    excerpt: document.getElementById('editNewsContent').value,
                    image: document.getElementById('editNewsImage').value
                };

                if (this.updateArticle(index, updatedArticle)) {
                    this.closeEditModal();
                }
            });
        }

        // Close modal when clicking outside
        window.onclick = (event) => {
            const modal = document.getElementById('editNewsModal');
            if (event.target === modal) {
                this.closeEditModal();
            }
        };

        // Close modal when clicking cancel button
        const cancelButton = document.querySelector('#editNewsModal .btn.secondary-btn');
        if (cancelButton) {
            cancelButton.onclick = () => this.closeEditModal();
        }

        // Load news when switching to news section
        const newsTab = document.querySelector('a[href="#news"]');
        if (newsTab) {
            newsTab.addEventListener('click', () => {
                this.loadNews();
            });
        }
    }
}

// Initialize NewsUpdater
    const newsUpdater = new NewsUpdater();

// Load news when the page is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the news section
    if (window.location.hash === '#news') {
        newsUpdater.loadNews();
    }
}); 