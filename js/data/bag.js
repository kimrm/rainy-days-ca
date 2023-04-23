export function countItemsInBag() {
  const storedBag = localStorage.getItem("bag")
    ? localStorage.getItem("bag")
    : "[]";
  let bag = JSON.parse(storedBag);
  let items = 0;
  bag.forEach((element) => {
    items += parseInt(element.amount);
  });
  return items;
}

export function removeItemFromBag(item) {
  const storedBag = localStorage.getItem("bag")
    ? localStorage.getItem("bag")
    : "[]";
  let bag = JSON.parse(storedBag);
  bag = bag.filter(
    (element) => element.item !== item.item_number || element.size !== item.size
  );

  localStorage.setItem("bag", JSON.stringify(bag));
}

export function clearBag() {
  localStorage.removeItem("bag");
}

export function getBagTotal() {
  const storedBag = localStorage.getItem("bag")
    ? localStorage.getItem("bag")
    : "[]";
  let bag = JSON.parse(storedBag);
  let total = 0;
  bag.forEach((element) => {
    total += parseInt(element.amount) * parseInt(element.price);
  });

  return total;
}

export function getBagItems() {
  const bagItems = JSON.parse(localStorage.getItem("bag")) || [];
  return bagItems;
}

export function addToBag(itemNumber, selectedSize, amount, price) {
  const storedBag = localStorage.getItem("bag")
    ? localStorage.getItem("bag")
    : "[]";
  let bag = JSON.parse(storedBag);
  let itemExists = false;
  bag = bag.map((item) => {
    if (item.item === itemNumber && item.size === selectedSize) {
      item.amount = parseInt(item.amount) + parseInt(amount);
      itemExists = true;
    }
    return item;
  });
  if (!itemExists) {
    bag.push({
      item: itemNumber,
      size: selectedSize,
      amount: parseInt(amount),
      price: price,
    });
  }

  localStorage.setItem("bag", JSON.stringify(bag));

  let items = 0;
  bag.forEach((element) => {
    items += parseInt(element.amount);
  });
  return items;
}
