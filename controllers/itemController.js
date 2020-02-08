const express = require("express");

// Get index page listing useful information about the storage
exports.index = (req, res, next) => {
    res.send("Not implemented: index")
}

// Get list of all items
exports.item_list = (req, res, next) => {
    res.send("Not implemented: item_list")
}

// Get details about a specific item
exports.item_detail = (req, res, next) => {
    res.send("Not implemented: item_detail")
}

// Gets Item create form
exports.item_create_get = (req, res, next) => {
    res.send("Not implemented: item_create_get")
}

// Handles info from Item create form on Post
exports.item_create_post = (req, res, next) => {
    res.send("Not implemented: item_create_post")
}

// Gets Item update form
exports.item_update_get = (req, res, next) => {
    res.send("Not implemented: item_update_get")
}

// Handle info from Item update form on Post
exports.item_update_post = (req, res, next) => {
    res.send("Not implemented: item_update_post")
}

// Gets Item delete form
exports.item_delete_get = (req, res, next) => {
    res.send("Not implemented: item_delete_get")
}

// Handle info from Item delete form on Post
exports.item_delete_post = (req, res, next) => {
    res.send("Not implemented: item_delte_post")
}
