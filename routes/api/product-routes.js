const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Get all products
router.get('/', (req, res) => {
    Product.findAll({
        attributes: ['id','product_name','price','stock', 'category_id'],
        include: [
            {
            model: Category,
            attributes: ['id','category_name'],
        },
        {
            model: Tag,
            through: ProductTag,
            as: 'tags',
        },
        ],
})
    .then(dbProductData => res.json(dbProductData))
    .catch(err => res.status(500).json(err));
});

// Get a single product
router.get('/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
            model: Category,
            attributes: ['id','category_name'],
        },
        {
            model: Tag,
            through: ProductTag,
            as: 'tags',
        },
        ],
    })
    .then(dbProductData => res.json(dbProductData))
    .catch(err => res.status(500).json(err));
}
);

// Create a new product
router.post('/', (req, res) => {
    Product.create(req.body)
    .then((product) => {
        if(req.body.tagIds.length) {
            const productTagIDArr = req.body.tagIds.map(tagId => {
                return {
                    product_id: product.id,
                    tag_id: tagId,
                }
            }
            );
            return ProductTag.bulkCreate(productTagIDArr);
        }
    })
    .then(productTagIds => res.json(productTagIds))
    .catch(err => res.status(500).json(err));
});


// Update a product

router.put("/:id", (req, res) => {
    // update product data
    Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((product) => {
        return ProductTag.findAll({ where: { product_id: req.params.id } });
      })
      .then((productTags) => {
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
        //   run
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      .catch((err) => {
        res.status(400).json(err);
      });
  });

// Delete product by id
router.delete('/:id', (req, res) => {
    Product.destroy({
        where: {
            id: req.params.id
        },
    })
    .then(() => res.json({ message: 'Product deleted' }))
    .catch(err => res.status(500).json(err));
});
module.exports = router;



