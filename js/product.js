import { getProducts } from "./data/products.js";

const query = new URLSearchParams(window.location.search);
const itemNumber = query.get("item_number");

const data = await getProducts();

const product = data.products.find(
  (product) => product.item_number === itemNumber
);

const productImage = document.querySelector("#product-image");
productImage.src = product.image;
