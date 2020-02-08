const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema(
    {
        name: {type: String, required: true},
        year_established: {type: Number},
        image: {type: Schema.Types.Buffer, contentType: String} // Using placeholder image if not specified
    }
)

ManufacturerSchema.virtual("url").get(function() {
    return `storage/manufacturer/${this._id}`;
})

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);