import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "../../service/api";

export const fetchAllTest = createAsyncThunk(
    "tests/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await endpoints.tests();
            return res
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
);

export const fetchTestsByID = createAsyncThunk(
    "tests/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const resID = await endpoints.testsID(id);
            return resID
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
);


const testsSlice = createSlice({
    name: "tests",
    initialState: {
        tests: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) =>
        builder.addCase(fetchAllTest.pending, (state) => {
            state.loading = true;
            state.error = null
        }).addCase(fetchAllTest.fulfilled, (state, action) => {
            state.loading = false;
            state.tests = action.payload.results;
            state.error = null
        }).addCase(fetchAllTest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch tests in reducers"
        })
})

export default testsSlice.reducer