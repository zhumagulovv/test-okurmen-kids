import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../service/api';

export const validateSession = createAsyncThunk(
    'session/validate',
    async (key, { rejectWithValue, getState }) => {

        const normalizedKey = String(key || '').trim()

        if (!normalizedKey) {
            return rejectWithValue('Ключ сессии пустой')
        }

        const { session } = getState()

        if (session.data?.key === normalizedKey) {
            return session.data
        }

        try {
            const result = await endpoints.validate({
                key: normalizedKey
            })

            return result

        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.error ||
                error.message ||
                'Ошибка проверки сессии'
            )
        }
    }
)

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