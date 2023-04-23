import { convertProductObject, fetchProducts } from "../data/products.js";
import { getBagTotal, getBagItems } from "../data/bag.js";
import { renderBagCounterTag } from "../components/bagButton.js";
import { bagItem as bagItemsRow } from "../components/bagItem.js";

let bagItemsList;

export default async function shoppingBagPage() {
  initializeProperties();

  renderBagCounterTag(false);

  renderBagContent();

  addEvents();
}

function initializeProperties() {
  bagItemsList = document.querySelector(".shopping-bag-list");
}

async function renderBagContent() {
  const bagItems = getBagItems();

  if (bagItems.length === 0) {
    showEmptyBag();
  } else {
    renderBagItems(bagItems);
  }
}

function showEmptyBag() {
  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = "Your shopping bag is empty";
  bagItemsList.appendChild(emptyMessage);
  const sectionCheckout = document.querySelector(".section__checkout");
  sectionCheckout.style.display = "none";
}

function addEvents() {
  window.addEventListener("removed", (event) => {
    event.stopPropagation();
    removedFromBag(event.id);
  });
}

function renderBagItems(bagItems) {
  fetchProducts().then((allProducts) => {
    bagItems.forEach((item) => {
      // find product from bag in all products
      const productFoundInBag = allProducts.find(
        (product) => product.id == item.item
      );

      const product = convertProductObject(productFoundInBag);

      const bagItem = {
        item_number: item.item,
        title: product.title,
        image: product.image,
        price: item.price,
        amount: item.amount,
        size: item.size,
        totalPrice: item.price * item.amount,
      };
      const bagItemRowElement = bagItemsRow(bagItem);

      bagItemsList.appendChild(bagItemRowElement);

      const bagTotalElement = document.querySelector("#bagTotal");
      bagTotalElement.textContent = `kr ${getBagTotal().toString()},00`;
    });
  });
}

function removedFromBag(id) {
  const bagItem = document.getElementById(id);

  if (bagItem) {
    bagItemsList.removeChild(bagItem);

    renderBagCounterTag();

    const bagTotal = document.querySelector("#bagTotal");
    bagTotal.textContent = "NOK " + getBagTotal().toString();
  }
}
