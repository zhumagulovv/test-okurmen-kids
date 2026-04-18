import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { endpoints } from "../../service/api";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchResultTable = createAsyncThunk(
    "result/fetchResultTable",
    async (session_id, { rejectWithValue }) => {
        try {
            const response = await endpoints.resultTable(session_id);
            console.log(response.results)
            return response;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to fetch results");
        }
    }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
    // raw data
    students: [],       // array of student result objects
    meta: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        averageScore: 0,
        topStudentsCount: 0,
    },

    // ui state
    status: "idle",     // "idle" | "loading" | "succeeded" | "failed"
    error: null,

    // filters (client-side)
    filters: {
        search: "",
        group: "",
        status: "",
    },

    // pagination (client-side)
    currentPage: 1,
    pageSize: 10,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const resultSlice = createSlice({
    name: "result",
    initialState,
    reducers: {
        setSearch(state, action) {
            state.filters.search = action.payload;
            state.currentPage = 1; // reset to page 1 on new search
        },
        setGroupFilter(state, action) {
            state.filters.group = action.payload === "Все группы" ? "" : action.payload;
            state.currentPage = 1;
        },
        setStatusFilter(state, action) {
            state.filters.status = action.payload === "Любой статус" ? "" : action.payload;
            state.currentPage = 1;
        },
        setPage(state, action) {
            state.currentPage = action.payload;
        },
        clearFilters(state) {
            state.filters = { search: "", group: "", status: "" };
            state.currentPage = 1;
        },
        resetResult() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchResultTable.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.currentPage = 1
            })
            .addCase(fetchResultTable.fulfilled, (state, action) => {
                state.status = "succeeded";

                const payload = action.payload;

                if (Array.isArray(payload)) {
                    state.students = payload
                } else {
                    // Adjust these keys to match your actual API response shape
                    state.students = action.payload.students ?? action.payload.results ?? [];
                }


                state.meta = {
                    total: action.payload.total ?? state.students.length,
                    page: action.payload.page ?? 1,
                    pageSize: action.payload.page_size ?? 10,
                    totalPages: action.payload.total_pages ?? 1,
                    averageScore: action.payload.average_score ?? 0,
                    topStudentsCount: action.payload.top_students_count ?? 0,
                };
            })
            .addCase(fetchResultTable.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const {
    setSearch,
    setGroupFilter,
    setStatusFilter,
    setPage,
    clearFilters,
    resetResult,
} = resultSlice.actions;

export default resultSlice.reducer;

// ─── Base Selectors ───────────────────────────────────────────────────────────

const selectResultState = (state) => state.result;

export const selectAllStudents = (state) => state.result.students;
export const selectMeta = (state) => state.result.meta;
export const selectResultStatus = (state) => state.result.status;
export const selectResultError = (state) => state.result.error;
export const selectFilters = (state) => state.result.filters;
export const selectCurrentPage = (state) => state.result.currentPage;
export const selectPageSize = (state) => state.result.pageSize;

// ─── Derived / Memoised Selectors ─────────────────────────────────────────────

/** Students after search + group + status filters applied */
export const selectFilteredStudents = createSelector(
    selectAllStudents,
    selectFilters,
    (students, { search, group, status }) => {
        return students.filter((s) => {
            const matchSearch =
                !search ||
                s.name?.toLowerCase().includes(search.toLowerCase()) ||
                s.group?.toLowerCase().includes(search.toLowerCase()) ||
                String(s.id ?? "").includes(search);

            const matchGroup = !group || s.group === group;
            const matchStatus = !status || s.status === status;

            return matchSearch && matchGroup && matchStatus;
        });
    }
);

/** Current page slice of filtered students */
export const selectPagedStudents = createSelector(
    selectFilteredStudents,
    selectCurrentPage,
    selectPageSize,
    (filtered, page, size) => {
        const start = (page - 1) * size;
        return filtered.slice(start, start + size);
    }
);

/** Total pages based on filtered count */
export const selectTotalPages = createSelector(
    selectFilteredStudents,
    selectPageSize,
    (filtered, size) => Math.max(1, Math.ceil(filtered.length / size))
);

/** Unique group names for the dropdown */
export const selectGroupOptions = createSelector(
    selectAllStudents,
    (students) => ["Все группы", ...new Set(students.map((s) => s.group).filter(Boolean))]
);

/** Average score across ALL loaded students */
export const selectAverageScore = createSelector(
    selectAllStudents,
    (students) => {
        const scored = students.filter((s) => s.score != null);
        if (!scored.length) return 0;
        return Math.round(scored.reduce((sum, s) => sum + s.score, 0) / scored.length);
    }
);

/** Top students (score >= 90) */
export const selectTopStudents = createSelector(
    selectAllStudents,
    (students) => students.filter((s) => s.score >= 90)
);