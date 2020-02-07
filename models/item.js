const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
    {
        category: [{type: Schema.Types.ObjectId, ref:"Category"}],
        manufacturer: {type: Schema.Types.ObjectId, ref: "Manufacturer", required: true},
        model: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true}, // Price in cents
        stock: {type: Number, required: true},
        image: {type: Buffer, contentType: String} // Using placeholder image if not specified
    }
)

// Virtual for the item's URL
ItemSchema.virtual("url").get(function() {
    return `storage/item/${this._id}`
})

// Virtual for the price of the item, formatted in dollars/cents
ItemSchema.virtual("price_formatted").get(function() {
    return this.price/100;
})

module.exports = mongoose.model("Item", ItemSchema);