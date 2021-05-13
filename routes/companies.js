const express = require("express");

const router = new express.Router();
const db = require("../db.js");



module.exports = router;

//GET / companies
// returns  list of companies, like {companies: [{code, name}, ...]}



//GET/companies/[code] 
// Return obj of company: {company: {code, name, description}}



//POST /companies
// Returns obj of new company: {company: {code, name, description}}



//PUT /companies/[code]
// Returns update company object: {company: {code, name, description}}



//DELETE /companies/[code]
// Returns {status: "deleted"}

