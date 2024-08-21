import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Yup from 'yup';

export interface formDataState {
  name: string;
  age:string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  terms: boolean;
  picture: string;
  country: string[];
  countrySelect: string;
}

const initialFormDataState: formDataState = {
  name: '',
  age: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: 'male',
  terms: false,
  picture: '',
  country: ['Russia', 'Belarus', 'China'],
  countrySelect: '',
};

export const formDataSlice = createSlice({
  name: 'formData',
  initialState: initialFormDataState,
  reducers: {
    initState: (state, action: PayloadAction<formDataState>) => {
      console.log(action.payload);
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { initState } = formDataSlice.actions;

export default formDataSlice.reducer;
