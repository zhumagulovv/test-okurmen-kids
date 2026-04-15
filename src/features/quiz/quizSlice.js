import { createSlice } from '@reduxjs/toolkit';

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        currentIndex: 0,
        elapsed: 0,
        isRunning: false,
    },
    reducers: {
        nextQuestion: (state) => {
            state.currentIndex += 1;
        },

        prevQuestion: (state) => {
            state.currentIndex -= 1;
        },

        setCurrentIndex: (state, action) => {
            state.currentIndex = action.payload;
        },

        setElapsed: (state, action) => {
            state.elapsed = action.payload;
        },

        incrementTimer: (state) => {
            if (state.isRunning) {
                state.elapsed += 1;
            }
        },

        startTimer: (state) => {
            state.isRunning = true;
        },

        stopTimer: (state) => {
            state.isRunning = false;
        },

        resetTimer: (state) => {
            state.elapsed = 0;
            state.isRunning = false;
        },
    },
});

export const {
    nextQuestion,
    prevQuestion,
    setCurrentIndex,
    incrementTimer,
    startTimer,
    stopTimer,
    resetTimer,
    setElapsed
} = quizSlice.actions;

export default quizSlice.reducer;