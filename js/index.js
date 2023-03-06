import { products, product, recommendations, deals } from "./data/products.js";
import { countItemsInBag, getBagTotal } from "./data/bag.js";
import productCard from "./components/productCard.js";
import bagRow from "./components/bagRow.js";

const shoppingBagTtemsTag = document.querySelector(".shopping-bag__item-tag");
const url = window.location.pathname;
let selectedSize;
let selectedPrice;

if (url.includes("/index.html") || url === "/") {
  indexPage();
} else if (url.includes("/product.html")) {
  productDetailsPage();
} else if (url.includes("/collection.html")) {
  collectionPage();
} else if (url.includes("/shopping-bag.html")) {
  shoppingBagPage();
} else if (url.includes("/checkout-success.html")) {
  checkoutSuccessPage();
}

async function checkoutSuccessPage() {
  // first fetch some random products that are not in the bag
  const allProducts = await products();
  let bagItems = getBagItems();
  const productsNotInBag = allProducts.filter((item) => {
    return !bagItems.find((bagItem) => bagItem.item === item.item_number);
  });
  const checkoutProducts = document.querySelector("#checkoutProducts");
  productsNotInBag.slice(0, 4).forEach((item) => {
    checkoutProducts.innerHTML += productCard(item);
  });
  // then remove the bag items from the bag
}

// if there is a shopping bag element on the page, get the number of items in the bag
if (shoppingBagTtemsTag) {
  getBagItemsCount(false);
}

function getBagItemsCount(withAnimation = true) {
  const itemsCount = countItemsInBag();
  if (itemsCount > 0) {
    if (withAnimation) {
      shoppingBagTtemsTag.classList.remove(
        "shopping-bag__item-tag-filledNoAnimation"
      );
      shoppingBagTtemsTag.classList.remove("shopping-bag__item-tag-filled");
      setTimeout(() => {
        shoppingBagTtemsTag.classList.add("shopping-bag__item-tag-filled");
      }, 200);
    } else {
      shoppingBagTtemsTag.classList.add(
        "shopping-bag__item-tag-filledNoAnimation"
      );
    }

    shoppingBagTtemsTag.textContent = countItemsInBag();
  } else {
    shoppingBagTtemsTag.classList.remove(
      "shopping-bag__item-tag-filledNoAnimation"
    );
    shoppingBagTtemsTag.classList.remove("shopping-bag__item-tag-filled");
  }
}

function getBagItems() {
  const bagItems = JSON.parse(localStorage.getItem("bag")) || [];
  return bagItems;
}

async function shoppingBagPage() {
  const bagItems = getBagItems();
  const allProducts = await products();
  const bagItemsList = document.querySelector(".shopping-bag-list");

  bagItems.forEach((item) => {
    const bagProduct = allProducts.find(
      (product) => product.item_number === item.item
    );
    const bagItem = {
      item_number: item.item,
      title: bagProduct.title,
      image: bagProduct.image,
      price: item.price,
      quantity: item.amount,
      size: item.size,
    };
    const bagItemRow = bagRow(bagItem);

    // bagItemRow.forEach((element) => {
    //   bagItemsList.appendChild(element);
    // });

    bagItemsList.appendChild(bagItemRow);

    window.addEventListener("removed", (event) => {
      event.stopPropagation();
      removedFromBag(event.id);
    });

    const bagTotal = document.querySelector("#bagTotal");
    bagTotal.textContent = "NOK " + getBagTotal().toString();
  });
}

function removedFromBag(id) {
  const bagItemsList = document.querySelector(".shopping-bag-list");
  const bagItem = document.getElementById(id);

  if (bagItem) {
    bagItemsList.removeChild(bagItem);

    getBagItemsCount();

    const bagTotal = document.querySelector("#bagTotal");
    bagTotal.textContent = "NOK " + getBagTotal().toString();
  }
}

function indexPage() {
  getRecommendations();
  getDeals();
}

