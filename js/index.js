import indexPage from "./pages/indexPage.js";
import productCollectionPage from "./pages/productCollectionPage.js";
import productDetailsPage from "./pages/productDetailsPage.js";
import shoppingBagPage from "./pages/shoppingBagPage.js";
import checkoutSuccessPage from "./pages/checkoutSuccessPage.js";
import footer from "./components/footer.js";
import { renderBagCounterTag } from "./components/bagButton.js";

index();

function index() {
  createAutoMinimizeNav();

  router();

  renderBagCounterTag(false);

  insertFooter();
}

function router() {
  const url = window.location.pathname;
  const routes = {
    "/": indexPage,
    "/index.html": indexPage,
    "/product.html": productDetailsPage,
    "/collection.html": productCollectionPage,
    "/shopping-bag.html": shoppingBagPage,
    "/checkout-success.html": checkoutSuccessPage,
    "/contact.html": () => false,
    "/contact_success.html": () => false,
    "/about.html": () => false,
  };
  routes[url]();
}

function createAutoMinimizeNav() {
  window.addEventListener("scroll", (event) => {
    const header = document.querySelector(".nav-wrapper");
    if (window.scrollY > 100) {
      header.classList.add("nav-wrapper-shrink");
    } else {
      header.classList.remove("nav-wrapper-shrink");
    }
  });
}

function insertFooter() {
  const footerContainer = document.querySelector("footer");
  footerContainer.innerHTML = footer();
}
