import { countItemsInBag } from "../data/bag.js";

/*  
  Renders the bag counter tag in the top right corner of the page, with or without animation
*/
export function renderBagCounterTag(withAnimation = true) {
  const shoppingBagItemsTagElement = document.querySelector(
    ".shopping-bag__item-tag"
  );
  shoppingBagItemsTagElement.classList.remove(
    "shopping-bag__item-tag-filledNoAnimation"
  );
  shoppingBagItemsTagElement.classList.remove("shopping-bag__item-tag-filled");
  const itemsCount = countItemsInBag();
  shoppingBagItemsTagElement.textContent = itemsCount;
  if (itemsCount > 0) {
    if (withAnimation) {
      // set timeout to allow css animation to play every time.
      // if not set it won't play the second time, for some unknown reason
      setTimeout(() => {
        shoppingBagItemsTagElement.classList.add(
          "shopping-bag__item-tag-filled"
        );
      }, 200);
    } else {
      shoppingBagItemsTagElement.classList.add(
        "shopping-bag__item-tag-filledNoAnimation"
      );
    }
  }
}
