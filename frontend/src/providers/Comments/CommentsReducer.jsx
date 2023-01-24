import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

export const getComments = createAsyncThunk("comments/getComments", (id) => {
  return axios
    .get(`http://localhost:8080/games/game/${id}/comments`)
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
    RemoveBeer: (state, action) => {
      let { author, id } = action.payload;
      let newdata = state.data.map(comment => {
        if(comment.id == id ) {
          return { ...comment, beers: comment.beers.filter(beer => beer.author != author) }
        } else return comment
      });

      return { ...state, data: newdata }
    },

    GiveBeer: (state, action) => {
      let { beer, id } = action.payload;
      let newdata = state.data.map(comment => {
        if(comment.id == id) {
          return { ...comment, beers: [...comment.beers, beer] }
        } else return comment
      });

      return { ...state, data: newdata }
    },

    Add: (state, action) => {
      let newdata = [action.payload, ...state.data];
      return {...state, data: newdata}
    },

    // Sort: (state, action) => {
    //   let sorted = state.data.sort((a, b) => {
    //     console.log(a, b)
    //     if(action.payload === "newest") {
    //       if (a.timestamp > b.timestamp) return -1
    //       else return 1
    //     }
    //     else if (action.payload === "oldest") {
    //       if (a.timestamp > b.timestamp) return 1
    //       else return -1
    //     }
    //     else if (action.payload === "beers") {
    //       if (a.beers.length > b.beers.length) return 1
    //       else return -1
    //     }
    //   });

    //   return { ...state, data: sorted }
    // },

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
