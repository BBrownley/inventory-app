const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema(
    {
        item: {type: Schema.Types.ObjectId, ref: "Item", required: true},
        status: {type: String, required: true, enum: ["Available", "Sold"], default: "Available"},
        sold_out_when: {type: Date}
    }
)

ItemInstanceSchema.virtual("url").get(function() {
    return `storage/iteminstance/${this._id}`
})

module.exports = mongoose.model("Item", ItemInstanceSchema);