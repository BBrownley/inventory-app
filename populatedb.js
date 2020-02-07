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

    const manufacturerDetail = { name, image: { data: null, contentType: null } };

    if (year_established) {
        manufacturerDetail.year_established = year_established;
    }

    if (imagePath) {
        manufacturerDetail.image.data = Buffer.from(fs.readFileSync(imagePath));
        manufacturerDetail.image.contentType = "image/png";
    } else { // Give it a placeholder image instead
        manufacturerDetail.image.data = Buffer.from(fs.readFileSync("express-inventory-application/images/placeholder.png"));
        manufacturerDetail.image.contentType = "image/png";
    }

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

}

function categoryCreate(name, imagePath, callback) {

    const categoryDetail = { name, image: { data: null, contentType: null } };

    if (imagePath) {
        categoryDetail.image.data = Buffer.from(fs.readFileSync(imagePath));
        categoryDetail.image.contentType = "image/png";
    } else {
        categoryDetail.image.data = Buffer.from(fs.readFileSync("express-inventory-application/images/placeholder.png"));
        categoryDetail.image.contentType = "image/png";
    }

    const category = new Category(categoryDetail);

    category.save((err) => {
        if (err) {
            callback(err, null);
            return;
        } else {
            console.log("New category: " + category);
            categories.push(category);
            callback(null, category);
        }
    })

}

function itemCreate(category, manufacturer, model, description, price, stock, imagePath, callback) {

    const itemDetail = {category, manufacturer, model, description, price, stock, image: { data: null, contentType: null }};

    if (imagePath) {
        itemDetail.image.data = Buffer.from(fs.readFileSync(imagePath));
        itemDetail.image.contentType = "image/png";
    } else {
        itemDetail.image.data = Buffer.from(fs.readFileSync("express-inventory-application/images/placeholder.png"));
        itemDetail.image.contentType = "image/png";
    }

    const item = new Item(itemDetail);

    item.save((err) => {
        if (err) {
            callback(err, null);
            return;
        } else {
            console.log("New item: " + item);
            items.push(item);
            callback(null, item)
        }
    })

}

function createCategoriesManufacturers(callback) {
    async.series([
        function(callback) {
            categoryCreate("Keyboards", path.resolve(__dirname, "../express-inventory-application/images/categoryImages/keyboard.png"), callback)
        },
        function(callback) {
            categoryCreate("Laptops", "express-inventory-application/images/categoryImages/laptop.png", callback)
        },
        function(callback) {
            categoryCreate("Headsets", "express-inventory-application/images/categoryImages/gamingheadset.png", callback)
        },
        function(callback) {
            manufacturerCreate("Razer", "2005", "express-inventory-application/images/manufacturerImages/razer.png", callback)
        },
        function(callback) {
            manufacturerCreate("Logitech", "1981", "express-inventory-application/images/manufacturerImages/logitech.png", callback)
        },
        function(callback) {
            manufacturerCreate("SteelSeries", "2001", false, callback)
        }
    ], callback)
}

function createItems(callback) {
    async.parallel([
        function(callback) {
            itemCreate(categories[0], manufacturers[0], "Blackwidow", "A Mechanical Keyboard with clicky tactile switches", 4000, 12, "express-inventory-application/images/itemImages/razer-blackwidow.png", callback)
        },
        function(callback) {
            itemCreate(categories[0], manufacturers[1], "G613", "A wireless mechanical keyboard optimal for both typists and gamers", 6000, 3, false, callback)
        },
        function(callback) {
            itemCreate(categories[0], manufacturers[1], "G513", "OMG RGB :O", 10000, 2, false, callback)
        },
        function(callback) {
            itemCreate(categories[1], manufacturers[0], "Blade 15", "A gaming laptop with... You guessed it... RGB lighting", 140000, 0, "express-inventory-application/images/itemImages/razer-blade.png", callback)
        },
        function(callback) {
            itemCreate(categories[2], manufacturers[1], "G933 Artemis", "Wireless gaming headset", 15000, 12, false, callback)
        },
        function(callback) {
            itemCreate(categories[2], manufacturers[2], "Arctis 9X", "Noise cancelling gaming headset that's also wireless", 20000, 45, false, callback)
        },
        function(callback) {
            itemCreate(categories[2], manufacturers[2], "Test item 1", "Test item 1 description", 2000, 5, false, callback)
        },
        function(callback) {
            itemCreate(categories[2], manufacturers[2], "Test item 2", "Test item 2 description", 2000, 0, false, callback)
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
        console.log('FINAL ERR: '+err);
    } else {
        console.log("Results: " + results);
    }

    // All done, disconnect from database
    mongoose.connection.close();
});



