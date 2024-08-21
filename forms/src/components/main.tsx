import { useNavigate } from 'react-router';

function MainComponent() {
  const navigate = useNavigate();
  const handleUncontrolledFormClick = () => {
    navigate('/uncontrolled');
  };
  return (
    <>
      <div className="main_container">
        <button className="form-link" onClick={handleUncontrolledFormClick}>
          Uncontrolled form
        </button>
        <button className="form-link"> React Hook Form</button>
      </div>
    </>
  );
}

export default MainComponent;