async function productDetailsPage() {
  // first fetch some random products that are not in the bag
  const allProducts = await products();
  let bagItems = getBagItems();
  const productsNotInBag = allProducts.filter((item) => {
    return !bagItems.find((bagItem) => bagItem.item === item.item_number);
  });
  const otherProducts = document.querySelector("#otherProducts");
  productsNotInBag.slice(0, 4).forEach((item) => {
    otherProducts.innerHTML += productCard(item);
  });

  const query = new URLSearchParams(window.location.search);
  const itemNumber = query.get("item_number");
  const item = await product(itemNumber);

  selectedPrice = item.price;

  const productImage = document.querySelector("#product-image");
  const price = document.querySelector("#price");
  const productDescription = document.querySelector("#productDescription");
  const productTitle = document.querySelector("#productTitle");
  const productShortDescription = document.querySelector(
    "#productShortDescription"
  );
  productImage.src = item.image;
  productTitle.textContent = item.title;
  productShortDescription.textContent = item.short_description;
  price.textContent = item.price.toString() + ".00";
  productDescription.textContent = item.description;

  createEvents(itemNumber);
}

function createEvents(itemNumber) {
  const sizesInput = document.querySelectorAll(".radio");
  sizesInput.forEach((element) => {
    element.checked = false;
    element.addEventListener("change", (event) => {
      selectedSize = event.target.value;
    });
  });

  const itemAmountInput = document.querySelector("#itemAmount");
  itemAmountInput.addEventListener("keydown", (event) => {
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

  const itemAmountSubtractButton = document.querySelector(
    "#itemAmountSubtract"
  );
  itemAmountSubtractButton.addEventListener("click", (event) => {
    let numberValue = isNaN(parseInt(itemAmountInput.value))
      ? 0
      : parseInt(itemAmountInput.value);
    if (numberValue === 0) {
      numberValue = 1;
    }
    itemAmountInput.value = numberValue - 1;
  });
  const itemAmountAddButton = document.querySelector("#itemAmountAdd");
  itemAmountAddButton.addEventListener("click", (event) => {
    let numberValue = isNaN(parseInt(itemAmountInput.value))
      ? 0
      : parseInt(itemAmountInput.value);
    itemAmountInput.value = numberValue + 1;
  });

  const addToBagButton = document.querySelector("#addToBagButton");
  addToBagButton.addEventListener("click", (event) => {
    if (!selectedSize) {
      const optionLabelValue = document.querySelector(".option-label-value");
      optionLabelValue.classList.add("text-alert");
      // disable button for 5 seconds
      event.target.disabled = true;
      event.target.textContent = "Please select a size";
      event.target.classList.add("error");
      setTimeout(() => {
        event.target.disabled = false;
        event.target.textContent = "Add to bag";
        event.target.classList.remove("error");
      }, 3000);
    } else {
      // disable button for 5 seconds
      event.target.disabled = true;
      event.target.textContent = "Item added";
      event.target.classList.add("added");
      setTimeout(() => {
        event.target.disabled = false;
        event.target.textContent = "Add to bag";
        event.target.classList.remove("added");
      }, 5000);

      const bagItemsIndicator = document.querySelector(
        ".shopping-bag__item-tag"
      );
      bagItemsIndicator.textContent = addToBag(
        itemNumber,
        selectedSize,
        itemAmountInput.value,
        selectedPrice
      );
      bagItemsIndicator.classList.remove(
        "shopping-bag__item-tag-filledNoAnimation"
      );
      bagItemsIndicator.classList.remove("shopping-bag__item-tag-filled");
      setTimeout(() => {
        bagItemsIndicator.classList.add("shopping-bag__item-tag-filled");
      }, 200);
    }
  });
}

function addToBag(itemNumber, selectedSize, amount, price) {
  const storedBag = localStorage.getItem("bag")
    ? localStorage.getItem("bag")
    : "[]";
  let bag = JSON.parse(storedBag);
  let itemExists = false;
  bag = bag.map((item) => {
    if (item.item === itemNumber && item.size === selectedSize) {
      item.amount = parseInt(item.amount) + parseInt(amount);
      itemExists = true;
    }
    return item;
  });
  if (!itemExists) {
    bag.push({
      item: itemNumber,
      size: selectedSize,
      amount: parseInt(amount),
      price: price,
    });
  }

  localStorage.setItem("bag", JSON.stringify(bag));

  let items = 0;
  bag.forEach((element) => {
    items += parseInt(element.amount);
  });
  return items;
}

async function collectionPage() {
  const productsList = document.querySelector(".product-list ul");
  const items = await products();
  items.forEach((element) => {
    const item = productCard(element);
    productsList.innerHTML += item;
  });
}

async function getRecommendations() {
  const recommendationsUl = document.querySelector("#recommendations");
  recommendationsUl.innerHTML = "";
  const recommendationsProducts = await recommendations(4);
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
