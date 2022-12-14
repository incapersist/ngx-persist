// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth0: {
    clientID: 'TAZZM6bad42sFL8VYUuXelSlOccQ4gj9',
    domain: 'web-persist-dev.auth0.com',
    redirectUri: 'http://localhost:4200/callback',
    connection: 'Username-Password-Authentication',
  },
  api: {
    domain: '35.228.130.54',
    baseUrl: 'http://35.228.130.54',
    url: 'http://35.228.130.54/models/persist',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
