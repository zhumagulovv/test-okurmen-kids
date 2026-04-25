import { configureStore } from "@reduxjs/toolkit";

import attemptReducer from "../features/attempt/attemptSlice"
import leaderboardReducer from "../features/leaderboard/leaderboardSlice"
import quizReducer from "../features/quiz/quizSlice"
import sessionReducer from "../features/auth/sessionSlice"
import sessionIdReducer from "../features/sessionId/sessionIdSlice"
import trainingSessionReducer from "../features/training/TrainingSessionSlice"

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        sessionID: sessionIdReducer,
        attempt: attemptReducer,
        quiz: quizReducer,
        leaderboard: leaderboardReducer,
        trainingSession: trainingSessionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})