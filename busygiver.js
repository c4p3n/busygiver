// Create database of experiences
Experiences = new Mongo.Collection("experiences", {
    transform: function (experience) {
        if (experience.freq == "once") {
            experience.datetime = moment(experience.datetime).format("dddd MMM Do, h:mm A");
            return experience;
        }

        else if (experience.freq == "weekly") {
           experience.datetime = nextDate(experience.datetime);
           return experience;
        }

        else if (experience.freq == "daily") {
            experience.datetime = "Always";
            return experience;
        }
    }
});


if (Meteor.isClient) {
                   
    Meteor.subscribe("experiences");
    
    // initialize Session variables
    Session.setDefault({ 
        action: "default",
        city: "default"
    });
    
    // return experiences from database
    Template.body.helpers({
        experiences: function () {
            // user has made no choice of action or city
            if (Session.equals("action", "default") && Session.equals("city", "default")) {
                return Experiences.find({});
            } else if (!(Session.equals("action", "default")) && Session.equals("city", "default")) {
                // user has only chosen an action
                return Experiences.find({action: Session.get("action")});
            } else if (Session.equals("action", "default") && !(Session.equals("city", "default"))) {
                // user has only chosen a city
                return Experiences.find({city: Session.get("city")});
            } else {
                // user has chosen both an action and a city
                return Experiences.find({action: Session.get("action"), city: Session.get("city")});
            }
        },
        
        // fetch public settings
        publicSettings: function() {
            return Meteor.settings.public;
        }
    });
    
    // format date
    Template.experience.helpers({
        
    });
    
        
    Template.body.events({
        // monitor change of action dropdown
        "change .action-dropdown": function (event) {
            Session.set("action", event.target.value);
            console.log(event);
        },
        // monitor change of city dropdown
        "change .city-dropdown": function (event) {
            Session.set("city", event.target.value);
            console.log(event);
        }
        
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // publish experiences to client
    Meteor.publish("experiences", function() {
        return Experiences.find({});
        // sort experiences
        // return sorted experiences
    });              
  });
}


// helper functions

function nextDate(day) {
    var eventDay = moment().day(day);
    // if given day is after today or the same as today, simply return the given day
    if (eventDay.isAfter(moment(), "day") || eventDay.isSame(moment(), "day"))
        	return eventDay.format("dddd MMM Do");
    // else return the next time the event occurs, one week from given day
    else return eventDay.add(7, "day").format("dddd MMM Do");
}

 function friendlyDateTime (experience) {
    if (experience.freq == "once") {
        experience.datetime = moment(experience.datetime).format("dddd MMM Do, h:mm A");
    }
       
    else if (experience.freq == "weekly") {
       experience.datetime = nextDate(experience.datetime);
        // console.log(experience.datetime);
    }
        
    else if (experience.freq == "daily") {
        experience.datetime = "Always";
    }
        
 }
