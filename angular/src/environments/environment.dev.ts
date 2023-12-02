const baseURL = 'https://localhost:443/api';

export const environment = {
  production: false,
  placeholder: '../../assets/images/placeholder.png',
  authCheckURL: `${baseURL}/auth/check`,
  loginURL: `${baseURL}/auth/signin`,
  signupURL: `${baseURL}/auth/signup`,
  usersURL: `${baseURL}/users`,
  productsURL: `${baseURL}/products`,
  userProductsURL: `${baseURL}/products/user/`,
  mediaURL: `${baseURL}/media`,
  userMediaURL: `${baseURL}/media/user/`,
  productMediaURL: `${baseURL}/media/product/`,
  cartUrl: `${baseURL}/carts`,
  addToCartUrl: `${baseURL}/carts/add`,
  placeOrder: `${baseURL}/orders`,
  logoutURL: `${baseURL}/auth/signout`,
};
