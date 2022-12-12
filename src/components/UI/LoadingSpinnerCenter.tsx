import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinnerCenter = () => {
  return (
    <div className="loading-spinner">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinnerCenter;
