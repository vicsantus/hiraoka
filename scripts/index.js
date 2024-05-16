document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let pos = 0;
  const itemMaxWidth = 248;



  function moveCarousel() {
    carousel.style.transform = `translateX(-${pos}px)`;
  }

  nextBtn.addEventListener('click', () => {
    const containerWidth = document.querySelector('.carousel-container').offsetWidth;
    const itemsPerPage = Math.floor(containerWidth / itemMaxWidth);
    const itemsCount = carousel.children.length;
    const maxPosition = (itemsCount - itemsPerPage) * itemMaxWidth;
    if (pos <= maxPosition) {
      pos += itemMaxWidth;
      moveCarousel();
    }
    if (pos > maxPosition) {
      pos = 0;
      moveCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (pos >= 0) {
      pos -= itemMaxWidth;
      moveCarousel();
    }
    if (pos < 0) {
      pos = (itemMaxWidth * carousel.children.length) - (itemMaxWidth * 5);
      moveCarousel();
    }
  });

  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  const setPositionByIndex = () => {
    currentTranslate = pos * -itemMaxWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
  };

  const touchStart = (index) => (event) => {
    startX = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    carousel.addEventListener('touchmove', touchMove(index));
    carousel.addEventListener('touchend', touchEnd);
  };

  const touchMove = (_) => (event) => {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startX;
  };

  const touchEnd = () => {
    cancelAnimationFrame(animationID);
    const movedBy = currentTranslate - prevTranslate;
    // alert(`${movedBy} movedby; ${pos} pos;`)

    if (movedBy < -100 && pos < carousel.childElementCount - 4) {
      pos++;
    }

    if (movedBy < -100 && pos >= carousel.childElementCount - 4) {
      pos = 0;
    }

    if (movedBy > 100 && pos > 0) {
      pos--;
    }

    if (movedBy > 100 && pos <= 0) {
      pos = carousel.childElementCount - 4;
    }

    setPositionByIndex();

    carousel.removeEventListener('touchmove', touchMove);
    carousel.removeEventListener('touchend', touchEnd);
  };

  const getPositionX = (event) => {
    return event.touches[0].clientX;
  };

  const animation = () => {
    setSliderPosition();
    if (window.innerWidth <= 1024) {
      requestAnimationFrame(animation);
    }
  };

  const setSliderPosition = () => {
    carousel.style.transform = `translateX(${currentTranslate}px)`;
  };

  function populateCarousel(products) {
    products.forEach((product, idx) => {
      const item = document.createElement('div');
      item.classList.add('carousel-item');
      item.style.marginLeft = idx === 0 ? `1px` : `0`;
      item.innerHTML = `
              <span class="span_carousel_img" style="width: 205px; height: 256.25px; display: flex; justify-content: center; align-content: center;">
                  <img class="carousel_prod_img" loading="lazy" src="${product.image}" alt="${product.title}">
              </span>
              <div style="width: 205px; height: 138px">
                  <strong class="carousel_prod_title">${product.title}</strong>
                  <p class="carousel_prod_descr">${product.description}</p>
                  <strong style="font-size: 19px; font-weight: 700;">S/ ${Number(product.price).toFixed(2)}</strong>
              </div>
              <button type="button" title="Añadir al carro" class="action primary tocart" id="product-addtocart-button">
                  <span>Añadir al carro</span>
              </button>
          `;
      carousel.appendChild(item);
    });
    // alert(`${carousel.childElementCount} carousel.length`)

    if (window.innerWidth <= 1024) {
      // alert("ENTRASSE AQUI!!")
      carousel.querySelectorAll('.carousel-item').forEach((item, index) => {
        const itemContent = item;
        itemContent.addEventListener('touchstart', touchStart(index));
      });
    }
  }

  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => populateCarousel(data))
    .catch(error => console.error('Error fetching products:', error));
});
