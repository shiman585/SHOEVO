 // Initialize animations when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        const loadingElement = document.getElementById('loading');
        const categorySections = document.querySelectorAll('.category-section');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // Hide loading animation after page load
        setTimeout(() => {
            loadingElement.style.display = 'none';
            
            // Animate category sections
            categorySections.forEach(section => {
                section.classList.add('visible');
            });
            
            // Animate gallery items with staggered delay
            galleryItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, 100 + (index * 100)); // Stagger the animation
            });
        }, 1500); // Simulate loading time
        
        // Lightbox functionality
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const closeLightbox = document.getElementById('closeLightbox');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('.gallery-img').src;
                lightboxImg.src = imgSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeLightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Close lightbox when clicking outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.backgroundColor = '#f8f8f8';
                    btn.style.color = '#333';
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                this.style.backgroundColor = '#d4af37';
                this.style.color = 'white';
                
                const filter = this.getAttribute('data-filter');
                
                categorySections.forEach(section => {
                    if (filter === 'all') {
                        section.style.display = 'block';
                        // Animate visible sections
                        setTimeout(() => {
                            section.classList.add('visible');
                        }, 50);
                    } else {
                        if (section.getAttribute('data-category') === filter) {
                            section.style.display = 'block';
                            // Animate visible sections
                            setTimeout(() => {
                                section.classList.add('visible');
                            }, 50);
                        } else {
                            section.classList.remove('visible');
                            setTimeout(() => {
                                section.style.display = 'none';
                            }, 500);
                        }
                    }
                });
                
                // Animate gallery items when filtering
                const visibleItems = document.querySelectorAll('.gallery-item');
                visibleItems.forEach((item, index) => {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100 + (index * 100));
                });
            });
        });
        
        // Initialize button colors
        filterButtons.forEach(button => {
            if (button.classList.contains('active')) {
                button.style.backgroundColor = '#d4af37';
                button.style.color = 'white';
            } else {
                button.style.backgroundColor = '#f8f8f8';
                button.style.color = '#333';
            }
            
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('active')) {
                    button.style.background = '#e6e6e6';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('active')) {
                    button.style.background = '#f8f8f8';
                }
            });
        });
    });