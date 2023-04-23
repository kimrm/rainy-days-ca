const defaultFilterSettings = {
  genders: [],
  sortMode: "relevance",
  maxPrice: 4000,
};

export function loadFilter() {
  const storedFilterSettings = JSON.parse(
    localStorage.getItem("filterSettings")
  );
  return storedFilterSettings ? storedFilterSettings : defaultFilterSettings;
}

export function saveFilter(filterSettings) {
  localStorage.setItem("filterSettings", JSON.stringify(filterSettings));
}

export function filter(products) {
  const filterSettings = loadFilter();
  const maxPrice = filterSettings.maxPrice;
  const sort = filterSettings.sortMode;

  let items = products;

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
