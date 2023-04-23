import { productRatingElements } from "./productRatings.js";
import html from "./htmlElement.js";

export function productCardPlaceholder() {
  return `
    <li>
      <div class="product-list__image">
        <div class="loader-placeholder-image"></div>
      </div>
      <div>
        <div class="loader-placeholder-text"></div>
        <div class="loader-placeholder-text"></div>
        <div class="loader-placeholder-text"></div>
        <div class="available-sizes-card">
          <span class="loader-placeholder-text">Avl. in: </span>
          <span class="loader-placeholder-text">XS, S, M, L, XL</span>
        </div>
      </div>
    </li>
    `;
}

export default function productCard(product) {
  const li = new html("li");
  const divImage = new html("div");
  const anchorImage = new html("a");
  const imageProduct = new html("img");
  const divProduct = new html("div");
  const anchorProduct = new html("a");
  const h3 = new html("h3");
  const divRating = new html("div");
  const divPrice = new html("div");
  const divAvailableSizes = new html("div");
  const spanAvailableSizes = new html("span");
  const spanAvailableSizesText = new html("span");

  li.setClasses("product-card");

  divImage.setClasses("product-list__image");
  anchorImage.setHref(`product.html?item_number=${product.item_number}`);
  imageProduct
    .setClasses("load-image")
    .setSrc(product.image)
    .setAltText(`Rain jacket - ${product.title}`)
    .setEventListener("load", () => {
      anchorImage.appendChild(imageProduct);
    });

  h3.setText(`${product.category + "'s " + product.title}`);

  anchorProduct
    .setClasses("product-name-link")
    .setHref(`product.html?item_number=${product.item_number}`);

  divPrice.setClasses("price-tag-card").setHtml(product.price_tag);

  divAvailableSizes.setClasses("available-sizes-card");
  spanAvailableSizes.setText("Avl. in: ");
  spanAvailableSizesText.setText(product.sizes.join(", "));

  if (product.deal) {
    const discountSpan = new html("span")
      .setClasses("discount-tag-card")
      .setText(`${product.price},00`);
    divPrice.appendChild(discountSpan);
  }

  const ratingElements = productRatingElements(product);

  divImage.appendChild(anchorImage);

  anchorProduct.appendChild(h3);
  divProduct.appendChild(anchorProduct);
  divRating.appendChild(ratingElements);
  divProduct.appendChild(divRating);
  divProduct.appendChild(divPrice);

  divAvailableSizes
    .appendChild(spanAvailableSizes)
    .appendChild(spanAvailableSizesText);
  divProduct.appendChild(divAvailableSizes);

  li.appendChild(divImage);
  li.appendChild(divProduct);

  return li.element;
}
