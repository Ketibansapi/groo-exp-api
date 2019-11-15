const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name:{
		type: String,
		required: true
	},
	details: {
		type: String,
		required: true
    },
    brand: {
		type: String
    },
    price: {
		type: Number
    },
    quantity: {
		type: Number
	},
	user:{
        type: String,
        required:true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('items', ItemSchema);