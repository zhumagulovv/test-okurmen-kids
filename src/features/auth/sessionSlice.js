import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../service/api'; 

export const validateSession = createAsyncThunk(
    'session/validate',
    async (key, { rejectWithValue }) => {
        try {
            const result = await endpoints.validate({ key });
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSession: (state) => {
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateSession.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(validateSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;