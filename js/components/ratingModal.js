import { rateProduct } from "../data/products.js";

export default function ratingModal(product) {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop");
  const modal = document.createElement("div");
  modal.classList.add("modal-content");
  const modalHeading = document.createElement("h2");
  modalHeading.textContent = "How would you rate this product?";
  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  const divRating = document.createElement("div");

  const hiddenRating = document.createElement("input");
  hiddenRating.type = "hidden";
  hiddenRating.name = "rating_value";
  hiddenRating.id = "rating_value";
  hiddenRating.value = 0;
  divRating.appendChild(hiddenRating);

  const divNameField = document.createElement("div");
  divNameField.classList.add("form-group");
  const divNameLabel = document.createElement("label");
  const divNameInput = document.createElement("input");
  divNameLabel.textContent = "Name";
  divNameInput.type = "text";
  divNameInput.name = "name";
  divNameInput.id = "name";
  divNameField.appendChild(divNameLabel);
  divNameField.appendChild(divNameInput);
  modalBody.appendChild(divNameField);

  const divEmailField = document.createElement("div");
  divEmailField.classList.add("form-group");
  const divEmailLabel = document.createElement("label");
  const divEmailInput = document.createElement("input");
  divEmailLabel.textContent = "Email";
  divEmailInput.type = "email";
  divEmailInput.name = "email";
  divEmailInput.id = "email";
  divEmailField.appendChild(divEmailLabel);
  divEmailField.appendChild(divEmailInput);
  modalBody.appendChild(divEmailField);

  const divReviewField = document.createElement("div");
  divReviewField.classList.add("form-group");
  const divReviewLabel = document.createElement("label");
  const divReviewInput = document.createElement("textarea");
  divReviewLabel.textContent = "Review";
  divReviewInput.name = "review";
  divReviewInput.id = "review";
  divReviewField.appendChild(divReviewLabel);
  divReviewField.appendChild(divReviewInput);
  modalBody.appendChild(divReviewField);

  const divRatingInstruction = document.createElement("p");
  divRatingInstruction.textContent = "Click on a star to rate this product";
  divRating.appendChild(divRatingInstruction);

  divRating.appendChild(ratingStars(product));

  modalBody.appendChild(divRating);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");

  const modalFooterButtonGroup = document.createElement("div");
  modalFooterButtonGroup.classList.add("btn-group");

  const modalFooterButtonOk = document.createElement("button");
  modalFooterButtonOk.textContent = "Submit review";
  modalFooterButtonOk.addEventListener("click", (event) => {
    rateProduct({
      product_id: product.item_number,
      reviewer: divNameInput.value,
      reviewer_email: divEmailInput.value,
      review: divReviewInput.value,
      rating: hiddenRating.value,
    }).then((rateResponse) => {
      console.log(rateResponse);
    });
    alert(`You rated this product ${i} stars!`);
  });
  const modalFooterButtonCancel = document.createElement("button");
  modalFooterButtonCancel.textContent = "Cancel";
  modalFooterButtonCancel.addEventListener("click", (event) => {
    modalContainer.remove();
  });

  modalFooterButtonCancel.classList.add("btn-cancel");
  modalFooterButtonOk.classList.add("btn-ok");

  modalFooterButtonGroup.appendChild(modalFooterButtonOk);
  modalFooterButtonGroup.appendChild(modalFooterButtonCancel);

  modalFooter.appendChild(modalFooterButtonGroup);

  backdrop.addEventListener("click", (event) => {
    modalContainer.remove();
  });

  modal.appendChild(modalHeading);
  modal.appendChild(modalBody);
  modal.appendChild(modalFooter);
  modalContainer.appendChild(backdrop);
  modalContainer.appendChild(modal);

  return modalContainer;
}

function ratingStars(product) {
  const div = document.createElement("div");
  div.classList.add("rating-stars");
  const stars = product.stars;
  for (let i = 1; i <= 5; i++) {
    const iElement = document.createElement("i");
    iElement.id = `star_${product.item_number}_${i}`;
    iElement.classList.add("fa-solid");
    iElement.classList.add("fa-star");
    iElement.classList.add(stars >= i ? "starred" : "unstarred");

    iElement.addEventListener("click", (event) => {
      const hiddenRating = document.getElementById("rating_value");
      hiddenRating.value = i;
    });
    div.appendChild(iElement);
  }
  return div;
}
