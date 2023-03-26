import {
  recommendations,
  deals,
  loadFilter,
  saveFilter,
  filteredProducts,
} from "./data/products.js";
import productCard from "./components/productCard.js";

// ------------------ Index page ------------------

export function indexPage() {
  getRecommendations();
  getDeals();
}

async function getRecommendations() {
  const recommendationsUl = document.querySelector("#recommendations");
  recommendationsUl.innerHTML = "";
  const recommendationsProducts = await recommendations(10);
  recommendationsProducts.forEach((product) => {
    const item = productCard(product);
    recommendationsUl.innerHTML += item;
  });
}

async function getDeals() {
  const dealsUl = document.querySelector("#deals");
  dealsUl.innerHTML = "";
  const dealsProducts = await deals();
  dealsProducts.forEach((product) => {
    const item = productCard(product);
    dealsUl.innerHTML += item;
  });
}

// ------------------ Collection page ------------------

let filterSettings = loadFilter();

export async function collectionPage() {
  // get query parameters
  const query = new URLSearchParams(window.location.search);
  const collectionForParameter = query.get("for");
  if (collectionForParameter) {
    filterSettings.genders = [];
    filterSettings.genders.push(collectionForParameter);
  }

  createFilterEvents();
  const productsList = document.querySelector(".product-list ul");

  const storedFilterMaxPrice = filterSettings.maxPrice;
  const filterMaxPrice = document.querySelector("#max_price");
  filterMaxPrice.value = storedFilterMaxPrice;
  const maxPriceLabel = document.querySelector(".max-price-slider-value");
  maxPriceLabel.textContent = storedFilterMaxPrice;

  const filterSort = document.querySelector("#filter_sort");
  filterSort.value = filterSettings.sort;

  const filterGender = document.querySelectorAll(".filter-gender");
  filterGender.forEach((element) => {
    if (filterSettings.genders.includes(element.id)) {
      element.children[0].classList.remove("fa-regular");
      element.children[0].classList.add("fa-solid");
      element.children[0].classList.add("green");
    } else {
      element.children[0].classList.remove("fa-solid");
      element.children[0].classList.add("fa-regular");
      element.children[0].classList.remove("green");
    }
  });

  filterProducts();
}

function createFilterEvents() {
  const filterGender = document.querySelectorAll(".filter-gender");
  filterGender.forEach((element) => {
    element.addEventListener("click", (event) => {
      const elm = event.target;
      if (element.children[0].classList.contains("fa-regular")) {
        element.children[0].classList.remove("fa-regular");
        element.children[0].classList.add("fa-solid");
        element.children[0].classList.add("green");
        filterSettings.genders.push(element.id);
      } else {
        element.children[0].classList.remove("fa-solid");
        element.children[0].classList.add("fa-regular");
        element.children[0].classList.remove("green");
        filterSettings.genders = filterSettings.genders.filter(
          (item) => item !== element.id
        );
      }
      filterProducts();
    });
  });
  const priceRange = document.querySelector("#max_price");
  priceRange.addEventListener("input", (event) => {
    const maxPriceLabel = document.querySelector(".max-price-slider-value");
    maxPriceLabel.textContent = event.target.value;
    filterSettings.maxPrice = event.target.value;
    filterProducts();
  });
  const filterSort = document.querySelector(".filter-sort");
  filterSort.addEventListener("change", (event) => {
    filterSettings.sort = event.target.value;
    filterProducts();
  });
}

async function filterProducts() {
  saveFilter(filterSettings);

  const items = await filteredProducts(filterSettings);

  const productsList = document.querySelector(".product-list ul");
  productsList.innerHTML = "";
  items.forEach((element) => {
    const item = productCard(element);
    productsList.innerHTML += item;
  });
}
