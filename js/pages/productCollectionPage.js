import {
  loadFilter,
  saveFilter,
  fetchFilteredProducts,
  convertProductObject,
  filterProducts,
} from "../data/products.js";
import productCard, {
  productCardPlaceholder,
} from "../components/productCard.js";

let filterSettings;

export default async function productCollectionPage() {
  initializeProperties();

  addEvents();

  populateFilterInputsFromStorage();

  renderCollectionView();
}

function initializeProperties() {
  filterSettings = loadFilter();
  // get query parameters
  const query = new URLSearchParams(window.location.search);
  const collectionForParameter = query.get("for");
  if (collectionForParameter) {
    // set filterSettings gender to only the received parameter
    filterSettings.genders = [collectionForParameter];
  }
}

function addEvents() {
  addFilterEvents();
}

function populateFilterInputsFromStorage() {
  const filterMaxPrice = document.querySelector("#max_price");
  const maxPriceLabel = document.querySelector(".max-price-slider-value");
  const filterSort = document.querySelector("#filter_sort");
  const filterGender = document.querySelectorAll(".filter-gender");

  filterMaxPrice.value = filterSettings.maxPrice;
  maxPriceLabel.textContent = filterSettings.maxPrice;
  filterSort.value = filterSettings.sortMode;
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
}

function addFilterEvents() {
  addFilterGenderEvent();

  addFilterPriceRangeEvent();

  addFilterSortEvent();
}

function addFilterGenderEvent() {
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
      renderCollectionView();
    });
  });
}

function addFilterPriceRangeEvent() {
  const priceRange = document.querySelector("#max_price");
  let debounceTimerId;
  priceRange.addEventListener("input", (event) => {
    // debounce event so it doesn't fire too often
    const maxPriceLabel = document.querySelector(".max-price-slider-value");
    maxPriceLabel.textContent = event.target.value;
    filterSettings.maxPrice = event.target.value;
    clearTimeout(debounceTimerId);
    debounceTimerId = setTimeout(() => {
      renderCollectionView();
    }, 1000);
  });
}

function addFilterSortEvent() {
  const filterSort = document.querySelector(".filter-sort");
  filterSort.addEventListener("change", (event) => {
    filterSettings.sortMode = event.target.value;
    renderCollectionView();
  });
}

function renderCollectionView() {
  saveFilter(filterSettings);
  const productsList = document.querySelector(".product-list ul");
  productsList.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    productsList.innerHTML += productCardPlaceholder();
  }

  filterProducts().then((items) => {
    productsList.innerHTML = "";
    items.forEach((element) => {
      const product = convertProductObject(element);
      const item = productCard(product);
      productsList.appendChild(item);
    });
  });
}
