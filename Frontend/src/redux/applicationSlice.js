import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        // allAppliedJobs: [],
        applicants:[],
    },
    reducers: {
        // setAllAppliedJobs: (state, action) => {
        //      state.allAppliedJobs = action.payload;
        //  },
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        }
    }
});
export const { setAllApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
