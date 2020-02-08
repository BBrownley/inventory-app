#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const fs = require("fs");
const path = require("path");

const hashStream = require("hash-stream")

var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')
var Manufacturer = require('./models/manufacturer')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];

mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let categories = [];
let items = [];
let manufacturers = [];

function manufacturerCreate(name, year_established, imagePath, callback) {

    const manufacturerDetail = { name };

    if (year_established) {
        manufacturerDetail.year_established = year_established;
    }

    hashStream(imagePath, "sha256").then((buf) => {
        manufacturerDetail.image = buf.toString("hex");
    })
    .then(() => {
        const manufacturer = new Manufacturer(manufacturerDetail);
        manufacturer.save((err) => {
            if (err) {
                callback(err, null); // Error, no result
                return;
            } else {
                console.log("New Manufacturer: " + manufacturer);
                manufacturers.push(manufacturer);
                callback(null, manufacturer); // No error (null), result
            }
        })
    }) 
    .catch(err => {
        console.error(err);
    })

}

function categoryCreate(name, imagePath, callback) {

    const categoryDetail = { name };

    hashStream(imagePath, "sha256").then((buf) => {
        categoryDetail.image = buf.toString("hex");
    })
    .then(() => {
        const category = new Category(categoryDetail);
        category.save((err) => {
            if (err) {
                callback(err, null); // Error, no result
                return;
            } else {
                console.log("New category: " + category);
                categories.push(category);
                callback(null, category); // No error (null), result
            }
        })
    }) 
    .catch(err => {
        console.error(err);
    })

}

function itemCreate(category, manufacturer, model, description, price, stock, imagePath, callback) {

    const itemDetail = {category, manufacturer, model, description, price, stock};

    hashStream(imagePath, "sha256").then((buf) => {
        itemDetail.image = buf.toString("hex");
    })
    .then(() => {
        const item = new Item(itemDetail);
        item.save((err) => {
            if (err) {
                callback(err, null); // Error, no result
                return;
            } else {
                console.log("New item: " + manufacturer);
                items.push(item);
                callback(null, item); // No error (null), result
            }
        })
    }) 
    .catch(err => {
        console.error(err);
    })

}

function createCategoriesManufacturers(callback) {
    async.series([
        function(callback) {
            categoryCreate("Keyboards", path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            categoryCreate("Laptops", path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            categoryCreate("Headsets", path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            manufacturerCreate("Razer", "2005", path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            manufacturerCreate("Logitech", "1981", path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            manufacturerCreate("SteelSeries", "2001", path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        }
    ], callback)
}

function createItems(callback) {
    async.parallel([
        function(callback) {
            itemCreate(categories[0], manufacturers[0], "Blackwidow", "A Mechanical Keyboard with clicky tactile switches", 4000, 12, path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            itemCreate(categories[0], manufacturers[1], "G613", "A wireless mechanical keyboard optimal for both typists and gamers", 6000, 3, path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            itemCreate(categories[0], manufacturers[1], "G513", "OMG RGB :O", 10000, 2, path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            itemCreate(categories[1], manufacturers[0], "Blade 15", "A gaming laptop with... You guessed it... RGB lighting", 140000, 0, path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            itemCreate(categories[2], manufacturers[1], "G933 Artemis", "Wireless gaming headset", 15000, 12, path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            itemCreate(categories[2], manufacturers[2], "Arctis 9X", "Noise cancelling gaming headset that's also wireless", 20000, 45, path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            itemCreate(categories[2], manufacturers[2], "Test item 1", "Test item 1 description", 2000, 5, path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            itemCreate(categories[2], manufacturers[2], "Test item 2", "Test item 2 description", 2000, 0, path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        }
    ], callback)
}

// --------------------------------------------------------------------

async.series([
    createCategoriesManufacturers,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err.message);
    } else {
        console.log("Results: " + results);
    }

    // All done, disconnect from database
    mongoose.connection.close();
});



