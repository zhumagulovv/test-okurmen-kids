import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { endpoints } from "../../service/api";

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchSessions = createAsyncThunk(
    "session/fetchSessions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await endpoints.sessions();
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch sessions");
        }
    }
);

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
    sessionsID: [],           // full list from API
    activeSessionId: null,  // currently selected session ID
    status: "idle",         // "idle" | "loading" | "succeeded" | "failed"
    error: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

const sessionSlice = createSlice({
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

                // Handle both array response and paginated { results: [] } shape
                const raw = action.payload;
                state.sessionsID = Array.isArray(raw)
                    ? raw
                    : (raw.results ?? raw.sessionsID ?? []);

                // Auto-select: prefer the latest active/open session,
                // fall back to the first session in the list
                const active = state.sessionsID.find(
                    (s) => s.is_active || s.status === "active" || s.status === "open"
                );
                state.activeSessionId = (active ?? state.sessionsID[0])?.id ?? null;
            })
            .addCase(fetchSessions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { setActiveSession, resetSessions } = sessionSlice.actions;
export default sessionSlice.reducer;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectSessions = (state) => state.sessionID.sessions;
export const selectActiveSessionId = (state) => state.sessionID.activeSessionId;
export const selectSessionStatus = (state) => state.sessionID.status;
export const selectSessionError = (state) => state.sessionID.error;

/** Full object of the currently active session */
export const selectActiveSession = createSelector(
    selectSessions,
    selectActiveSessionId,
    (sessions, id) => {
        if(!Array.isArray(sessions)) return null

        return sessions.find((s) => s.id === id) ?? null
    }
);

/** Dropdown-ready list: [{ label, value }] */
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