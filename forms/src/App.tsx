import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainComponent from './components/main';
import UncotrolledForm from './components/uncontrolledFrom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainComponent />}></Route>
          <Route path="/uncontrolled" element={<UncotrolledForm />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
