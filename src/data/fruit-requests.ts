import { memoize } from "lodash";

export const fetchFruitPicture = async (url) => {
  if (!url) {
    console.error("No URL provided to fetchFruitPicture");
    return undefined;
  }

  const photoURL = `https://api.predic8.de:443${url}/photo`;

  // const failingPhotoURL = `https://api.predic8.de:443/shop/products/18/photo`;

  return await fetch(photoURL, {
    method: "GET",
  })
    .then((res) => {
      if (res.ok) {
        return res.blob();
      }
    })
    .catch((e) => console.error(e));
};

export const fetchFruitUrl = async () => {
  const allFruit = await fetch("https://api.predic8.de:443/shop/products/", {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((e) => console.error(e));
  return allFruit?.products?.[
    Math.floor(Math.random() * allFruit.products.length)
  ]?.product_url;
};
