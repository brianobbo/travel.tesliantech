/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDAPFJegc9HiNJbX-KHauDUR3_vVljfLYc",
  authDomain: "ibeauty-e83da.firebaseapp.com",
  projectId: "ibeauty-e83da",
  storageBucket: "ibeauty-e83da.appspot.com",
  messagingSenderId: "592543327679",
  appId: "1:592543327679:web:e90503106ff0fbd86f6d0a",
  measurementId: "G-6XEEY7TH0K",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
