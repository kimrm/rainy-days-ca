import productRatings from "./productRatings.js";
import { computePrice } from "../data/products.js";

export default function productCard(product) {
  // using innerHTML because I have control over the data
  // and I don't need to worry about XSS
  return `
    <li>
        <div class="product-list__image">
          <a href="product.html?item_number=${product.item_number}"
              ><img
              src="${product.image}"
              alt="Rain jacket - ${product.title}"
          /></a>
          </div>
          <div>
          <a class="product-name-link" href="product.html?item_number=${
            product.item_number
          }"><h3>${product.category + "'s " + product.title}</h3></a>
          <div class="rating-stars">
            ${productRatings(product)}              
                </div>
        
          <div class="price-tag-card">NOK ${computePrice(product)},00
          ${
            product.deal
              ? `<span class="discount-tag-card">
        ${product.price},00
        </span>`
              : ""
          } </div>
        <div class="available-sizes-card">
          <span>Avl. in: </span>
          <span>${product.sizes.join(", ")}</span>
        </div>
      </div>      
    </li>
    `;
}
