const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let pos = 0;
const itemMaxWidth = 248;
// console.log(pos, "position");

// Função para mover o carrossel
function moveCarousel() {
  // const containerWidth = document.querySelector('.carousel-container').offsetWidth;
  // const itemsPerPage = Math.floor(containerWidth / itemMaxWidth);
  // const itemsCount = carousel.children.length;
  // const maxPosition = (itemsCount - itemsPerPage) * itemMaxWidth;
  // alert(`${pos} POSITION. ${carousel.children.length} length; ${maxPosition} maxPosition`)
  carousel.style.transform = `translateX(-${pos}px)`;
}

// Event listener para o botão de avançar
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

// Event listener para o botão de retroceder
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

// Função para popular o carrossel com os produtos
function populateCarousel(products) {
  products.forEach((product, idx) => {
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    if (idx === 0) item.style.marginLeft = `1px`;
    item.innerHTML = `
      <span class="span_carousel_img" style="width: 205px; height: 256.25px; display: flex; justify-content: center; align-content: center;">
        <img class="carousel_prod_img" loading="lazy" src="${product.image}" alt="${product.title}">
      </span>
      <div style="width: 205px; height: 138px">
        <h3 style="height: 20px; overflow: hidden;">${product.title}</h3>
        <p class="carousel_prod_descr">${product.description}</p>
        <strong style="font-size: 19px; font-weight: 700;">S/ ${Number(product.price).toFixed(2)}</strong>
      </div>
    `;
    carousel.appendChild(item);
  });
}

// Fetch da API e população do carrossel
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => populateCarousel(data))
  .catch(error => console.error('Error fetching products:', error));
