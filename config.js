/* eslint-disable import/no-anonymous-default-export */
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_API_ENDPOINT;
const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME;

export { API_ENDPOINT, HOSTNAME, SOCKET_URL };
export default {
  googleClientId: '179217294070-k4947i8ejj637ubs4h1ecdr5r2k605qk.apps.googleusercontent.com', // The OAUTH client ID for your file browser
  // APIEndpoint: "http://localhost:8080/", // The URL to the cloud function
  APIEndpoint: 'http://localhost:5000', // The URL to the cloud function
  // APIEndpoint: "https://region-yourprojectname.cloudfunctions.net/file-api", // The URL to the cloud function
  CDN_URL: 'https://cdn.mywebsite.com/', // The base URL to your CDN or bucket. This might be a custom subdomain or https://bucket-name.storage.googleapis.com/ if you don't have a CDN.
  BucketUrl: 'https://storage.googleapis.com/beigestorage/', // This is used to bypass the cache on your CDN. ONLY replace the YOUR-BUCKET-NAME part with the name of your bucket.
  appName: 'CDN File Manager', // The name that appears at the top of the app menu.
};
