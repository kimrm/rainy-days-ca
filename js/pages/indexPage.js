import {
  fetchRecommendations,
  fetchFeatured,
  convertProductObject,
} from "../data/products.js";
import productCard, {
  productCardPlaceholder,
} from "../components/productCard.js";

export default function indexPage() {
  const recommendationsUl = document.querySelector("#recommendations");
  const featuredUl = document.querySelector("#featured");

  renderProductsGrid(featuredUl, async function () {
    return await fetchFeatured();
  });
  renderProductsGrid(recommendationsUl, async function () {
    return await fetchRecommendations(10);
  });

  addEvents();
}

async function renderProductsGrid(parent, productsQuery) {
  parent.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    parent.innerHTML += productCardPlaceholder();
  }

  productsQuery().then((products) => {
    parent.innerHTML = "";
    products.forEach((product) => {
      const convertedProduct = convertProductObject(product);
      const item = productCard(convertedProduct);
      parent.appendChild(item);
    });
  });
}

function addEvents() {
  document.addEventListener("click", (event) => {
    const video = document.querySelector(".hero-video");
    if (!video.playing) {
      video.play();
    }
  });
  document.addEventListener("touchstart", (event) => {
    const video = document.querySelector(".hero-video");
    if (!video.playing) {
      video.play();
    }
  });
}
