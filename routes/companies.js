"use strict"
const express = require("express");

const { NotFoundError } = require("../expressError");

const router = new express.Router();
const db = require("../db");

/* multi line for top doc strings  */
//GET / companies
// TODO check this docstring 
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
  if (!company) throw new NotFoundError(`Not found: ${code}`);
  return res.json({ company });
})



//POST /companies
// Needs to be given JSON like: {code, name, description}
// Returns obj of new company: {company: {code, name, description}}
router.post("/", async function (req, res, next) {
  const { code, name, description } = req.body;
  const results = await db.query(
    `INSERT INTO companies (code, name, description)
        VALUES ($1, $2, $3)
        RETURNING code, name, description`, [code, name, description],
  );
  const company = results.rows[0];
  if (!company) throw new NotFoundError(`Not found: `); // TODO think about more accurate err
  return res.status(201).json({ company })
});

// TODO test what is returned in result.rows when successful result but NO RETURNING line


// PUT /companies/[code]
// Needs to be given JSON like: {name, description}
// Returns update company object: {company: {code, name, description}}

router.put("/:code", async function (req, res, next) {
  const { name, description } = req.body;
  const code = req.params.code;
  const results = await db.query(
    `UPDATE companies
          SET name = $1,
          description = $2
          WHERE code = $3
          RETURNING code, name, description`,
    [name, description, code]
  );
  const company = results.rows[0];
  // if no company found return not found error 
  if (!company) throw new NotFoundError(`Not found: ${code}`);

  return res.json({ company });
});



// DELETE /companies/[code] - Should return 404 if company cannot be found.
// Returns {status: "deleted"}

// TODO 
router.delete("/:code", async function (req, res, next) {
  const code = req.params.code;

  const results = await db.query(
    `DELETE FROM companies 
    WHERE code = $1
    RETURNING code`, [code]
    );
    console.log("results rows ====>", results.rows);
    const company = results.rows[0];
    // if no company found return not found error 
    if (!company) throw new NotFoundError(`Not found: ${code}`); // TODO specify this err

  return res.json({ status: "deleted" });
});



module.exports = router;