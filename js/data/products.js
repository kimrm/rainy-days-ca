import { consumer_key, consumer_secret } from "../apiSettings.js";
import { filter } from "./productFilter.js";

const defaultFilterSettings = {
  genders: [],
  sortMode: "relevance",
  maxPrice: 4000,
};

function createURL(baseUrl, parameters) {
  const url = new URL(baseUrl);
  for (let key in parameters) {
    url.searchParams.append(key, parameters[key]);
  }
  return url;
}

async function fetchSingleJson(id) {
  const baseUrl = `https://wp-rainydays.kimrune.dev/wp-json/wc/v3/products/${id}`;
  const url = createURL(baseUrl, {
    consumer_key,
    consumer_secret,
  });
  const response = await fetch(url);
  return await response.json();
}

async function fetchJson() {
  const baseUrl = "https://wp-rainydays.kimrune.dev/wp-json/wc/v3/products";
  const url = createURL(baseUrl, {
    consumer_key,
    consumer_secret,
  });
  const response = await fetch(url);
  return await response.json();
}

export async function fetchProducts() {
  const data = await fetchJson();
  return data;
}

export async function fetchProduct(id) {
  const product = await fetchSingleJson(id);
  return convertProductObject(product);
}

export async function fetchCategories() {
  const data = await fetchJson();
  return data.categories;
}

export async function fetchFeatured() {
  const products = await fetchJson();
  return products.filter((product) => product.featured);
}

export async function fetchRecommendations(max = 4) {
  // simulating a random selection of products that are recommended products for the current user
  // a random number can sometimes be the same, in these cases we just ignore it
  // the list of products does not have to be the same length as the max value
  const products = await fetchJson();
  let returnProducts = products;

  const x = 0;
  const y = products.length < max ? products.length : max;
  const randomIndexes = [];
  for (let i = 0; i < max; i++) {
    let random = Math.floor(Math.random() * (y - x) + x);

    if (!randomIndexes.includes(random)) {
      randomIndexes.push(random);
    }
  }

  // check filter settings to see what the user is interested in
  let filterSettings = JSON.parse(localStorage.getItem("filterSettings"));
  if (filterSettings) {
    // filter out products that are not in the filter settings
    if (filterSettings.sortMode === "price-asc") {
      // the user is interested in products that are cheap
      returnProducts.sort((a, b) => a.price - b.price);
    }
    if (filterSettings.genders.length > 0) {
      // if user has selected gender then only show products that match that gender
      returnProducts = returnProducts.filter((product) =>
        filterSettings.genders.includes(
          product.categories[0].name.toLowerCase()
        )
      );
    }
  }

  return returnProducts.filter((product) =>
    randomIndexes.includes(products.indexOf(product))
  );
}

export function loadFilter() {
  const storedFilterSettings = JSON.parse(
    localStorage.getItem("filterSettings")
  );
  return storedFilterSettings ? storedFilterSettings : defaultFilterSettings;
}

export function saveFilter(filterSettings) {
  localStorage.setItem("filterSettings", JSON.stringify(filterSettings));
}

export async function filterProducts() {
  const products = await fetchProducts();
  return filter(products);
}

export async function fetchFilteredProducts(filterSettings) {
  const maxPrice = filterSettings.maxPrice;

  const sort = filterSettings.sortMode;

  let items = await fetchProducts();

  if (filterSettings.genders.length > 0) {
    items = items.filter((item) =>
      filterSettings.genders.includes(item.categories[0].name.toLowerCase())
    );
  }

  items = items.filter((item) => parseInt(item.price) <= maxPrice);

  items.sort((a, b) => {
    const priceA = parseInt(a.price);
    const priceB = parseInt(b.price);
    switch (sort) {
      case "price-asc":
        return sortAB(priceA, priceB);
        break;
      case "price-desc":
        return sortAB(priceB, priceA);
        break;
      case "name asc":
        return a.title.localeCompare(b.title);
        break;
      case "name desc":
        return b.title.localeCompare(a.title);
        break;
      default:
        return 0;
    }
  });

  function sortAB(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  return items;
}

export async function rateProduct(review) {
  const baseUrl =
    "https://wp-rainydays.kimrune.dev/wp-json/wc/v3/products/reviews";
  const url = createURL(baseUrl, {
    consumer_key,
    consumer_secret,
  });
  const data = review;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/* converts the product object from the wooCommerce API 
to the object format used on this site */
export function convertProductObject(product) {
  const {
    id,
    name,
    price,
    price_html,
    images,
    categories,
    deal,
    attributes,
    description,
    short_description,
    average_rating,
  } = product;

  const meta = attributes.filter((attribute) => attribute.name === "meta")[0];
  const sizes = attributes.filter(
    (attribute) => attribute["name"] === "Size"
  )[0].options;

  return {
    id: id,
    item_number: id,
    title: name,
    price: price,
    price_tag: price_html,
    image: images[0].src,
    category: categories.map((category) => category.name),
    deal: deal,
    sizes: sizes,
    meta: meta ? meta.options[0] : "",
    description: description,
    short_description: short_description,
    rating: Math.floor(average_rating),
  };
}
