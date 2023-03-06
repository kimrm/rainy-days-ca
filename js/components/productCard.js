export default function productCard(product) {
  // using innerHTML because I have control over the data
  // and I don't need to worry about XSS
  return `
    <li>
        <div class="product-list__image">
        <a href="product.html?item_number=${product.item_number}"
            ><img
            src="${product.image}"
            alt="Slim Fit Training Jacket"
        /></a>
        </div>
        <a href="product.html?item_number=${product.item_number}"><h3>${
    product.title
  }</h3></a>
        
        <div class="price-tag-card">NOK ${
          product.deal
            ? product.price -
              (product.price * product.deal.discount_percent) / 100
            : product.price
        } 
        ${
          product.deal
            ? `<span style="color:red; text-decoration: line-through;">
      ${product.price}
      </span>`
            : ""
        } </div>
       <a href="product.html?item_number=${
         product.item_number
       }" class="button buy-button">Buy</a>
    </li>
    `;
}
