"use strict";
const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");

/*GET /invoices
Return info on invoices: like {invoices: [{id, comp_code}, ...]} */
router.get("/", async function (req, res, next) {
  const results = await db.query(
    `SELECT id, comp_code, amt, paid, add_date, paid_date
    FROM invoices`);
  console.log("result object: ", results)
  const invoices = results.rows;
  return res.json({ invoices });
});


/*GET /invoices/[id] 
Returns {invoice: {id, amt, paid, add_date, paid_date, 
  company: {code, name, description}}*/
router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  const iResults = await db.query(
    `SELECT id, comp_code, amt, paid, add_date, paid_date
        FROM invoices
        WHERE id = $1`, [id]);
  console.log("invoce ----> ", iResults.rows[0])

  let invoice = iResults.rows[0];
  if (!invoice) throw new NotFoundError(`Not found invoice: ${id}`);
  let compCode = invoice.comp_code;
  console.log("compCode --->", compCode)

  const cResults = await db.query(
    `SELECT code, name, description
        FROM companies 
        WHERE code = $1`, [compCode]);
  console.log("cResult ---> ", cResults)
  invoice.company = cResults.rows[0];
  console.log("invoice object --->", invoice)
  return res.json({ invoice });
})

/*POST /invoices 
Needs to be passed in JSON body of: {comp_code, amt}
Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}*/
router.post("/", async function (req, res, next) {
  const { comp_code, amt } = req.body;

  const cResults = await db.query(
    `SELECT code, name, description
        FROM companies 
        WHERE code = $1`, [comp_code]);
  let company = cResults.rows[0];
  if (!company) throw new BadRequestError(`Company not found`);

  const results = await db.query(
    `INSERT INTO invoices (comp_code, amt)
        VALUES ($1, $2)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
    [comp_code, amt],
  );
  const invoice = results.rows[0];
  if (!invoice) throw new BadRequestError(`invalid request format`);
  return res.status(201).json({ invoice });
});


/*PUT /invoices/[id] Updates an invoice.
If invoice cannot be found, returns a 404.
 Needs to be passed in a JSON body of {amt}
 Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}*/


/* DELETE /invoices/[id] 
Deletes an invoice.
If invoice cannot be found, returns a 404
Returns: {status: "deleted"}
*/


/* GET /companies/[code]
Return obj of company: {company: {code, name, description, invoices: [id, ...]}} */



module.exports = router;
