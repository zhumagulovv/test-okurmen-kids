import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { endpoints } from "../../service/api";
import api from "../../service/api";

export const fetchSessions = createAsyncThunk(
    "session/fetchSessions",
    async (_, { rejectWithValue }) => {
        try {
            let allSessions = []
            let url = '/api/v1/sessions/'

            while (url) {
                const response = await api.get(url)
                const results = Array.isArray(response) ? response : (response.results ?? [])
                allSessions = [...allSessions, ...results]
                const next = response.next
                url = next
                    ? next.replace('https://okurmenkidstest.up.railway.app', '')
                    : null
            }

            return allSessions
        } catch (err) {
            return rejectWithValue(err.message || "Failed to fetch sessions")
        }
    }
)

const initialState = {
    sessionsID: [],
    activeSessionId: null,
    status: "idle",
    error: null,
};

const sessionIDSlice = createSlice({
    name: "sessionID",
    initialState,
    reducers: {
        setActiveSession(state, action) {
            state.activeSessionId = action.payload;
        },
        resetSessions() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSessions.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.sessionsID = action.payload;

                const active = state.sessionsID.find(
                    (s) => s.is_active || s.status === "active" || s.status === "open"
                )
                state.activeSessionId = (active ?? state.sessionsID[0])?.id ?? null
            })
            .addCase(fetchSessions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { setActiveSession, resetSessions } = sessionIDSlice.actions;
export default sessionIDSlice.reducer;

export const selectSessions = (state) => state.sessionID.sessionsID;
export const selectActiveSessionId = (state) => state.sessionID.activeSessionId;
export const selectSessionStatus = (state) => state.sessionID.status;
export const selectSessionError = (state) => state.sessionID.error;

export const selectActiveSession = createSelector(
    selectSessions,
    selectActiveSessionId,
    (sessions, id) => {
        if (!Array.isArray(sessions)) return null
        return sessions.find((s) => s.id === id) ?? null
    }
);

export const selectSessionOptions = createSelector(
    selectSessions,
    (sessions) => {
        if (!Array.isArray(sessions)) return [];
        return sessions.map((s) => ({
            label: s.title ?? s.name ?? `Session ${s.id}`,
            value: s.id,
        }))
    }
);