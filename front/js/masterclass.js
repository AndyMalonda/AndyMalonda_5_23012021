const products = [{
        id: 1,
        options: ["option 1", "option 2", "option 3"],
        name: "Produit 1"
    },
    {
        id: 2,
        options: ["option 1", "option 2", "option 3"],
        name: "Produit 2"
    },
    {
        id: 3,
        options: ["option 1", "option 2", "option 3"],
        name: "Produit 3"
    }
];

function getProductIndexInBasket(productToAdd, existingProducts) {
    const existingIndex = existingProducts.findIndex(() => {
        return (product.id == productToAdd.id && product.option == productToAdd.option)
    })
}

function addProductInBasket(product, selectValue) {
    let storedObjet = localStorage.kanapApp;
    if (!storedObject) {
        storedObjet = [];
    } else {
        storedObjet = JSON.parse(storedObjet);
    }

    const existingProductIndex = getProductIndexInBasket(product, storedObjet);
    if (existingProductIndex === -1) {
        storedObjet.push(product)
    }
    storedObject[existingProductIndex].quantity = +Number(selectedQuantity);
}

localStorage.kanapApp = JSON.stringify(storedObject);

const products = localStorage.kanapApp && JSON.parse(localStorage.kanapApp)