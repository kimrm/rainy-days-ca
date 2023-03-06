import { removeItemFromBag } from "../data/bag.js";

export default function bagRow(item) {
  const removed = new Event("removed");
  removed.id = "row_" + item.item_number + "_" + item.size;

  const row = document.createElement("div");
  row.classList.add("shopping-bag-list-row");
  row.id = "row_" + item.item_number + "_" + item.size;

  const colOne = document.createElement("div");
  colOne.id = "col1_" + item.item_number + "_" + item.size;
  colOne.classList.add("shopping-bag-list__item");

  colOne.innerHTML = `
    <div>
        <a href="product.html?item_number=${item.item_number}">
            <img
            class="product-image-bag"
            src="${item.image}"
            alt="${item.title}"
            />
        </a>
    </div>
    <div>
        <p class="shopping-bag-list__title">${item.title}</p>
        <p class="shopping-bag-list__size"><span class="shopping-bag-list__size-label">Size:</span> ${item.size.toUpperCase()}</p>
    </div>
    `;
  const colTwo = document.createElement("div");
  colTwo.id = "col2_" + item.item_number + "_" + item.size;
  colTwo.classList.add("shopping-bag-list__quantity");
  colTwo.textContent = item.quantity + " pcs.";
  const colThree = document.createElement("div");
  colThree.id = "col3_" + item.item_number + "_" + item.size;
  colThree.classList.add("shopping-bag-list__price");
  colThree.textContent = item.price + ",00";
  const colFour = document.createElement("div");
  colFour.id = "col4_" + item.item_number + "_" + item.size;
  colFour.classList.add("shopping-bag-list__total");
  colFour.textContent = item.price * item.quantity + ",00";
  const colFive = document.createElement("div");
  colFive.id = "col5_" + item.item_number + "_" + item.size;
  colFive.classList.add("shopping-bag-list__remove");
  const removeButton = document.createElement("button");
  removeButton.classList.add("shopping-bag-list__remove-button");
  removeButton.innerHTML = `<i class="fa-regular fa-trash-can"></i> Remove`;
  colFive.appendChild(removeButton);
  removeButton.addEventListener("click", (event) => {
    removeItemFromBag(item);
    window.dispatchEvent(removed);
  });

  row.appendChild(colOne);
  row.appendChild(colTwo);
  row.appendChild(colThree);
  row.appendChild(colFour);
  row.appendChild(colFive);

  return row;
}
