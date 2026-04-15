import { configureStore } from "@reduxjs/toolkit";

import attemptReducer from "../features/attempt/attemptSlice"
import sessionReducer from "../features/auth/sessionSlice"
import quizReducer from "../features/quiz/quizSlice"

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        attempt: attemptReducer,
        quiz: quizReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})