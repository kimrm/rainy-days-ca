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
