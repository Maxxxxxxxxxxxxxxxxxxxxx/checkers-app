import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

export const getComments = createAsyncThunk("comments/getComments", (id) => {
  return axios
    .get(`http://localhost:8080/comments/${id}`)
    .then(res => res.data)
})

export const addBeer = createAsyncThunk("comments/addBeer", (id) => {
  return axios
    .get(`http://localhost:8080/comments/${id}/beer`)
    .then(res => res.data)
})

const initialState = {
  loading: true,
  data: [],
  error: ""
}

const CommentReducer = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    Add: (state, action) => {
      let newdata = [action.payload, ...state.data];
      return {...state, data: newdata}
    },
    Edit: (state, action) => {
      const newState = state.data.map((comment) => {
        if (comment.id == action.payload.id) {
          return action.payload;
        } else return comment;
      });
      return { ...state, data: newState }
    },
    Delete: (state, action) => {
      return {...state, data: state.data.filter((d) => d.id !== action.payload) };
    },
    Sort: (state, action) => {
      let sorted = state.data.sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
      return { ...state, data: sorted }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getComments.pending, state => {
      state.loading = true
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getComments.rejected, state => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});

export const commentActions = CommentReducer.actions;
export default CommentReducer.reducer;
