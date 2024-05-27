document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');

  function populateCarousel(products) {
    products.forEach((product) => {
      const item = document.createElement('div');
      item.classList.add('carousel-item');
      item.innerHTML = `
        <span class="span_carousel_img" style="width: 205px; height: 256.25px; display: flex; justify-content: center; align-content: center;">
          <img class="carousel_prod_img" loading="lazy" src="${product.image}" alt="${product.title}">
        </span>
        <div style="width: 205px; height: 138px">
          <strong class="carousel_prod_title">${product.title}</strong>
          <p class="carousel_prod_descr">${product.description}</p>
          <strong style="font-size: 19px; font-weight: 700;">S/ ${Number(product.price).toFixed(2)}</strong>
        </div>
        <button type="button" title="Añadir al carro" class="product-addtocart-button">
          <span>Añadir al carro</span>
        </button>
      `;
      carousel.appendChild(item);
    });
    
    require(['jquery', 'slick'], function ($) {
      $(document).ready(function () {
        const initializeSlick = () => {
          $(carousel).slick({
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            adaptiveHeight: false,
            mobileFirst: false,
            appendArrows: $('.arrows_div'),
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  arrows: false,
                  dots: true,
                  appendDots: $('.dots-container'),
                }
              },
            ]
          });

          $('#prevBtn').on('click', function () {
            $('.slick-prev').trigger('click');
          });

          $('#nextBtn').on('click', function () {
            $('.slick-next').trigger('click');
          });
        };

        initializeSlick();

        let resizeTimeout;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            $(carousel).slick('unslick');
            initializeSlick();
          }, 200);
        });
      });
    });
  }

  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => populateCarousel(data))
    .catch(error => console.error('Error fetching products:', error));
});
