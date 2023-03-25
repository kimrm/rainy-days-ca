const url = "/data/products.json";

const defaultFilterSettings = {
  genders: [],
  sort: "relevance",
  maxPrice: 4000,
};

async function fetchJson() {
  const response = await fetch(url);
  return await response.json();
}

export async function products() {
  const data = await fetchJson();
  return data.products;
}

export async function product(itemNumber) {
  const data = await fetchJson();
  const products = data.products;
  return products.find((product) => product.item_number === itemNumber);
}

export async function categories() {
  const data = await fetchJson();
  return data.categories;
}

export async function deals() {
  const data = await fetchJson();
  const products = data.products;
  return products.filter((product) => product.deal);
}

export async function recommendations(max = 4) {
  // simulating a random selection of products that are recommended products for the current user
  // a random number can sometimes be the same, in these cases we just ignore it
  // the list of products does not have to be the same length as the max value
  const data = await fetchJson();
  let products = data.products;
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
    // FIX THIS LATER
    if (filterSettings.sort === "price-asc") {
      // the user is interested in products that are cheap
      products.sort((a, b) => a.price - b.price);
    }
    if (filterSettings.genders.length > 0) {
      // if user has selected gender then only show products that match that gender
      products = products.filter((product) =>
        filterSettings.genders.includes(product.category)
      );
    }
  }

  return products.filter((product) =>
    randomIndexes.includes(products.indexOf(product))
  );
}

export function computePrice(product) {
  if (!product.deal) {
    return product.price;
  }
  const discountedPrice =
    product.price - (product.price * product.deal.discount_percent) / 100;
  return Math.round(discountedPrice);
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

export async function filteredProducts(filterSettings) {
  const maxPrice = filterSettings.maxPrice;

  const sort = filterSettings.sort;

  let items = await products();

  if (filterSettings.genders.length > 0) {
    items = items.filter((item) =>
      filterSettings.genders.includes(item.category)
    );
  }

  items = items.filter((item) => item.price <= maxPrice);

  items.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return sortAB(computePrice(a), computePrice(b));
        break;
      case "price-desc":
        return sortAB(computePrice(b), computePrice(a));
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
