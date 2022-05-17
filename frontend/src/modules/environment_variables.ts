const port = 8000;
const protocol = 'http';
const hostName = 'localhost';
const apiId = 'r6mdswv5la';
const authenticationServerUrl = `https://${apiId}.execute-api.us-east-1.amazonaws.com/auth/login`;
const galleryServerUrl = `${protocol}://${hostName}:${port}/gallery`;
const signUpServerUrl = `${protocol}://${hostName}:${port}/signUp`;
const galleryUrl = `gallery.html`;
const loginUrl = `index.html`;
const currentUrl = new URL(window.location.href);

export {
  port,
  protocol,
  hostName,
  authenticationServerUrl,
  galleryServerUrl,
  signUpServerUrl,
  galleryUrl,
  loginUrl,
  currentUrl
}