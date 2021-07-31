const router = require('express').Router();
const { Tag, Product, ProductTag } = require("../../models");

// Find all tags
router.get('/', (req, res) => {
    Tag.findAll({
        attributes: ['id', 'tag_name'],
        include: [{
            model: Product,
            attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
            through: ProductTag,
            as: 'products',
        },
    ],
    }).then((dbTagData) => {
        res.json(dbTagData);
    }
    ).catch((err) => {
        res.json(err);
    }
    );
});

// Find a tag by id
router.get('/:id', (req, res) => {
    Tag.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: Product,
            attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
            through: ProductTag,
            as: 'products',
        },
    ],
    }).then((dbTagData) => {
        res.json(dbTagData);
    }
    ).catch((err) => {
        res.json(err);
    }
    );
}
);

// Create a tag
router.post('/', (req, res) => {
    Tag.create({
        tag_name: req.body.tag_name,

    }).then((dbTagData) => {
        res.json(dbTagData);
    }
    ).catch((err) => {
        res.json(err);
    }
    );
});

// Update a tag
router.put('/:id', (req, res) => {
    Tag.update(req.body, {
        where: {
            id: req.params.id
        },
    }).then((dbTagData) => {
        if (!dbTagData) {
            res.status(404).json({ message: 'No tag found!' });
            return;
        }
        res.json(dbTagData);
    }
    ).catch((err) => {
        res.json(err);
    }
    );
});


// Delete a tag
router.delete('/:id', (req, res) => {
    Tag.destroy({
        where: {
            id: req.params.id
        },
    }).then((dbTagData) => {
        if (!dbTagData) {
            res.status(404).json({ message: 'No tag found!' });
            return;
        }
        res.json(dbTagData);
    }
    ).catch((err) => {
        res.json(err);
    }
    );
}
);

module.exports = router;
