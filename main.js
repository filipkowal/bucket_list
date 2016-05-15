Challanges = new Mongo.Collection('challanges');


Meteor.methods({
  'tasks.update'(taskId) {
    check(taskId, String);
 
    Tasks.remove(taskId);
  },
});

if (Meteor.isClient) {
  // Meteor.subscribe('Challanges');

  Template.nav.helpers({
    'listView'() {
      Session.set('view', 'listView');
    },
    
  });

  Template.nav.events({
    'click .listView'() {
      Session.set('view', 'listView');
    },
    'click .insertView'() {
      Session.set('view', 'insertView');
      console.log('insertView');
    },
  });

Template.challangeList.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe("Challanges");
});

  Template.challangeList.helpers({
    'showChallanges'() {
      var filter = Session.get('filter');
      if (filter) return Challanges.find({ distance: {$lte:filter}});
      else return Challanges.find();
    },
    'listView'() {
      if(Session.get('view') === 'listView') {
        return true;
      }
    },
    'defaultData'() {
      //Insert showcase data on startup
      console.log(Template.instance().subscriptionsReady());
      console.log("database:", Challanges.findOne());
      if(!Challanges.find().fetch().length) {
        console.log("Inserting default data")
        var createdAt = new Date();
        Challanges.insert({
          challangeName: "Babia Góra",
          latitude: 49.573163,
          longitude: 19.530796,
          createdAt: createdAt,
          challangeDescription: "Zdobądź szczyt, wchodząc szlakiem niebieskim",
          accepted: false,
          accomplished: false,
          distance: 70,
        });
        var createdAt = new Date();
        Challanges.insert({
          challangeName: "Rysy",
          latitude: 49.179548,
          longitude: 20.088064,
          createdAt: createdAt,
          challangeDescription: "Wejdź na Rysy z Murowańca w mniej niż 4 godziny",
          accepted: true,
          accomplished: false,
          distance: 110,
        });
        var createdAt = new Date();
        Challanges.insert({
          challangeName: "UEK",
          latitude: 50.068448,
          longitude: 19.953854,
          createdAt: createdAt,
          challangeDescription: "Obroń licencjat na UEKu",
          accepted: false,
          accomplished: true,
          image: "uek.jpg",
          distance: 0,
        });
      }
    },
  });

  Template.challangeList.events({
    'click .delete'() {
      Challanges.remove(this._id);
    },
    'click .accepted'() {
      Challanges.update(this._id, { $set: { accepted: ! this.accepted }});
    },
    'click .accomplished'() {
      Challanges.update(this._id, { $set: { accomplished: ! this.accomplished }});
    },
    'click .getpicture'() {
      var challangeId = this._id;
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });

      function onSuccess(imageURI) {

          imageURI = WebAppLocalServer.localFileSystemUrl(imageURI);

          console.log("imageURI w onSuccess", imageURI);
          pathToImage = imageURI;
          console.log("this._id inside:", challangeId);
          // return imageURI;
          Challanges.update(challangeId, { $set: { image: imageURI }});
      }
      
      function onFail(message) {
          alert('Failed because: ' + message);
      }
    },
    'click .add'() {
      Session.set('view', 'insertView');
      console.log('insertView');
    },
    'change .form-control'(e, tmpl) {
        e.preventDefault();
        var selectedOption = tmpl.find('.form-control :selected');

        var filter = Number(selectedOption.value);
        console.log("filter:", filter);
        console.log(Challanges.find({ distance: {$lte:filter}}).fetch());
        Session.set('filter', filter);
     },
  });

  Template.insertChallange.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe("Challanges");
});

  Template.insertChallange.events({
    'submit .insertChallange'(event) {
        event.preventDefault();
        var challangeName = event.target.challangeName.value;
        var latitude = Number(event.target.latitude.value);
        var longitude = Number(event.target.longitude.value);
        var createdAt = new Date();
        var challangeDescription = event.target.challangeDescription.value;
        var accepted = false;
        var accomplished = false;

        //Count distance beetwen current location and destination
        var lat1 = 50.068448;
        var lon1 = 50.068448;
        var lat2 = latitude;
        var lon2 = longitude;

        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        dist = dist * 1.609344
        console.log(dist);

        Challanges.insert({
        challangeName: challangeName,
        latitude: latitude,
        longitude: longitude,
        createdAt: createdAt,
        challangeDescription: challangeDescription,
        accepted: accepted,
        accomplished: accomplished,
        distance: dist,
        });

        event.target.challangeName.value = "";
        event.target.latitude.value = "";
        event.target.longitude.value = "";
        event.target.challangeDescription.value = "";

        alert("Dodano nowe wyzwanie");
        Session.set('view', 'listView');
    },
    'click .getpicture'() {
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });

      function onSuccess(imageURI) {
          console.log("Wczytuje kamere");
          var image = document.getElementById('myImage');
          console.log("image:", image);
          image.src = imageURI;
          console.log("image.src:", image.src);
          image = WebAppLocalServer.localFileSystemUrl(image);
          Challanges.update(this._id, { $set: { image: image }});
      }

      function onFail(message) {
          alert('Failed because: ' + message);
      }
    },
    'click .listView'() {
      Session.set('view', 'listView');
    },
    'click .getpicture'() {
      var challangeId = this._id;
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });

      function onSuccess(imageURI) {

          imageURI = WebAppLocalServer.localFileSystemUrl(imageURI);

          console.log("imageURI w onSuccess", imageURI);
          pathToImage = imageURI;
          console.log("this._id inside:", challangeId);
          // return imageURI;
          Challanges.update(challangeId, { $set: { image: imageURI }});
      }
      
      function onFail(message) {
          alert('Failed because: ' + message);
      }
    },
  });

  Template.insertChallange.helpers({
    'insertView'() {
      if(Session.get('view') === 'insertView') {
        return true;
      }
    },
  });
}

if (Meteor.isCordova) {
  // Meteor.startup(function() {
    // Here we can be sure the plugin has been initialized
    // navigator.geolocation.getCurrentPosition(success);
    // function onDeviceReady() {
    //   console.log(navigator.camera);
    // }
    

    // var onSuccess = function(position) {
    //   alert('Latitude: '          + position.coords.latitude          + '\n' +
    //         'Longitude: '         + position.coords.longitude         + '\n' +
    //         'Altitude: '          + position.coords.altitude          + '\n' +
    //         'Accuracy: '          + position.coords.accuracy          + '\n' +
    //         'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //         'Heading: '           + position.coords.heading           + '\n' +
    //         'Speed: '             + position.coords.speed             + '\n' +
    //         'Timestamp: '         + position.timestamp                + '\n');
    // };

    // // onError Callback receives a PositionError object
    // //
    // function onError(error) {
    //     alert('code: '    + error.code    + '\n' +
    //           'message: ' + error.message + '\n');
    // }

    // navigator.geolocation.getCurrentPosition(onSuccess, onError);

  // });

  console.log("Printed only in mobile Cordova apps");
  Ground.Collection(Challanges);

}

if (Meteor.isServer) {
  Meteor.publish('Challanges', function(){
    return Challanges.find();
  });

}