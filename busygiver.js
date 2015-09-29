// Create database of experiences
Experiences = new Mongo.Collection("experiences");


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
    
    // UNUSED
    Template.experience.helpers({
        // convert the ISODate to a user-friendly date format for printing
        friendlyDateTime: function (datetime) {
            return moment(datetime).calendar().toString();
        }
    
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
    });              
  });
}
