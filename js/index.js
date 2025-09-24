// Fix browser scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}





// HERO SLIDER START
document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevArrow = document.querySelector('.slider-arrow.left');
  const nextArrow = document.querySelector('.slider-arrow.right');

  let currentIndex = 0;
  const slideCount = slides.length;
  let slideInterval;

  function goToSlide(index) {
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;

    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    currentIndex = index;

    resetInterval();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startInterval() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  function initSlider() {
    if (!slider) return;

    nextArrow?.addEventListener('click', nextSlide);
    prevArrow?.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    startInterval();

    slider.parentElement?.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });

    slider.parentElement?.addEventListener('mouseleave', () => {
      startInterval();
    });
  }

  initSlider();
});
// HERO SLIDER END



// AOS ANIMATION START
// GLOBAL ENHANCEMENTS
document.addEventListener('DOMContentLoaded', function () {
  // AOS init
 AOS.init({
  startEvent: 'DOMContentLoaded',
  once: false,               // animation bar bar repeat hogi
  offset: 120,
  disableMutationObserver: true
});


  // Fix scroll jump after AOS loads
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, 100);

  // Prevent anchor href="#" scroll
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });
});
// AOS ANIMATION END



 // TOP PICK SECTION START
 // TOP PICK SECTION START
const products = {
  men: [
    { name: "Nike Air Max", price: "£120", image: "PRODUCTS/MP/loafers06.png" },
    { name: "Adidas Run Falcon", price: "£95", image: "PRODUCTS/MP/sneaker01.jpg" },
    { name: "Puma Classic", price: "£80", image: "PRODUCTS/MP/formalshoes8.jpg" },
    { name: "adidas Trefoil Tracksuit Children", price: "£35", image: "PRODUCTS/MP/sneaker07.jpg" }
  ],
  kids: [
    { name: "Nike Dunk Low Children", price: "£60", image: "PRODUCTS/KP/boots09.jpg" },
    { name: "adidas Originals Handball Spezial Junior", price: "£70", image: "PRODUCTS/KP/boots10.jpg" },
    { name: "MONTIREX Girls’ Trail Box T-Shirt Junior", price: "£23", image: "PRODUCTS/KP/boots06.jpg" },
    { name: "adidas Trefoil Tracksuit Children", price: "£35", image: "PRODUCTS/KP/boots07.jpg" }
  ],
  women: [
    { name: "Reebok Classic", price: "£70", image: "PRODUCTS/WP/heel07.jpg" },
    { name: "Puma Cali Bold", price: "£85", image: "PRODUCTS/WP/flats02.jpg" },
    { name: "Adidas Originals", price: "£90", image: "PRODUCTS/WP/flats03.jpg" },
    { name: "adidas Trefoil Tracksuit Children", price: "£35", image: "PRODUCTS/WP/flats04.jpg" }
  ],
};

const buttons = document.querySelectorAll(".cat-btns button");
const productGrid = document.getElementById("productGrid");

// Category specific See All links
const categoryLinks = {
  men: "mensec.html",
  kids: "kids.html",
  women: "women.html"
};

function showCategory(category) {
  // Update active button
  buttons.forEach(btn => btn.classList.remove("active"));
  document.getElementById(`${category}Btn`).classList.add("active");

  // Clear old items
  productGrid.innerHTML = "";

  // Load new products
  products[category].forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="price">${item.price}</div>
      <div class="title">${item.name}</div>
      <a href="${categoryLinks[category]}" class="add-to-cart-btn">
        <i class="fas fa-shopping-cart"></i> See All
      </a>
    `;
    productGrid.appendChild(card);
        // Smooth fade-in
        setTimeout(() => card.classList.add("loaded"), 50 * i);
      });
    }

    // Default load
    showCategory('kids');
  // TOP PICK SECTION END



// <!-- REEL VIDEO SECTION START-->
 // JavaScript to ensure perfect seamless looping
        document.addEventListener('DOMContentLoaded', function() {
            const track = document.querySelector('.marquee-track');
            const content = track.innerHTML;
            track.innerHTML = content + content; // Double the content for smoother looping
        });
// <!-- REEL VIDEO SECTION END -->



// FOOTER SECTION START
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            // Here you would typically send the email to your server
            alert('Thank you for subscribing!');
            emailInput.value = '';
        });
    }
    // FOOTER SECTION END