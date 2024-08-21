import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { formDataState, initState } from '../store/formSlice';
import { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';

export interface formErrorState {
  [key: string]: string | undefined;
}

function UncotrolledForm() {
  const formData = useSelector((state: RootState) => state.formData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Z]/, 'First character must be uppercase')
      .required('Name is required'),
    age: Yup.string()
      .required('Age is required')
      .test('is-number', 'Age must be a number', value => !isNaN(parseFloat(value)))
      .test('is-integer', 'Age must be a whole number', value =>
        Number.isInteger(parseFloat(value))
      )
      .test('is-non-negative', 'Age must be a non-negative value', value => parseFloat(value) >= 0),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    gender: Yup.string().oneOf(['male', 'female']).required('Gender is required'),
    terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
    picture: Yup.string().required('Image is required'),
    country: Yup.array().of(Yup.string()).required('Country is required'),
    countrySelect: Yup.string().required('Country selection is required'),
  });

  const [data, setFormData] = useState({
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
  });

  const [formErrors, setFormErrors] = useState<Partial<formErrorState>>({});

  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await dataSchema.validate(data, { abortEarly: false });
      if (Object.keys(formErrors).length === 0) {
        dispatch(initState(data));
        navigate('/');
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: formErrorState = {
          name: '',
          age: '',
          email: '',
          password: '',
          confirmPassword: '',
          gender: '',
          terms: '',
          picture: '',
          country: '',
          countrySelect: '',
        };
        console.log(error.errors);
        console.log(error.value);
        error.inner.forEach(err => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setFormErrors(validationErrors);
        console.log(validationErrors);
        console.log(formErrors);
        console.log(event.defaultPrevented.valueOf);
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    setFormData(formData);
  }, [formData]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = event.target;
    console.log(name);
    switch (name) {
      case 'name':
        setFormData((prevData: formDataState) => ({
          ...prevData,
          name: event.target.value,
        }));
        break;
      case 'age':
        setFormData((prevData: formDataState) => ({
          ...prevData,
          age: event.target.value,
        }));
        break;
      case 'email':
        setFormData((prevData: formDataState) => ({
          ...prevData,
          email: event.target.value,
        }));
        break;
      case 'password':
        setFormData((prevData: formDataState) => ({
          ...prevData,
          password: event.target.value,
        }));
        break;
      case 'confirmPassword':
        setFormData((prevData: formDataState) => ({
          ...prevData,
          confirmPassword: event.target.value,
        }));
        break;
      case 'gender':
        setFormData((prevData: formDataState) => ({
          ...prevData,
          gender: event.target.value,
        }));
        break;
      case 'terms':
        setFormData((prevData: formDataState) => ({
          ...prevData,
          terms: (event.target as HTMLInputElement).checked,
        }));
        break;
      case 'countries':
        setFormData((prevData: formDataState) => ({
          ...prevData,
          countrySelect: event.target.value,
        }));
        break;
      case 'file':
        handlePictureUpload(event.target as HTMLInputElement);
        break;
      default:
        break;
    }
  }

  function handlePictureUpload(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;
    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      alert('File size should be less than 2 MB');
      return;
    }
    const allowedExtensions = ['image/png', 'image/jpeg'];
    if (!allowedExtensions.includes(file.type)) {
      alert('Only PNG and JPEG files are allowed');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prevData => ({
        ...prevData,
        picture: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <div className="main_container">
        <form className="uncontrolled-form" onSubmit={handleForm}>
          <div className="uncontrolled-input">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              required
              value={data.name}
              onChange={handleInputChange}
            ></input>
          </div>
          {formErrors.name && <div className="error">{formErrors.name}</div>}
          <div className="uncontrolled-input">
            <label htmlFor="age">Age:</label>
            <input
              type="text"
              name="age"
              required
              value={data.age}
              onChange={handleInputChange}
            ></input>
          </div>
          {formErrors.age && <div className="error">{formErrors.age}</div>}
          <div className="uncontrolled-input">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              required
              value={data.email}
              onChange={handleInputChange}
            ></input>
          </div>
          {formErrors.email && <div className="error">{formErrors.email}</div>}
          <div className="uncontrolled-input">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              required
              value={data.password}
              onChange={handleInputChange}
            ></input>
          </div>
          {formErrors.password && <div className="error">{formErrors.password}</div>}
          <div className="uncontrolled-input">
            <label htmlFor="password">Repeat password:</label>
            <input
              type="password"
              name="confirmPassword"
              required
              onChange={handleInputChange}
            ></input>
          </div>
          {formErrors.confirmPassword && <div className="error">{formErrors.confirmPassword}</div>}
          <fieldset className="uncontrolled-input-other">
            <legend>Gender:</legend>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={data.gender === 'male'}
                onChange={handleInputChange}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={data.gender === 'female'}
                onChange={handleInputChange}
              />
              <label htmlFor="female">Female</label>
            </div>
          </fieldset>
          {formErrors.gender && <div className="error">{formErrors.gender}</div>}
          <div className="uncontrolled-input-other">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={data.terms}
              onChange={handleInputChange}
            />
            <label htmlFor="terms">Terms and Conditions agreement</label>
          </div>
          {formErrors.terms && <div className="error">{formErrors.terms}</div>}
          <div className="uncontrolled-input-other">
            <label htmlFor="file">Upload picture:</label>
            <input
              type="file"
              name="file"
              accept="image/png, image/jpeg"
              onChange={handleInputChange}
            ></input>
          </div>

          {data.picture && (
            <div>
              <img src={data.picture} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
          {formErrors.picture && <div className="error">{formErrors.picture}</div>}
          <div className="uncontrolled-input-other">
            <label htmlFor="countries">Choose a country:</label>
            <select
              id="countries"
              name="countries"
              value={data.countrySelect}
              onChange={handleInputChange}
            >
              {data.country.map((country, index) => {
                return (
                  <option key={index} value={country}>
                    {country}
                  </option>
                );
              })}
            </select>
          </div>
          {formErrors.countrySelect && <div className="error">{formErrors.countrySelect}</div>}
          <button type="submit" className="form-link">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default UncotrolledForm;
