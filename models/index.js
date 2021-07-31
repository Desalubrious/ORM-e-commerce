// Import models
const Product = require('./product');
const Category = require('./category');
const Tag = require('./tag');
const ProductTag = require('./producttag');

Product.belongsTo(Category);
Category.hasMany(Product);
Product.belongsToMany(Tag, { through: ProductTag ,foreignKey: 'tag_id'});
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: 'tag_id'});

module.exports = { Product, Category, Tag, ProductTag };