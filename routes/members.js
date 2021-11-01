const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { ensureAuthenticated } = require('../helpers/functions');
const Member = mongoose.model("members");

//Member Identification Form
router.get("/identification", (req, res) => {
  res.render("members/identification");
});

//Member Identification Process
router.post("/identification", (req, res) => {
  Member.findOne({
    matricule: req.body.matricule
  })
    .then(member => {
      if (member.nom !== req.body.lastName.toUpperCase()) {
        req.flash("errors_msg", "Le nom ne correspond pas au matricule");
        res.redirect("/members/identification");
      } else {
        if (!member.password) {
          if (member.admin === true) {
            res.render("members/register", {
              member: member,
              admin: member.admin
            });
          } else {  
            res.render("members/register", {
              member: member
            });
          }
        } else {
          req.flash(
            "errors_msg",
            "Vous êtes déjà identifié. Connectez vous avec votre mot de passe."
          );
          res.redirect("/members/login");
        }
      }
    })
    .catch(() => {
      req.flash("errors_msg", "Vous n'êtes pas autorisés à vous connecter.");
      res.redirect("/members/identification");
    });
});
router.get("/register", (req, res) => {
  res.render("members/register");
});

router.get("/register/:id", ensureAuthenticated, (req, res) => {
  Member.findOne({
    _id: req.params.id
  })
  .then(member => {
    if(member.id !== req.user.id){
      res.redirect("/index/dashboard");
    } else {
      res.render("members/register", {
        member: member
      });
    }
  })
});

//Create Member Form
router.get("/create", (req, res) => {
  res.render("members/create");
});

//Create Member Process
router.post("/create", ensureAuthenticated, (req, res) => {
  let admin;
  if (req.body.admin) {
    admin = true;
  } else {
    admin = false;
  }

  let errors = [];
  if (!req.body.lastName) {
    errors.push({
      text: "Le nom du membre est obligatoire"
    });
  }

  if (!req.body.matricule) {
    errors.push({
      text: "Le matricule du membre est obligatoire"
    });
  }

  if (errors.length > 0) {
    res.render("members/create", {
      errors: errors,
      nom: req.body.lastName,
      matricule: req.body.matricule
    });
  } else {
    const newMember = {
      nom: req.body.lastName.toUpperCase(),
      matricule: req.body.matricule,
      admin: admin
    };

    Member.findOne({
      matricule: newMember.matricule
    }).then(member => {
      if (member) {
        req.flash("errors_msg", "Cher administrateur, ce matricule est déjà enregistré.");
        res.redirect("/members/create");
      } else {
        new Member(newMember).save().then(member => {
          req.flash("success_msg", "Nouveau membre ajouté.");
          res.redirect(`/members/create`);
        });
      }
    });
  }
});

//Member Infos Register Process
router.put("/:id", (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.confirm_password){
    errors.push({
      text: "Vos mots de passe ne concordent pas."
    });
  }
  if (req.body.password.length < 4){
    errors.push({
      text: "Votre mot de passe doit contenir au moins 4 caractères"
    });
  }

    Member.findOne({
      _id: req.params.id
    }).then(member => {
      if (errors.length > 0){
        res.render("members/register", {
          errors: errors,
          member: member,
          firstName: req.body.firstName,
          password: req.body.password,
          confirm_password: req.body.confirm_password,
          dateNaiss: req.body.dateNaiss,
          lieuNaiss: req.body.lieuNaiss,
          profession: req.body.profession,
          situationM: req.body.situationM,
          telephone: req.body.telephone,
          cellulaire: req.body.cellulaire,
          email: req.body.email
        });
      } else {
        member.prenoms = req.body.firstName;
        member.dateNaiss = req.body.dateNaiss;
        member.lieuNaiss = req.body.lieuNaiss;
        member.profession = req.body.profession;
        member.situationMatri = req.body.situationM;
        const newContact = {
          telephone: req.body.telephone,
          cellulaire: req.body.cellulaire,
          email: req.body.email
        }
        member.contact = newContact;
        if (req.body.password === member.password){
          member.save().then(member => {
            req.flash("success_msg", "Vos informations ont été mises à jour avec succès.");
            res.redirect("/members/register");
          });
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              member.password = hash;
              member.save().then(member => {
                req.flash("success_msg", "Votre enregistrement est un succès. Vous pouvez vous connecter.");
                res.redirect("/members/login");
              });
            });
          });
        }
      }
    });
});

//Member Login Route
router.get("/login", (req, res) => {
  res.render("members/login");
});

//Member Login Process
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/index/dashboard",
    failureRedirect: "/members/login",
    failureFlash: true
  })(req, res, next);
});

//Logout Member
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'Vous êtes déconnecté');
  res.redirect('/members/login');
  });

  //Delete Member
router.delete("/:id", (req, res) => {
  Member.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Membre Supprimé");
    res.redirect("/index/dashboard");
  });
});

module.exports = router;
