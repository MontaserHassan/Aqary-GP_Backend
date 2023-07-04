const Category = require('../models/categoryModel');
const Property = require('../models/propertyModel');
const { asyncFunction } = require('../middlewares/asyncHandler');



//////////////////////////////////// create category //////////////////////////////////////


const createCategory = asyncFunction(async (req, res) => {
    const category = await Category.create({ name: req.body.name });
    res.status(201).send(category);
});


//////////////////////////////////// get category ///////////////////////////////////////


const getCategoryById = asyncFunction(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw { status: 404, message: 'Category not found!' };
    res.status(200).send(category);
});


//////////////////////////////// get all categories //////////////////////////////////////


const getAllCategories = asyncFunction(async (req, res) => {
    const categories = await Category.find();
    res.status(200).send(categories);
});


//////////////////////////////////// update category ///////////////////////////////////////


const updateCategory = asyncFunction(async (req, res) => {
    const checkBeforeUpdating = await Category.findById(req.params.id);
    if (!checkBeforeUpdating) throw { status: 404, message: "Category can't update because NOT exists" };
    const updateCategory = await Category.findByIdAndUpdate({ _id: req.params.categoryId }, { name: req.body.name });
    if (!updateCategory) throw { status: 404, message: "Category can't update" };
    res.status(200).send(updateCategory);
});


//////////////////////////////////// delete category ///////////////////////////////////////


const deleteCategory = asyncFunction(async (req, res) => {
    const checkBeforeDeleting = await Category.findById(req.params.categoryId);
    if (!checkBeforeDeleting) throw { status: 404, message: "Category can't delete because NOT exists" };
    const hasProperties = await Property.exists({ categoryId: req.params.categoryId });
    if (hasProperties) throw { status: 400, message: "Cannot delete category with associated properties" };
    const deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);
    res.status(200).send(deletedCategory);
});


//////////////////////////////////// get properties by category ///////////////////////////////////////


const getPropertiesByCategoryId = asyncFunction(async (req, res) => {
    const category = await Category.findById(req.params.categoryId);
    if (!category) throw { status: 404, message: "Category doesn't exist" };
    const properties = await Property.find({ categoryId: req.params.categoryId });
    res.status(200).send(properties);
});



module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    getPropertiesByCategoryId
};