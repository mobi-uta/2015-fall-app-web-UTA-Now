var app = angular.module('starter.services', []);

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
