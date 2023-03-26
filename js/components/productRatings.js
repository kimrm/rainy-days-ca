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
