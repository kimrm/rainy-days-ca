import {
  fetchProducts,
  fetchProduct,
  convertProductObject,
} from "../data/products.js";
import { countItemsInBag, getBagItems, addToBag } from "../data/bag.js";
import productCard from "../components/productCard.js";
import { productRatingElements } from "../components/productRatings.js";
import { renderBagCounterTag } from "../components/bagButton.js";

let productImageElement,
  productPriceElement,
  productDescriptionElement,
  productTitleElement,
  productShortDescriptionElement,
  ratingContainerElement,
  sizesInputElements,
  itemAmountInputElement,
  itemAmountSubtractButtonElement,
  itemAmountAddButtonElement,
  selectedSize,
  currentProduct;

/*  
  Starting point of this module
*/
export default async function productDetailsPage() {
  initializeProperties();

  const query = new URLSearchParams(window.location.search);
  const itemNumber = query.get("item_number");

  fetchProduct(itemNumber).then((product) => {
    currentProduct = product;
    renderProduct();
    addEvents();
  });

  renderMoreProductsGrid();
}

/*  
  Sets values to the declared properties of this module
*/
function initializeProperties() {
  productImageElement = document.querySelector("#product-image");
  productPriceElement = document.querySelector("#price");
  productDescriptionElement = document.querySelector("#productDescription");
  productTitleElement = document.querySelector("#productTitle");
  productShortDescriptionElement = document.querySelector(
    "#productShortDescription"
  );
  ratingContainerElement = document.querySelector(".rating-stars");
  sizesInputElements = document.querySelectorAll(".radio");
  itemAmountInputElement = document.querySelector("#itemAmount");
  itemAmountSubtractButtonElement = document.querySelector(
    "#itemAmountSubtract"
  );
  itemAmountAddButtonElement = document.querySelector("#itemAmountAdd");
}

/*  
  Renders the view of the currently selected product
*/
async function renderProduct() {
  document.title = `${currentProduct.title} - Rainy Days`;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", currentProduct.meta);

  productImageElement.src = currentProduct.image;
  productTitleElement.textContent = currentProduct.title;
  productShortDescriptionElement.innerHTML = currentProduct.short_description;
  productPriceElement.innerHTML = currentProduct.price_tag;
  productDescriptionElement.innerHTML = currentProduct.description;

  ratingContainerElement.append(productRatingElements(currentProduct).element);
}

/*  
  Renders the "more products"-grid below the current product view, by fetching
  all products and filtering out the ones that are already in the bag. 
*/
async function renderMoreProductsGrid() {
  const allProducts = await fetchProducts();
  let bagItems = getBagItems();
  const productsNotInBag = allProducts.filter((item) => {
    if (!bagItems.find((bagItem) => bagItem.item === item.id)) {
      return item;
    }
  });
  const otherProducts = document.querySelector("#otherProducts");
  otherProducts.innerHTML = "";
  productsNotInBag.slice(0, 4).forEach((item) => {
    const productObject = convertProductObject(item);
    const card = productCard(productObject);
    otherProducts.append(card);
  });
}

/*  
  Adding event handlers used on this page
*/
function addEvents() {
  addSizeInputEvent();

  addAmountInputEvents();

  addAddToBagEvent();
}

function addSizeInputEvent() {
  sizesInputElements.forEach((element) => {
    element.checked = false;
    element.addEventListener("change", (event) => {
      selectedSize = event.target.value;
    });
  });
}

function addAmountInputEvents() {
  itemAmountInputElement.addEventListener("keydown", (event) => {
    if (
      isNaN(event.key) &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Backspace"
    ) {
      event.preventDefault();
      if (event.target.value === "") {
        event.target.value = "1";
      }
    }
  });

  itemAmountSubtractButtonElement.addEventListener("click", (event) => {
    let numberValue = isNaN(parseInt(itemAmountInputElement.value))
      ? 0
      : parseInt(itemAmountInputElement.value);
    if (numberValue === 0) {
      numberValue = 1;
    }
    itemAmountInputElement.value = numberValue - 1;
  });

  itemAmountAddButtonElement.addEventListener("click", (event) => {
    let numberValue = isNaN(parseInt(itemAmountInputElement.value))
      ? 0
      : parseInt(itemAmountInputElement.value);
    itemAmountInputElement.value = numberValue + 1;
  });
}

function alertSizeNotSelected() {
  const optionLabelValue = document.querySelector(".option-label-value");
  const addToBagButton = document.querySelector("#addToBagButton");
  optionLabelValue.classList.add("text-alert");
  // disable button for 5 seconds
  addToBagButton.disabled = true;
  addToBagButton.textContent = "Please select a size";
  addToBagButton.classList.add("error");
  setTimeout(() => {
    addToBagButton.disabled = false;
    addToBagButton.textContent = "Add to bag";
    addToBagButton.classList.remove("error");
  }, 3000);
}

function temporaryDisableAddToBagButton(button) {
  // disable button for 5 seconds
  addToBagButton.disabled = true;
  addToBagButton.textContent = "Item added";
  addToBagButton.classList.add("added");
  setTimeout(() => {
    addToBagButton.disabled = false;
    addToBagButton.textContent = "Add to bag";
    addToBagButton.classList.remove("added");
  }, 5000);
}

function addAddToBagEvent() {
  const addToBagButton = document.querySelector("#addToBagButton");
  addToBagButton.addEventListener("click", (event) => {
    if (!selectedSize) {
      alertSizeNotSelected();
    } else {
      temporaryDisableAddToBagButton(addToBagButton);

      addToBag(
        currentProduct.item_number,
        selectedSize,
        itemAmountInputElement.value,
        currentProduct.price
      );
      renderBagCounterTag();
      renderMoreProductsGrid();
    }
  });
}
