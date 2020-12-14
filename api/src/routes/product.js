const server = require('express').Router();
const { Product, Category, User, Strain } = require('../db.js');
// const { Sequelize } = require('sequelize');

// [FLAVIO] SIEMPRE RETORNAR UN STATUS DE CUALQUIER METODO QUE SE LE HACE A LA API:
// PUEDE SER DE 3 maneras (desconozco si habra otra manera de hacerlo):
// 1. return res.status(XXX).send(`CON O SIN CONTENIDO)
// 2. return res.send(xxx,`CON O SON CONTENIDO`)
// 3. return res.sendStatus(XXX)
// Cualquiera de las formas es correcta, pero, res.status(XXX) NO DEVUELVE NADA -- OJO -- cambié el color del comentario por la demo

server.get('/', (req, res, next) => {
  console.log('GET a productos');
  Product.findAll()
    .then((products) => {
      res.send(products);
    })
    .catch(next);
});

server.get('/category', (req, res, next) => {
  console.log('GET a categorys');
  Category.findAll()
    .then((cat) => {
      console.log(cat);
      res.send(cat);
    })
    .catch(next);
});

server.get('/strain', (req, res, next) => {
  console.log('GET a strains');
  Strain.findAll()
    .then((strain) => {
      res.json(strain); //? json no me envia la data???
    })
    .catch(next);
});

server.get('/category/:nameCat', (req, res) => {
  let { nameCat } = req.params;

  console.log('entré a filtro por categoría');

  if (nameCat) {
    Category.findAll({
      where: {
        taste: nameCat,
      },
    }).then((cat) => {
      return res.send(cat);
    });
  } else {
    return res.status(404).send('No existe la categoría');
  }
});

server.get('/:id', (req, res) => {
  let { id } = req.params;

  console.log('entré a filtro por id');

  if (id) {
    Product.findByPk(id).then((product) => {
      return res.send(product);
    });
  } else {
    return res.status(404).send('No existe el producto');
  }
});

server.get('/ProductosPorCategoria/:categoria', (req, res) => {
  let { categoria } = req.params;

  if (categoria) {
    Category.findAll({
      where: { taste: categoria },
      include: { model: Product },
    }).then((s) => {
      res.json(s);
    });
    // Product.findByPk(categoria).then((product) => {
    //   return res.send(product);
    // });
  } else {
    return res.status(404).send('No existe el producto');
  }
});

server.get('/CategoriaProducto/:id', (req, res, next) => {
  let { id } = req.params;
  Category.findAll({
    include: { model: Product, where: { id } },
  })
    .then((cats) => {
      res.json(
        cats.map((t) => {
          return { id: t.id, taste: t.taste };
        })
      );
    })
    .catch(next);
});

server.put('/:id', (req, res) => {
  let { id } = req.params;
  let { name, price, description, yearHarvest, image, stock } = req.body;

  console.log('modifico producto');

  if (id) {
    Product.update(
      { name, price, description, yearHarvest, image, stock },
      { where: { id } }
    ).then(() => {
      return res.status(200).send('El producto ha sido actualizado');
    });
  } else {
    return res.status(400).send('El producto no existe');
  }
});

server.put('/category/:id', (req, res) => {
  let { id } = req.params;

  console.log('Modifico categoría');

  if (id) {
    Category.update({ taste }, { where: { id } }).then(() => {
      return res.status(200).send('Se ha modificado la categoría');
    });
  } else {
    return res.status(400).send('La categoría no existe');
  }
});

server.delete('/:id', (req, res) => {
  let { id } = req.params;

  console.log('elimino un producto');

  if (id) {
    Product.destroy({
      where: {
        id,
      },
    }).then(() => {
      console.log('destroy OK');
      return res.status(200).send(`Producto borrado ${id}`);
    });
  } else {
    return res.status(400).send('No se encontró el producto a eliminar');
  }
});

server.delete('/category/:id', (req, res) => {
  let { id } = req.params;

  console.log('entré a borrar categoría');

  if (id) {
    Category.destroy({
      where: {
        id,
      },
    }).then(() => {
      return res.send(200, `categoria borrad ${id}`);
    });
  } else {
    return res.status(400).send('No existe la categoría');
  }
});

// para borrar una categoría de un productooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
server.delete('/:idProducto/category/:idCategoria', (req, res) => {
  const { idProducto, idCategoria } = req.params;
  Product.findOne({
    where: { id: idProducto },
  })
    .then((prod) => {
      prod.removeCategory([idCategoria]);
      res.sendStatus(200);
    })
    .catch((e) => console.log(e));

});

server.post('/', (req, res, next) => {
  let prod;
  let {
    name,
    price,
    description,
    yearHarvest,
    image,
    stock,
    categories,
  } = req.body;
  console.log('entré a post ');
  Product.create({
    name,
    price,
    description,
    yearHarvest,
    image,
    stock,
  })
    .then((product) => {
      categories.forEach((categoryId) => {
        Category.findByPk(categoryId).then((category) =>
          product.addCategory(category)
        );
      });
      prod = product;
    })
    .then(() => res.status(200).send(prod))
    .catch(next);
});

server.post('/category', (req, res) => {
  let { taste } = req.body;

  console.log('Creo o modifico categoría');

  if (taste) {
    Category.findOrCreate({
      where: {
        taste,
      },
      defaults: {
        taste,
      },
    }).then((category) => {
      console.log('ENVIANDO CATEGORY', category);
      return res.status(200).send('La categoría ha sido creada');
    });
  } else {
    return res.status(400);
  }
});

server.post('/strain', (req, res) => {
  let { name, description, pairing, origin } = req.body;

  console.log('Creo o modifico cepa');

  if (name) {
    Strain.findOrCreate({
      where: {
        name,
      },
      defaults: {
        name,
        description,
        pairing,
        origin,
      },
    }).then((strain) => {
      return res.status(200).send('La cepa ha sido creada');
    });
  } else {
    return res.status(400);
  }
});

// server.post('/:idProduct/category/:idCategory', (req, res) => {
//   let { idProduct, idCategory } = req.params;

//   console.log('actualizo categoría de producto');

//   if (idProduct && idCategory) {
//     Product.findByPk(idProduct).then((product) => {
//       product.idCategory = idCategory;
//       return res.send('Se actualizó la categoría');
//     });
//   } else {
//     return res.status(400);
//   }
// });

server.post('/:idProduct/category', (req, res) => {
  let { idProduct } = req.params;
  let { Category } = req.body;

  console.log('actualizo categoría de producto');

  if (idProduct && Category) {
    Product.findByPk(idProduct).then((product) => {
      product.addCategory(Category);
      return res.send('Se actualizó la categoría');
    });
  } else {
    return res.status(400);
  }
});

module.exports = server;
