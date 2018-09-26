const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

// use multer for enctype on input form for checking if corret input
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
}

exports.homePage = (req, res) => {
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    // check if no new file to resize
    if (!req.file) {
        next(); // skip to next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // now resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // once resized photo is written to filesystem keep going!
    next();
};

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/stores/${store.slug}`);
};

exports.getStores = async (req, res) => {
    // query database for all stores and show list
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
}

exports.editStore = async (req, res) => {
    // find store given id
    const store = await Store.findOne({ _id: req.params.id });
    // confirm they are owner of the store

    // render out the edit form
    res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
    // set the location data to be a point
    req.body.location.type = 'Point';
    // fins and update store
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true, // return new store instead of old store
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
    // redirect and tell it updated
};

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug });
    if(!store) return next(); // if no store 404
    res.render('store', { store, title: store.name });
};

exports.getStoresByTag = async (req, res) => {
    // dont await individually, await promise.all to get all at once
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
    
    res.render('tag', { tags, title: 'Tags', tag, stores });
};