// // src/Services/authService.js
// export const isAuthenticated = () => {
//   const user = JSON.parse(sessionStorage.getItem("user"));
//   return user && user.isAuthenticated;
// };

// export const getUserPermissions = () => {
//   const role = JSON.parse(sessionStorage.getItem("role"));
//   // Extract abilities correctly
//   const abilities = role ? role.abilities.map((item) => item.ability) : [];
//   return abilities;
// };


// src/Services/authService.js
export const isAuthenticated = () => {
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  return auth && auth.data.user && auth.data.user.status; // Check user status from auth object
};

export const getUserPermissions = () => {
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  // Extract abilities from the user object inside the auth data
  const abilities = auth && auth.data.user ? auth.data.user.abilities : [];
  return abilities;
};
