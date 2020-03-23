const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", { useUnifiedTopology: true , useNewUrlParser: true });

const schema ={
	name :{
		type: String,
		required: [true,"Please check your data entry"]
	},
	rating:{
		type: Number,
		min:1,
		max:10
	},
	review: String
}
const fruitSchema = new mongoose.Schema(schema);

const Fruit = mongoose.model("Fruit",fruitSchema);

// const fruit = new Fruit({
// 	name : "Apple",
// 	score :8,
// 	review :"Great fruit"
// });
//
// // fruit.save();
//
// const orange = new Fruit({
// 	name: "Orange",
// 	score: 4,
// 	review:"Too sour"
// });
//
// const kiwi = new Fruit({
// 	name: "kiwi",
// 	score: 3,
// 	review:"The best fruit"
// });
//
// Fruit.insertMany([orange,kiwi],function(err){
// 	if(err){
// 		console.log(err);
// 	}else console.log("Successfully saved all the Fruits");
// });

Fruit.find(function(err,fruits){
	if (err) {
		console.log(err);
	} else {

		fruits.forEach(function(fruit){
			console.log(fruit.name);
		});
	}
});

Fruit.updateOne({name:"kiwi"}, {name: "Kiwi" } , function(err){
	if (err) {
		console.log(err);
	} else {
	  console.log( "Successfully Updated");
	}
});

Fruit.deleteOne({name:"Kiwi"},function(err){
	mongoose.connection.close();
	if (err) {
		console.log(err);
	} else {
		console.log("Deleted Successfully");
	}
});
