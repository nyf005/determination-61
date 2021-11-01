const moment = require('moment');

module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }

    req.flash('errors_msg', `Vous n'êtes pas autorisé`);
    res.redirect('/members/login');
  },
  
  ensureGuest: function(req, res, next){
    if (req.isAuthenticated()){
      res.redirect("/dashboard");
    } else {
      return next();
    }
    
  },
  dateFormat: function(date, format){
    var dateObj = new Date(date);
    var momentObj = moment(dateObj);
    var momentString = momentObj.format(format);
    return momentString;
  },

  formatDate: function(date, format, local){
    return moment(date).locale(local).format(format);
  },

  select: function(selected, options){
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },

  equal: function( a, b ){
    var next =  arguments[arguments.length-1];
    return (a === b) ? next.fn(this) : next.inverse(this);
  },

  editIcon: function(cardMember, loggedMember, memberId, floating = true){
    if(cardMember === loggedMember){
      if(floating){
        return `<a href="/members/register/${memberId}" class="btn edit-btn"><img src="/img/icons8-compose-48.png" alt="logo"></a>`;
      }
    } else {
      return '';
    }
  },

  deleteIcon: function(admin, memberId, floating = true){
    if(admin === true){
      if(floating){
        return `<form action="/members/${memberId}?_method=DELETE" method="POST" id="delete-form">
        <input type="hidden" name="_method" value="DELETE">
        <button type="submit" class="btn btn-danger">Supprimer</button>
      </form>`;
      }
    } else {
      return '';
    }
  },
};
