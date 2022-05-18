const port = 8000;
const protocol = 'http';
const hostName = 'localhost';
const baseUrl = `https://r6mdswv5la.execute-api.us-east-1.amazonaws.com/`;
const logInServerUrl = `${baseUrl}auth/login`;
const uploadPictureServerUrl = `${baseUrl}gallery/upload-picture`;
const signUpServerUrl = `${baseUrl}auth/signup`;
const galleryUrl = `./gallery.html`;
const loginUrl = `./index.html`;
const currentUrl = new URL(window.location.href);
const galleryServerUrl = `${protocol}://${hostName}:${port}/gallery`;

export {
  port,
  protocol,
  hostName,
  logInServerUrl,
  uploadPictureServerUrl,
  galleryServerUrl,
  signUpServerUrl,
  galleryUrl,
  loginUrl,
  currentUrl
}