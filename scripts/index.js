document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.querySelector('.dots-container');

  let currentIndex = 0;
  const itemMaxWidth = 248;
  const transitionTime = 0.5;

  function createDots(itemsCount) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < itemsCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToIndex(i, window.innerWidth <= 1024));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function updateCarousel(isMobile = false) {
    const items = Array.from(carousel.children);

    items.forEach((item, index) => {
      const cur = ((index - currentIndex + items.length) % items.length);
      item.style.marginLeft = cur === 0 ? "1px" : "0px";
      item.style.order = cur;
      item.style.transform = `translateX(0px)`;
      if ((items.length - 1) === cur) {
        item.style.transform = `translateX(-${((cur - 1) * itemMaxWidth) + itemMaxWidth + itemMaxWidth}px)`;
      }
      if ((items.length - 2) === cur) {
        item.style.transform = `translateX(-${((cur - 1) * itemMaxWidth) + itemMaxWidth + itemMaxWidth + itemMaxWidth}px)`;
      }
      if ((items.length - 3) === cur && isMobile) {
        item.style.transform = `translateX(-${((cur - 1) * itemMaxWidth) + itemMaxWidth + itemMaxWidth + itemMaxWidth + itemMaxWidth}px)`;
      }
      if ((items.length - 4) === cur && isMobile) {
        item.style.transform = `translateX(-${((cur - 1)
          * itemMaxWidth)
          + itemMaxWidth
          + itemMaxWidth
          + itemMaxWidth
          + itemMaxWidth
          + itemMaxWidth}px)`;
      }
    });

    if (isMobile) {
      setTimeout(() => {
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(0)`;
      }, 500);
      return;
    }

    carousel.style.transition = 'none';
    carousel.style.transform = `translateX(0)`;
  }

  function moveToIndex(index, isMobile = false) {
    const itemsCount = carousel.children.length;
    const direction = index > currentIndex ? 1 : -1;

    carousel.style.transition = `transform ${transitionTime}s ease`;
    carousel.style.transform = `translateX(${-direction * itemMaxWidth}px)`;

    if (!isMobile) {
      setTimeout(() => {
        currentIndex = (index + itemsCount) % itemsCount;
        updateCarousel(isMobile);
        updateDots();
      }, transitionTime * 1000);
      return;
    }
    currentIndex = (index + itemsCount) % itemsCount;
    updateCarousel(isMobile);
    updateDots();
  }

  nextBtn.addEventListener('click', () => {
    moveToIndex(currentIndex + 1);
  });

  prevBtn.addEventListener('click', () => {
    moveToIndex(currentIndex - 1);
  });

  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  const setPositionByIndex = (idx) => {
    currentTranslate = 0;
    setSliderPosition(true, idx > 0 ? itemMaxWidth : itemMaxWidth * -1);
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
    // setSliderPosition();
  };

  const touchEnd = () => {
    cancelAnimationFrame(animationID);
    animationID = 0;
    const movedBy = currentTranslate - prevTranslate;
    let idx;

    if (movedBy < -100) {
      idx = currentIndex + 1;
    }

    if (movedBy > 100) {
      idx = currentIndex - 1;
    }
    setPositionByIndex(idx);
    moveToIndex(idx, true);

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

  const setSliderPosition = (to = false, moveTo = null) => {
    if (to) {
      // alert(moveTo)
      carousel.style.transform = `translateX(${moveTo}px)`;
      return;
    }
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

    if (window.innerWidth <= 1024) {
      carousel.querySelectorAll('.carousel-item').forEach((item, index) => {
        const itemContent = item;
        itemContent.addEventListener('touchstart', touchStart(index));
      });
    }

    createDots(products.length);
    updateCarousel(window.innerWidth <= 1024);
  }

  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => populateCarousel(data))
    .catch(error => console.error('Error fetching products:', error));
});
