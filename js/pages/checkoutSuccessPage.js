import { clearBag, getBagItems } from "../data/bag.js";
import { fetchProducts } from "../data/products.js";
import productCard from "../components/productCard.js";

export default async function checkoutSuccessPage() {
  // first fetch some random products that are not in the bag
  const allProducts = await fetchProducts();
  let bagItems = getBagItems();
  const productsNotInBag = allProducts.filter((item) => {
    return !bagItems.find((bagItem) => bagItem.item === item.item_number);
  });
  const checkoutProducts = document.querySelector("#checkoutProducts");
  productsNotInBag.slice(0, 4).forEach((item) => {
    checkoutProducts.innerHTML += productCard(item);
  });
  // then remove the bag items from the bag
  clearBag();
  getBagItemsCount();
}
