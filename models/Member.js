const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MemberSchema = new Schema({
  matricule: {
    type: Number,
    required: true
  },
  nom: {
    type: String,
    required: true
  },
 prenoms: {
    type: String
  },
  dateNaiss: {
    type: Date
  },
  lieuNaiss: {
    type: String
  },
  profession: {
    type: String
  },
  situationMatri: {
    type: String
  },
  contact: {
    cellulaire:{
      type: String
    },
    telephone:{
      type: String
    },
    email: {
      type: String
    }
  },
  password: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('members', MemberSchema);