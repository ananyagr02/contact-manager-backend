// controller contains all logic for request,response
// Creating Contact Controller for Contacts CRUD Operations 

const asyncHandler = require('express-async-handler')
const Contact = require("../models/contactModel");
// @desc GET all contacts
//@route GET /api/contacts
//@access private       
// WE will use mongoDB and it returns promises, hence we use async await   
// we also require a middleware which is an express async handler which is used handle exceptions inside our async express routes and passes the exceptions to error handler
const getContacts = asyncHandler(async(req, res) => {
    // const contacts = await Contact.find();
    console.log("hi");
    res.status(200).json(contacts);
});


// @desc create new contact
//@route POST /api/contacts
//@access private       
// we will accept data from client to create new contact -> new contact's data is passed in the body of the request of thunder client
// when you accept data from client to server(here data from client is sent in body of POST request), we need to use a body parser
// so that we can parse the stream of data for any threats -> hence we use middleware for JSON object
const createContact = asyncHandler(async(req, res) => {
    const contacts = await Contact.find({user_id: req.user.id})
    console.log('The request body is :', req.body);
    // now we need to identify that what all is acceptable in body and what is not -> like an empty body is not acceptable
    // hence we destructure the body first
    // ERROR HANDLING
    const {name, email, phone} = req.body;
    if( !name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory");   // this returns a response in HTML format so for converting the response to JSON format, for that we need to create a custom middleware -> which reads the request body and responds in json format
    }
    else{
        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id,
        });
        res.status(201).json(contact);

    }


});

// @desc get contact for an id
//@route GET /api/contacts/:id
//@access private       
const getContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }
    res.status(200).json(contact);
});

// @desc update contact
//@route PUT /api/contacts/:id
//@access public       
const updateContact = asyncHandler(async(req, res) => {
    const contact = Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }
    if(contact.user_id.toString() != req.user.id){
        // different user trying to update contact of another user
    res.status(403);
    throw new Error("user doesn't have permission to update other user's contact");
        }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id ,
        req.body,
        {new: true}// query option
        );
    res.status(200).json(updatedContact);
});

// @desc delete contact
//@route DEL /api/contacts/:id
//@access private       
const deleteContact = asyncHandler(async(req, res) => { const contact = Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }
    if(contact.user_id.toString() != req.user.id){
        // different user trying to update contact of another user
    res.status(403);
    throw new Error("user doesn't have permission to delete other user's contact");
        }
    await Contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
});
module.exports = {getContacts, getContact, updateContact, deleteContact, createContact};
// contacts are stored in database as documents in the collections 
// once the user logs in they can manage their access token