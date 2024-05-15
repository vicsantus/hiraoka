const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let pos = 0;
const itemMaxWidth = 300;
// console.log(pos, "position");

// Função para mover o carrossel
function moveCarousel() {
  // alert(`${pos} POSITION. ${carousel.children.length} length`)
  carousel.style.transform = `translateX(-${pos}px)`;
}

// Event listener para o botão de avançar
nextBtn.addEventListener('click', () => {
  const containerWidth = document.querySelector('.carousel-container').offsetWidth;
  const itemsPerPage = Math.floor(containerWidth / itemMaxWidth);
  const itemsCount = carousel.children.length;
  const maxPosition = (itemsCount - itemsPerPage) * itemMaxWidth - itemMaxWidth;

  if (pos < maxPosition) {
      pos += itemMaxWidth;
      moveCarousel();
  }
  if (pos >= maxPosition) {
    pos = itemMaxWidth;
    moveCarousel();
  }
});

// Event listener para o botão de retroceder
prevBtn.addEventListener('click', () => {
  if (pos > 0) {
      pos -= itemMaxWidth;
      moveCarousel();
  }
  if (pos === 0) {
    pos = (itemMaxWidth * carousel.children.length) - (itemMaxWidth * 5);
    moveCarousel();
  }
});

// Função para popular o carrossel com os produtos
function populateCarousel(products) {
  products.forEach((product, idx) => {
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    item.innerHTML = `
      <span style="width: 240px; height: 300px; display: flex; justify-content: center; align-content: center;">
        <img class="carousel_prod_img" loading="lazy" width="240" height="300" src="${product.image}" alt="${product.title}">
      </span>
      <h3>${product.title}</h3>
      <p class="carousel_prod_descr">${product.description}</p>
      <strong>S/ $${product.price}</strong>
    `;
    carousel.appendChild(item);
  });
}

// Fetch da API e população do carrossel
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => populateCarousel(data))
  .catch(error => console.error('Error fetching products:', error));
