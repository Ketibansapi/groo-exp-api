const express = require ('express');
const mongoose = require ('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth/auth');

// Load Item models                                        
require('../models/Item');
const Item = mongoose.model('items');

// Item Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Item.find({user: req.user.id})
    .sort({date:'desc'})
    .then(items => {
      res.render('items/index', {
        items:items
      });
    });
});

// Add Item Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('items/add');
});

// Edit Item Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Item.findOne({
    _id: req.params.id
  })
  .then(item => {
    if(item.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/items');
    } else {
      res.render('items/edit', {
        item:item
      });
    }
    
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.name){
    errors.push({text:'Please add a name'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }
  if(!req.body.brand){
    errors.push({text:'Please add some brand'});
  }
  if(!req.body.price){
    errors.push({text:'Please add some price'});
  }
  if(!req.body.quantity){
    errors.push({text:'Please add some quantity'});
  }

  if(errors.length > 0){
    res.render('items/add', {
      errors: errors,
      name: req.body.name,
      details: req.body.details,
      brand: req.body.brand,
      price: req.body.price,
      quantity: req.body.quantity
    });
  } else {
  	const newUser ={
  		name: req.body.name,
      details: req.body.details,
      brand: req.body.brand,
      price: req.body.price,
      quantity: req.body.quantity,
      user: req.user.id
  	}
    new Item(newUser)
    .save()
    .then(item => {
    	req.flash('success_msg', 'Items added');
    	res.redirect('/items');
    })
  }
});

//Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
	Item.findOne ({
		_id: req.params.id
	})
	.then(item => {
		//New values
		item.name = req.body.name;
    item.details = req.body.details;
    item.brand = req.body.brand;
    item.price = req.body.price;
    item.quantity = req.body.quantity;
		
		item.save()
			.then(item => {
				req.flash('success_msg', 'Items updated');
				res.redirect('/items');
			})
	});
});

//Delete Item
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Item.remove({_id: req.params.id})
	.then(() => {
		req.flash('success_msg', 'Items removed');
		res.redirect('/items');
	});
});

module.exports = router;