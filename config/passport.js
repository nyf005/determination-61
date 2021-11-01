const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const moment = require('moment');
const bcrypt = require("bcryptjs");

//Load Member Model
const Member = mongoose.model("members");

module.exports = function(passport){
  passport.use(
    new LocalStrategy({ usernameField: "matricule" }, (matricule, password, done) => {
      Member.findOne({
        matricule: matricule
      }).then(member => {
        if(!member){
          return done(null, false, {message: `Ce membre ne fait pas encore partie de la promotion.`});
        }
        if(!member.password){
          return done(null, false, {message: `Veuillez passer par l'étape d'identification pour renseigner vos informations avant de vous connecter.`});
        }
        
        bcrypt.compare(password, member.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch){
            return done(null, member);
          } else {
            return done(null, false, {message: "Mot de passe incorrect"});
          }
        });
      });
    })
  );

  passport.serializeUser(function(member, done) {
    done(null, member.id);
  });

  passport.deserializeUser(function(id, done) {
    Member.findById(id, function(err, member) {
      done(err, member);
    });
  });
}