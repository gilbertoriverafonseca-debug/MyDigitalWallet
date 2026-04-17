// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCfb3LXjr9oLy5HbhtFncpb84pOfrOMUbw",
    authDomain: "mydigitalwallet-d3e07.firebaseapp.com",
    projectId: "mydigitalwallet-d3e07",
    storageBucket: "mydigitalwallet-d3e07.firebasestorage.app",
    messagingSenderId: "711544624827",
    appId: "1:711544624827:web:e47779728e3ed630437b9e"
  },
  notificationsBackend: {
    baseUrl: 'https://sendnotificationfirebase-production.up.railway.app',
    email: 'user@unicolombo.edu.co',
    password: 'password123',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
