var app = angular.module('starter.services', []);

// Parse user account data
app.factory ('AccService', function(){

  var ParseUser = Parse.Object.extend('Users');

  return{
    newUser: function(name, email, accessToken, id, birthday, gender){
      // Init values
      var pfUser = new ParseUser();
      pfUser.set('name', name);
      pfUser.set('email', email);
      pfUser.set('fbToken', accessToken);
      pfUser.set('fbId', id);
      pfUser.set('birthdate', new Date(Date.parse(birthday)));
      pfUser.set('gender', gender);
      console.log("login success");
      return pfUser;
    },
    checkUser: function(pfuser){
      var query = new Parse.Query(ParseUser);
      query.find({
              success: function(results) {
                /* User already exists and update them */
                if(results.length > 0) {
                  console.log('User already exists');
                  pfuser.set('objectId', results[0].id);
                  pfuser.save(null, {
                    success: function(pfuser) {
                      console.log("User updated");
                    },
                    error: function(pfuser, error) {
                    }
                  });
                } else {
                  pfuser.save(null, {
                    success: function(pfuser) {
                      console.log("New user saved");
                    },
                    error: function(pfuser, error) {
                    }
                  });
                }
              },
              error: function(error) {}
            });
      
          }
};
});

app.factory ('EventFeed', function(){

  var Events = Parse.Object.extend("Events");
  
  var listEvent =[];

  return {
    getAllEvent: function(){
      var query = new Parse.Query(Events);
      query.include("Events.eventName");
      query.find({

          success: function(events) {

              for (var i = 0; i < events.length; i++) {
                  var event = events[i];
                  var eventName = event.get("eventName");
                  console.log(eventName);
                  listEvent.push(eventName);


                }

          },
          error: function(error) {
              alert(error);
      }
    });

    return listEvent;

        }
      };
    

});
app.factory('Events', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
 var events = [{
    id: 0,
    name: 'Mobi dev meeting',
    info: 'Write some code',
  }, {
    id: 1,
    name: 'Hackathon',
    info: 'Do nothing',
    
  }];

  return {
    all: function() {
      return events;
    },
    
    get: function(eventId) {
      for (var i = 0; i < events.length; i++) {
        if (events[i].id === parseInt(chatId)) {
          return events[i];
        }
      }
      return null;
    }
  };
});

