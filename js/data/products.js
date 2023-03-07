const url = "/data/products.json";

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
  const products = data.products;
  const x = 0;
  const y = products.length < max ? products.length : max;
  const randomIndexes = [];
  for (let i = 0; i < max; i++) {
    let random = Math.floor(Math.random() * (y - x) + x);

    if (!randomIndexes.includes(random)) {
      randomIndexes.push(random);
    }
  }
  return products.filter((product) =>
    randomIndexes.includes(products.indexOf(product))
  );
}
