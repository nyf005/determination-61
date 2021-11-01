const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require('../helpers/functions');
const Member = mongoose.model("members");

router.get("/", (req, res) => {
  res.render("index/welcome");
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Member.find({
  })
  .sort({nom : "asc"})
  .then(members => {
      res.render("index/dashboard", {
        members: members
      });
  });
});

module.exports = router;