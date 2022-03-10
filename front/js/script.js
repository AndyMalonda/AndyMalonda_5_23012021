// Fetching des différents objets de l'API
async function init() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();
    displayData(data);
  } catch (error) {
    return console.log(error);
  }
}

// Affichage des produits
function displayData(data) {
  let content = "";
  for (let product of data) {
    content += `
    <a href="./product.html?id=${product._id}">
        <article>
            <img src="${product.imageUrl}" alt ="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
        </article>
    </a>
    `;
  }
  document.getElementById("items").innerHTML = content;
}

// Page flow
init();
