/* eslint-disable import/no-anonymous-default-export */
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_API_ENDPOINT;
const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME;
const MAPAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export { API_ENDPOINT, HOSTNAME, SOCKET_URL, MAPAPIKEY };

// GCP CREADENTIALS HERE
const googleClientId = process.env.googleClientId;
const CDN_URL = process.env.CDN_URL;
const BucketUrl = process.env.BucketUrl;
const appName = process.env.appName;

export default {
  googleClientId, // The OAUTH client ID for your file browser
  // APIEndpoint: "http://localhost:8080/", // The URL to the cloud function
  APIEndpoint: `${API_ENDPOINT}gcp`, // The URL to the cloud function
  CDN_URL, // The base URL to your CDN or bucket. This might be a custom subdomain or https://bucket-name.storage.googleapis.com/ if you don't have a CDN.
  BucketUrl, // This is used to bypass the cache on your CDN. ONLY replace the YOUR-BUCKET-NAME part with the name of your bucket.
  appName, // The name that appears at the top of the app menu.
};
