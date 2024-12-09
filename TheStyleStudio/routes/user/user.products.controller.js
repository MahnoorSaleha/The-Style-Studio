const express = require('express');
const router = express.Router();
let Product = require("../../models/products.model")
let Category = require("../../models/categories.model");

router.get('/clothes/:page?', async (req, res) => {
  try {

    let page = req.params.page;
    page = page ? Number(page) : 1;
    let pageSize = 12;
    let totalRecords = await Product.countDocuments();
    let totalPages = Math.ceil(totalRecords / pageSize);
    const category = await Category.findOne({ name: 'Clothes' });


    const clothes = await Product.find({ category: category._id })
    .limit(pageSize)
    .skip((page - 1) * pageSize);

    // Pass clothes to the view
    res.render('clothes', { 
      clothes: clothes,
      page:page,
      pageSize:pageSize,
      totalPages:totalPages,
      totalRecords:totalRecords,
     });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
});

router.get('/jewellery', async (req, res) => {
  try {
    // Find Jewellery category by name
    const jewelleryCategory = await Category.findOne({ name: 'Jewellery' });

    if (!jewelleryCategory) {
      return res.status(404).send('Jewelry category not found.');
    }

    // Fetch all products under the Jewelry category
    const products = await Product.find({ category: jewelleryCategory._id });

    // Render the Jewellery page
    res.render('jewellery', { 
      layout: 'layout', 
      pageTitle: 'Jewellery', 
      products: products, 
      totalProducts: products.length 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading Jewellery page');
  }
});

module.exports = router;