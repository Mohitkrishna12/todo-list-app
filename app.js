const express = require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost:27017/listdb",{useNewUrlParser:true});
const app=express();

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


const listSchema=new mongoose.Schema({
	name:String
});

const List=mongoose.model("List",listSchema);
const list1= new List({
	name:"brush teeth"
});
const list2= new List({
	name:"bathing"
});
const list3= new List({
	name:"breakfast"
});

const defaultItems=[list1,list2,list3];







app.get("/",function(req,res){
	var options={weekday: 'long', month: 'short', day: 'numeric'};
	var today=new Date();
	var currDay=today.getDay();
	var day=today.toLocaleDateString("en-US",options);

	
	List.find({},function(err,foundList){

		if(foundList.length===0){
			List.insertMany(defaultItems,function(err){
				if(err){
					console.log(err);
				}else{
					console.log('db updated sucessfull');
				}
			});
			res.redirect("/");

		}else{
			res.render("index",{todate:day,newItems:foundList});


		}
		
	})

	






});

app.post("/",function(req,res){
	const item=req.body.newItem;
	const itemx=new List({
		name:item
	});
	itemx.save();
	res.redirect("/");


});
app.post("/delete",function(req,res){
	const cbid=req.body.checkbox;
	List.findByIdAndRemove(cbid,function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/");
		}
	})
})



app.listen(3000,function(){

	console.log("server runing");
})
