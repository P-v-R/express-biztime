const express = require("express");

const router = new express.Router();
const db = require("../db");



module.exports = router;

//GET / companies
// returns  list of companies, like {companies: [{code, name}, ...]}
router.get("/", async function (req, res, next) {
  const results = await db.query(
    `SELECT code, name, description
    FROM companies`);
  console.log("result object: ", results)
  const companies = results.rows;
  return res.json({ companies });
})


//GET/companies/[code] 
// Return obj of company: {company: {code, name, description}}
router.get("/:code", async function (req, res, next) {
  const code = req.params.code;
  const results = await db.query(
    `SELECT code, name, description
             FROM companies
             WHERE code = $1`, [code]);
  let company = results.rows[0];
  return res.json({ company });
})



//POST /companies
// Returns obj of new company: {company: {code, name, description}}



//PUT /companies/[code]
// Returns update company object: {company: {code, name, description}}



//DELETE /companies/[code]
// Returns {status: "deleted"}

