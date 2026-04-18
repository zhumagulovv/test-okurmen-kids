import { configureStore } from "@reduxjs/toolkit";

import attemptReducer from "../features/attempt/attemptSlice"
import leaderboardReducer from "../features/leaderboard/leaderboardSlice"
import quizReducer from "../features/quiz/quizSlice"
import resultTableReducer from "../features/resultTable/resultTableSlice"
import sessionReducer from "../features/auth/sessionSlice"
import sessionIdReducer from "../features/sessionId/sessionIdSlice"
import testsReducer from "../features/tests/testsSlice"

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        sessionID: sessionIdReducer,
        attempt: attemptReducer,
        quiz: quizReducer,
        leaderboard: leaderboardReducer,
        result: resultTableReducer,
        tests: testsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})