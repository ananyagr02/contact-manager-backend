const express = require("express");
const router = express.Router();
const {getContacts, getContact, updateContact, deleteContact, createContact} = require('../controllers/contactController')
// configuring all routes on router
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route('/').get(getContacts).post(createContact);
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);
// to validate token on all routes
module.exports = router; 