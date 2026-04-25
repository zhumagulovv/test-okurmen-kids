import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../service/api';

export const startAttempt = createAsyncThunk(
    'attempt/start',
    async ({ key, student_name }, { rejectWithValue }) => {
        try {
            const result = await endpoints.startAttempt({ key, student_name });
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const submitAnswer = createAsyncThunk(
    'attempt/submit',
    async (data, { rejectWithValue }) => {
        try {
            const result = await endpoints.submitAnswer(data);
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const finishAttempt = createAsyncThunk(
    'attempt/finish',
    async (attempt_id, { rejectWithValue }) => {
        try {
            const result = await endpoints.finish({ attempt_id });
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchResult = createAsyncThunk(
    'attempt/result',
    async (attempt_id, { rejectWithValue }) => {
        try {
            const result = await endpoints.getResult(attempt_id);
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const attemptSlice = createSlice({
    name: 'attempt',
    initialState: {
        current: null,
        questions: [],
        answers: {},
        submitting: {},
        result: null,
        loading: false,
        error: null,
    },
    reducers: {
        setAnswer: (state, action) => {
            const { questionId, data } = action.payload;
            state.answers[questionId] = {
                ...state.answers[questionId],
                ...data,
            };
        },
        clearAttempt: (state) => {
            state.current = null;
            state.questions = [];
            state.answers = {};
            state.submitting = {};
            state.result = null;
            state.loading = false;
            state.error = null;
        },
        setSubmitting: (state, action) => {
            const { questionId, isSubmitting } = action.payload;
            state.submitting[questionId] = isSubmitting;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(startAttempt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startAttempt.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
                state.questions = action.payload.questions || [];
                state.answers = {};
            })
            .addCase(startAttempt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitAnswer.fulfilled, (state, action) => {
                const { question_id } = action.meta.arg;         // ✅ what we sent
                const payload = action.payload ?? {};
                const { is_correct, grading_status } = payload;  // ✅ what API returned
                if (!state.answers[question_id]) {
                    state.answers[question_id] = {};
                }
                state.answers[question_id].submitted = true;
                state.answers[question_id].is_correct = is_correct;
                state.answers[question_id].grading_status = grading_status;
            })
            .addCase(submitAnswer.rejected, (state, action) => {
                state.error = action.payload ?? 'Ошибка отправки ответа'
            })
            .addCase(finishAttempt.fulfilled, (state) => {
                state.current = { ...state.current, finished: true };
            })
            .addCase(finishAttempt.rejected, (state, action) => {
                state.error = action.payload ?? 'Ошибка завершения'
            })
            .addCase(fetchResult.fulfilled, (state, action) => {
                state.result = action.payload;
            })
            .addCase(fetchResult.rejected, (state, action) => {
                 state.error = action.payload ?? 'Ошибка загрузки результата'
            });
    },
});

export const { setAnswer, clearAttempt, setSubmitting } = attemptSlice.actions;
export default attemptSlice.reducer;