import ratingModal from "./ratingModal.js";
import html from "./htmlElement.js";

export default function productRatings(product) {
  const stars = product.stars;
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fa-solid fa-star ${
      stars >= i ? "starred" : "unstarred"
    }"></i>`;
  }
  return (
    html + `<span class="rating-count">(${product.stars} of 5 stars)</span>`
  );
}

export function productRatingElements(product) {
  const div = new html("div");
  div.setClasses("rating-stars");
  for (let i = 1; i <= 5; i++) {
    const star = createStarElement(product.rating >= i);
    star.id = `star_${product.item_number}_${i}`;
    // add event listeners
    div.appendChild(star);
  }
  return div;
}

function createStarElement(starred) {
  const star = new html("i");
  star.setClasses("fa-solid", "fa-star", starred ? "starred" : "unstarred");
  return star;
}
