// src/features/auth/trainingSessionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../service/api';
import { validateSession } from '../auth/sessionSlice';

/**
 * Auto-selects ANY valid training session and validates its key silently.
 * Used by the Hero "GO! в режим практики" button.
 */
export const startTrainingSession = createAsyncThunk(
    'trainingSession/start',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await endpoints.sessions();
            const sessions = response.results ?? response ?? [];

            const trainingSession = sessions.find(
                (s) =>
                    s.session_type === 'training' &&
                    (s.is_active === true || s.is_valid === true) &&
                    s.key
            );

            if (!trainingSession) {
                return rejectWithValue('Нет доступных тренировочных сессий.');
            }

            localStorage.setItem('sessionKey', trainingSession.key);

            const result = await dispatch(validateSession(trainingSession.key));

            if (result.meta.requestStatus !== 'fulfilled') {
                localStorage.removeItem('sessionKey');
                return rejectWithValue(result.payload ?? 'Ошибка проверки сессии.');
            }

            return { key: trainingSession.key, session: result.payload };
        } catch (error) {
            return rejectWithValue(error.message ?? 'Неизвестная ошибка.');
        }
    }
);

/**
 * Validates a SPECIFIC training session by its key.
 * Used by DetailCatalogTest card buttons where the user picks a session.
 *
 * @param {string} key — the session key from the sessions list
 */
export const startTrainingSessionByKey = createAsyncThunk(
    'trainingSession/startByKey',
    async (key, { dispatch, rejectWithValue }) => {
        try {
            localStorage.setItem('sessionKey', key);

            const result = await dispatch(validateSession(key));
            console.log(result)

            if (result.meta.requestStatus !== 'fulfilled') {
                localStorage.removeItem('sessionKey');
                return rejectWithValue(result.payload ?? 'Ошибка проверки сессии.');
            }

            return { key, session: result.payload };
        } catch (error) {
            localStorage.removeItem('sessionKey');
            return rejectWithValue(error.message ?? 'Неизвестная ошибка.');
        }
    }
);

const trainingSessionSlice = createSlice({
    name: 'trainingSession',
    initialState: {
        loading: false,
        error: null,
        // Which card's key is currently in-flight — only that card shows a spinner
        activeKey: null,
    },
    reducers: {
        clearTrainingError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── startTrainingSession (auto-pick, used by Hero) ──────────────
            .addCase(startTrainingSession.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.activeKey = null;
            })
            .addCase(startTrainingSession.fulfilled, (state) => {
                state.loading = false;
                state.activeKey = null;
            })
            .addCase(startTrainingSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.activeKey = null;
            })

            // ── startTrainingSessionByKey (specific card) ───────────────────
            .addCase(startTrainingSessionByKey.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.activeKey = action.meta.arg; // the key passed to the thunk
            })
            .addCase(startTrainingSessionByKey.fulfilled, (state) => {
                state.loading = false;
                state.activeKey = null;
            })
            .addCase(startTrainingSessionByKey.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.activeKey = null;
            });
    },
});

export const { clearTrainingError } = trainingSessionSlice.actions;
export default trainingSessionSlice.reducer;