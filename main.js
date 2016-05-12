// import { Template } from 'meteor/templating';
// import { Mongo } from 'meteor/mongo';

// import './main.html';

// import { Challanges } from '../imports/api/challanges.js';
// if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
//     WebView.setWebContentsDebuggingEnabled(true);
// }

Challanges = new Mongo.Collection('challanges');


if (Meteor.isClient) {
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

  Template.challangeList.helpers({
    'showChallanges'() {
      return Challanges.find();
    },
    'listView'() {
      if(Session.get('view') === 'listView') {
        return true;
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
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });

      function onSuccess(imageURI) {
          console.log("Wczytuje kamere");
          var image = document.getElementById('myImage');
          // console.log("imageURI": imageURI);
          console.log("image:", image);
          image.src = imageURI;
          console.log("image.src:", image.src);
          image = WebAppLocalServer.localFileSystemUrl(image);
          console.log("image after for meteor:")
          Challanges.update(this._id, { $set: { image: image }});
      }

      function onFail(message) {
          alert('Failed because: ' + message);
      }
    },
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

        Challanges.insert({
        challangeName: challangeName,
        latitude: latitude,
        longitude: longitude,
        createdAt: createdAt,
        challangeDescription: challangeDescription,
        accepted: accepted,
        accomplished: accomplished,
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
  Meteor.startup(function() {
    // Here we can be sure the plugin has been initialized
    // navigator.geolocation.getCurrentPosition(success);
    // function onDeviceReady() {
    //   console.log(navigator.camera);
    // }
    

    var onSuccess = function(position) {
      alert('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

      });

      console.log("Printed only in mobile Cordova apps");

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    });
}
