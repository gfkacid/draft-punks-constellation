// import { selectAccountIdToken } from "../account/selectors";
const selectAuthReducer = (state) => state.auth;

export const selectUser = (state) =>
  selectAuthReducer(state).user;

export const selectUserId = (state) =>
  selectUser(state).id;

export const selectAddress = (state) =>
  selectUser(state).address;

export const selectIsAuthenticated = (state) =>
  selectAuthReducer(state).isAuthenticated;

export const selectUserEntries = (state) =>
  selectAuthReducer(state).entries;


// export const selectAuthHeaders = (state) => {
//   const token = selectAccountIdToken(state);

//   return { Authorization: `Bearer ${token}` };
// };
