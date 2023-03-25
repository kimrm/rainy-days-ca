import { removeItemFromBag } from "../data/bag.js";

export function bagItem(item) {
  const removed = new Event("removed");
  removed.id = "row_" + item.item_number + "_" + item.size;

  const row = document.createElement("div");
  row.classList.add("shopping-bag-list-row");
  row.id = "row_" + item.item_number + "_" + item.size;

  const firstCol = document.createElement("div");
  firstCol.classList.add("shopping-bag-list__first-column");
  firstCol.innerHTML = `
  <a href="product.html?item_number=${item.item_number}">
      <img
      class="product-image-bag"
      src="${item.image}"
      alt="${item.title}"
      />
  </a>`;
  const secondCol = document.createElement("div");
  secondCol.classList.add("shopping-bag-list-row-fields");
  secondCol.innerHTML = `
  <div class="shopping-bag-list__second-column">
    <div class="bag-product-title">${item.title}</div>
    <div>Item#: <span class="bag-product-itemnr">${item.item_number}</span></div>
    <div>Size: <span class="bag-product-size">${item.size}</span></div>
  </div>
  <div class="shopping-bag-list__column">${item.amount} pcs.</div>
  <div class="shopping-bag-list__column">${item.price},00</div>
  <div class="shopping-bag-list__column total">${item.totalPrice},00</div>
  `;
  const removeButtonDiv = document.createElement("div");
  removeButtonDiv.classList.add("shopping-bag-list__column");
  const removeButton = document.createElement("button");
  removeButton.classList.add("shopping-bag-list__remove-button");
  removeButton.innerHTML = `<i class="fa-regular fa-trash-can"></i> Remove`;
  removeButton.addEventListener("click", (event) => {
    removeItemFromBag(item);
    window.dispatchEvent(removed);
  });
  removeButtonDiv.appendChild(removeButton);
  secondCol.appendChild(removeButtonDiv);
  row.appendChild(firstCol);
  row.appendChild(secondCol);
  return row;
}
