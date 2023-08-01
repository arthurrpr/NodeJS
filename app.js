const express = require("express");
const { randomUUID } = require("crypto");
const { request } = require("http");
const fs = require("fs");

const app = express();

app.use(express.json())

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err) {
        console.log(err);
    }else {
        products = JSON.parse(data);
    }
});

/**
 * POST => Inserir um dado
 * GET => Buscar um/mais dado
 * PUT => Alterar um dado
 * DELETE => Remover um dado
 */

/**
 * Infomações podem vir por:
 * Body => Sempre que eu quiser enviar dados para a minha aplicação
 * Parms => Parâmetro de rota EX: /product/236498769832749
 * Query => Fazem parte da rota mas não são obrigatórios EX: /product?id=3284789327498237
 */


//POST
app.post("/products", (request, response) => {
    //Nome e preço => name e price

    const {name, price} = request.body;

    const product = {
        name, 
        price,
        id: randomUUID(), 
    }

    products.push(product);

    productFile();

    return response.json(product);

});

//GET
app.get("/products", (request, response) => {
    return response.json(products);
});

app.get("/products/:id", (request, response) => {
    const {id} = request.params;
    const product = products.find(product => product.id === id);
    return response.json(product);
});

//PUT
app.put("/products/:id", (request, response) => {
    const {id} = request.params;
    const {name, price} = request.body;

    const productIndex = products.findIndex(product => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price,
    };

    productFile();

    return response.json({message: "Produto alterado com sucesso"});
});

//DELETE
app.delete("/products/:id", (request, response) => {
    const {id} = request.params;
    const productIndex = products.findIndex(product => product.id === id);

    products.splice(productIndex, 1);

    productFile();

    return response.json({message: "Produto removido com sucesso"})
})

function productFile() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if(err){
            console.log(err);
        }else {
            console.log("Produto inserido");
        }
    });
}

app.listen(4002, () => console.log("Servidor está rodando na porta 4002"));
