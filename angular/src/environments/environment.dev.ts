const baseURL = 'https://localhost:443/api';

export const environment = {
  production: false,
  authCheckURL: `${baseURL}/auth/check`,
  loginURL: `${baseURL}/auth/signin`,
  signupURL: `${baseURL}/auth/signup`,
  usersURL: `${baseURL}/users`,
  productsURL: `${baseURL}/products`,
  mediaURL: `${baseURL}/media`,
  userMediaURL: `${baseURL}/media/user/`,
  productMediaURL: `${baseURL}/media/product/`,
  logoutURL: `${baseURL}/auth/signout`,
};
