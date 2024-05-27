document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');
  // const prevBtn = document.getElementById('prevBtn');
  // const nextBtn = document.getElementById('nextBtn');
  // const dotsContainer = document.querySelector('.dots-container');

  // let currentIndex = 0;
  // const itemMaxWidth = 248;
  // const transitionTime = 0.5;

  // function createDots(itemsCount) {
  //   dotsContainer.innerHTML = '';
  //   for (let i = 0; i < itemsCount; i++) {
  //     const dot = document.createElement('div');
  //     dot.classList.add('desactive-dot-carousel');
  //     if (i === 0) dot.classList.add('active-dot-carousel');
  //     dot.addEventListener('click', () => moveToIndex(i, window.innerWidth <= 1024));
  //     dotsContainer.appendChild(dot);
  //   }
  // }

  // function updateDots() {
  //   const dots = Array.from(dotsContainer.children);
  //   dots.forEach((dot, index) => {
  //     if (!isNaN(currentIndex)) dot.classList.toggle('active-dot-carousel', index === currentIndex);
  //   });
  // }

  // function updateCarousel(isMobile = false) {
  //   carousel.style.transition = `transform ${transitionTime}s ease 0s`;
  //   const items = Array.from(carousel.children);
  //   const lengthItems = items.length;

  //   items.forEach((item, index) => {
  //     const cur = ((index - currentIndex + lengthItems) % lengthItems);
  //     item.style.marginLeft = cur === 0 ? "1px" : "0px";
  //     // item.style.transform = `translateX(0px)`;
  //     // if ((lengthItems - 1) === cur && !isMobile) {
  //     //   item.style.transform = `translateX(-${lengthItems}00%)`;
  //     // }
  //     // if ((lengthItems - 2) === cur && !isMobile) {
  //     //   item.style.transform = `translateX(-${lengthItems}05%)`;
  //     // }
  //     // if ((lengthItems - 3) === cur && !isMobile) {
  //     //   item.style.transform = `translateX(-${lengthItems}10%)`;
  //     // }
  //     // if ((lengthItems - 4) === cur && !isMobile) {
  //     //   item.style.transform = `translateX(-${lengthItems}15%)`;
  //     // }
  //     // if (!isMobile) item.style.order = cur;
  //   });

  //   if (isMobile) {
  //     setTimeout(() => {
  //       carousel.style.transition = 'none';
  //       carousel.style.transform = 'translateX(0px)';
  //     }, 500);
  //     return;
  //   }
  //   carousel.style.transition = 'none';
  //   carousel.style.transform = 'translateX(0px)';
  // }

  // function moveToIndex(index, isMobile = false) {
  //   const itemsCount = carousel.children.length;
  //   const direction = index > currentIndex ? 1 : -1;

  //   carousel.style.transition = `transform ${transitionTime}s ease 0s`;
  //   if (!isMobile) carousel.style.transform = `translateX(${-direction * itemMaxWidth}px)`;

  //   if (!isMobile) {
  //     setTimeout(() => {
  //       currentIndex = (index + itemsCount) % itemsCount;
  //       updateCarousel(isMobile);
  //       updateDots();
  //     }, transitionTime * 1500);
  //     return;
  //   }
  //   currentIndex = (index + itemsCount) % itemsCount;
  //   updateCarousel(isMobile);
  //   updateDots();
  // }

  // nextBtn.addEventListener('click', () => {
  //   moveToIndex(currentIndex + 1);
  // });

  // prevBtn.addEventListener('click', () => {
  //   moveToIndex(currentIndex - 1);
  // });

  // let startX = 0;
  // let currentTranslate = 0;
  // let prevTranslate = 0;
  // let animationID = 0;

  // const setPositionByIndex = (idx) => {
  //   currentTranslate = 0;
  //   setSliderPosition(true, idx > 0 ? itemMaxWidth : itemMaxWidth * -1);
  // };

  // const touchStart = (index) => (event) => {
  //   startX = getPositionX(event);
  //   animationID = requestAnimationFrame(animation);
  //   carousel.addEventListener('touchmove', touchMove(index));
  //   carousel.addEventListener('touchend', touchEnd);
  // };

  // const touchMove = (_) => (event) => {
  //   const currentPosition = getPositionX(event);
  //   currentTranslate = prevTranslate + currentPosition - startX;
  // };

  // const touchEnd = () => {
  //   animationID = 0;
  //   const movedBy = currentTranslate - prevTranslate;
  //   let idx;

  //   if (movedBy < -150) {
  //     idx = currentIndex + 1;
  //     moveToIndex(idx, true);
  //     setPositionByIndex(idx);
  //   }

  //   if (movedBy > 150) {
  //     idx = currentIndex - 1;
  //     moveToIndex(idx, true);
  //     setPositionByIndex(idx);
  //   }
  //   if ((movedBy > 0 && movedBy < 150) || (movedBy < 0 && movedBy > -150)) setPositionByIndex();

  //   carousel.removeEventListener('touchmove', touchMove);
  //   carousel.removeEventListener('touchend', touchEnd);
  //   cancelAnimationFrame(animationID);
  // };

  // const getPositionX = (event) => {
  //   return event.touches[0].clientX;
  // };

  // const animation = () => {
  //   setSliderPosition();
  //   if (window.innerWidth <= 1024) {
  //     requestAnimationFrame(animation);
  //   }
  // };

  // const setSliderPosition = (to = false, moveTo = null) => {
  //   if (to) {
  //     carousel.style.transform = `translateX(${moveTo}px)`;
  //     return;
  //   }
  //   // carousel.style.transition = 'all 500ms ease 0s';
  //   carousel.style.transitionDuration = '500ms';
  //   // carousel.childNodes.forEach((item) => {
  //   //   item.style.transitionDelay = '500ms'
  //   // })
  //   carousel.style.transform = `translateX(${currentTranslate}px)`;
  // };

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
