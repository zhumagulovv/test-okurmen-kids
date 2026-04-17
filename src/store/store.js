import { configureStore } from "@reduxjs/toolkit";

import attemptReducer from "../features/attempt/attemptSlice"
import sessionReducer from "../features/auth/sessionSlice"
import sessionIdReducer from "../features/sessionId/sessionIdSlice"
import quizReducer from "../features/quiz/quizSlice"
import leaderboardReducer from "../features/leaderboard/leaderboardSlice"
import resultTableReducer from "../features/resultTable/resultTableSlice"

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        sessionID: sessionIdReducer,
        attempt: attemptReducer,
        quiz: quizReducer,
        leaderboard: leaderboardReducer,
        result: resultTableReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})