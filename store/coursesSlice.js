import { createSlice } from "@reduxjs/toolkit";

const coursesSlice = createSlice({
  name: "courses",
  initialState: [],
  reducers: {
    setCourses: (state, action) => action.payload,
    addCourse: (state, action) => [action.payload, ...state],
    updateCourse: (state, action) =>
      state.map((course) =>
        course.id === action.payload.id ? action.payload : course
      ),
    deleteCourse: (state, action) =>
      state.filter((course) => course.id !== action.payload),
  },
});

export const { setCourses, addCourse, updateCourse, deleteCourse } =
  coursesSlice.actions;
export default coursesSlice.reducer;
