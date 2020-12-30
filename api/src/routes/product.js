const server = require('express').Router();
const { Sequelize } = require('sequelize');
const { Product, Category, Strain } = require('../db.js');
const categoryRouter = require('./category.js');

server.use('/category', categoryRouter);

//Listado de todos los Productos

server.get('/', (req, res, next) => {
   Product.findAll().then((products) => {
    res.send(products);
  });
});

//Devuelve un producto según el ID

server.get('/:id', (req, res) => {
  let { id } = req.params;
  if (!id) return res.status(404).send('No existe el producto');
  Product.findByPk(id).then((product) => {
    return res.status(200).send(product);
  });
});

//Filtrar productos por categoría

server.get('/productsByCategory/:category', (req, res) => {
  let { category } = req.params;
  
  if (!category) return res.status(404).send('Se necesita categoría');

  Category.findAll({
    where: { taste: category },
    include: { model: Product },
  }).then((s) => {
    res.json(s);
  });
});

//Modificar Producto

server.put('/:id', async (req, res) => {
  let { id } = req.params;
  let {
    name,
    price,
    description,
    yearHarvest,
    image,
    stock,
    categories,
    strain,
  } = req.body;
  if (!id) return res.status(400).send('El producto no existe');
  try {
    const wineToUpdate = await Product.findByPk(id);
    const updatedWine = await wineToUpdate.update(
      {
        name,
        price,
        description,
        yearHarvest,
        image,
        stock,
        strainId: strain,
      },
      {
        returning: true,
        plain: true,
      }
    );

    if (categories && categories.length > 0) {
      categories = categories.filter(c => c !== '')
      await updatedWine.setCategories([...categories]);
    }
    return res.status(200).send(updatedWine);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

//Eliminar un Producto

server.delete('/:id', async (req, res) => {
  let { id } = req.params;
  let wine;
  let categories;
  
  if (!id) return res.status(400).send('No se recibio ID');
  try {
    wine = await Product.findOne({ where: { id } });
    categories = await Category.findAll({
      include: { model: Product, where: { id } },
    });
    const payload = {
      wine,
      categories,
    };
    await wine.destroy();
    return res.status(200).send(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).send('No se pudo borrar el producto');
  }
});

//Borrar categoría de un producto

server.delete('/:idProduct/category/:idCategory', (req, res) => {
  const { idProduct, idCategory } = req.params;
 
  if (!idProduct || idCategory)
    return res.status(400).send('No existe el producto o la categoría');

  Product.findOne({
    where: { id: idProduct },
  })
    .then((prod) => {
      prod.removeCategory([idCategory]);
      res.sendStatus(200);
    })
    .catch((e) => console.log(e));
});

//Crear un nuevo Producto

server.post('/', async (req, res) => {
  let {
    name,
    price,
    description,
    yearHarvest,
    image,
    stock,
    categories,
    strain,
  } = req.body;

  try {
    let product = await Product.create({
      name,
      price,
      description,
      yearHarvest,
      image,
      stock,
      strainId: strain,
    });
    await categories.forEach((categoryId) => {
      Category.findByPk(categoryId).then((category) =>
        product.addCategory(category)
      );
    });
    return res.status(200).send(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

//Agregar categoría a un Producto

server.post('/:idProduct/category', (req, res) => {
  let { idProduct } = req.params;
  let { Category } = req.body;

  if (!idProduct || Category)
    return res.status(400).send('No se puede agregar la categoría');

  Product.findByPk(idProduct).then((product) => {
    product.addCategory(Category);
    return res.send('Se agregó la categoría');
  });
});

module.exports = server;
