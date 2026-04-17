import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../../service/api";

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchLeaderboard = createAsyncThunk(
    "leaderboard/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await endpoints.leaderboard();
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
);

export const fetchLeaderboardById = createAsyncThunk(
    "leaderboard/fetchById",
    async (sessionId, { rejectWithValue }) => {
        try {
            return await endpoints.leaderboardId(sessionId);
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const leaderboardSlice = createSlice({
    name: "leaderboard",
    initialState: {
        // global leaderboard (no session filter)
        global: null,
        // session-scoped leaderboard
        session: null,
        // which session the user has selected in the UI
        selectedSessionId: "",
        textTest: "",
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedSessionId(state, action) {
            state.selectedSessionId = action.payload;
            state.session = null; // clear previous session data
        },
        clearLeaderboard(state) {
            state.global = null;
            state.session = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── global ──────────────────────────────────────────────────────
            .addCase(fetchLeaderboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.global = action.payload;
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ── by session ──────────────────────────────────────────────────
            .addCase(fetchLeaderboardById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaderboardById.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload;
            })
            .addCase(fetchLeaderboardById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedSessionId, clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;