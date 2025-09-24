  // Initialize AOS animation
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false
        });

        // Accordion functionality
        document.querySelectorAll('.policy-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('i');
                
                // Toggle content
                content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
                
                // Toggle icon
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
                
                // Toggle active class
                header.parentElement.classList.toggle('active');
            });
        });
      