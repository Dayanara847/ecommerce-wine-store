import { responsiveFontSizes } from '@material-ui/core';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  userLogoutEndpoint,
  addUserEndpoint,
  authLoginEndpoint,
  userOrdersEndpoint,
  userPromoteEndpoint,
  usersEndpoint,
  mailsEndpoint,
} from '../constants/endpoints';
import { status } from '../constants/helpers';
import tokenManager from '../Components/utils/tokenManager';

const initialState_user = {
  user: {
    info: {},
    orders: [],
    usersList: [],
    status: 'idle',
    error: null,
  },
};

export const createUser = createAsyncThunk('user/register', async (payload) => {
  const { user, formik } = payload;
  const user_response = await axios.post(addUserEndpoint, user);
  const { token } = user_response.data;
  const resPayload = {
    userRegister_response: user_response.data,
    formik,
  };
  return resPayload;
});

export const postUserLogin = createAsyncThunk('user/login', async (payload) => {
  const { user, formik } = payload;
  const userLogin_response = await axios.post(authLoginEndpoint, user);
  const { token } = userLogin_response.data;
  console.log('TOken recibido', token);
  const resPayload = {
    userLogin_response: userLogin_response.data,
    token,
    formik,
  };
  return resPayload;
});

export const userLogout = createAsyncThunk(
  'user/logout',
  async (payload, thunkApi) => {
    const userLogout_response = await axios.get(userLogoutEndpoint);
    console.log('LOGGIN OUT');
    return userLogout_response;
    return;
  }
);

export const userOrders = createAsyncThunk('user/getUserOrders', async (id) => {
  const resp = await axios.get(userOrdersEndpoint + id + '/orders');
  return resp;
});

export const userPromote = createAsyncThunk('user/promote', async (id) => {
  const resp = await axios.put(userPromoteEndpoint + id);
  return resp;
});

export const getUsers = createAsyncThunk('users/getUsers', async () => {
  const resp = await axios.get(usersEndpoint);
  return resp;
});

export const allUsers = createAsyncThunk('users/getAllUsers', async () => {
  const resp = await axios.get(usersEndpoint, {
    headers: { Authorization: tokenManager.getToken() },
  });
  return resp;
});

export const sendEmail = createAsyncThunk('user/sendMail', async (payload) => {
  const resp = await axios.post(mailsEndpoint, payload);
  return resp;
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialState_user,
  reducers: {
    persistUserLogin: (state, { payload }) => {
      const { user } = payload;
      state.user.info = user;
    },
    resetStatus: (state, action) => {
      state.user.status = status.idle;
    },
  },
  extraReducers: {
    [createUser.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [createUser.fulfilled]: (state, { payload }) => {
      const { userRegister_response, formik } = payload;
      state.user.status = status.succeded;
      state.user.info = userRegister_response.user;
      formik.resetForm();
    },
    [createUser.rejected]: (state, action) => {
      const infoComplete = action.meta.arg;
      const info = {
        formik: infoComplete.formik,
        user: {
          email: infoComplete.user.email,
        },
      };
      state.user.status = status.failed;
      state.user.error = action.error;
      state.user.info = info;
    },
    [postUserLogin.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [postUserLogin.fulfilled]: (state, { payload }) => {
      const { userLogin_response, formik } = payload;
      state.user.status = status.succeded;
      state.user.info = userLogin_response.user;
      formik.resetForm();
    },
    [postUserLogin.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [userOrders.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [userOrders.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
      state.user.orders = payload.data;
    },
    [userOrders.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [userLogout.fulfilled]: (state, action) => {
      state.user.info = {};
      state.user.orders = [];
      state.user.status = 'idle';
      state.user.error = null;
    },
    [userPromote.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [userPromote.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
    },
    [userPromote.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [getUsers.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [getUsers.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
      state.user.info = payload.data;
    },
    [getUsers.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [sendEmail.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [sendEmail.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
    },
    [sendEmail.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [allUsers.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [allUsers.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
      state.user.usersList = payload.data;
    },
    [allUsers.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
  },
});
export const { persistUserLogin, resetStatus } = userSlice.actions;

export default userSlice;
