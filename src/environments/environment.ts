// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebaseConfig: {
      apiKey: "AIzaSyCISo1Y_-XxjzXGDDlanaZpKpfEfr0bwZw",
      authDomain: "pollos-mario-woodside.firebaseapp.com",
      databaseURL: "https://pollos-mario-woodside.firebaseio.com",
      projectId: "pollos-mario-woodside",
      storageBucket: "pollos-mario-woodside.appspot.com",
      messagingSenderId: "740048736607",
      appId: "1:740048736607:web:2eda941f8f51ce98d8a6ea",
      measurementId: "G-GS1LQRR9R8"
  },

  stripeKey: 'pk_test_51HoxNCFVP4vmqhV33nGp0Fn1BYdk0Rxml45U38r6ARRG4ieVCPJI5XNkjol2Pu5TKf3ASP3nwaQHP4hLztr2jY8F00Ok1Mawuv',

  //paypalClientId: 'AWkTlCsx3XN40vr2epiqoBxHePXfTiwBWtwlFBC44puehPcVBYuzqAOBuFFJGbsT8u49gGLMtJ7UllGr'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
