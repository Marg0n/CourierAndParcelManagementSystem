
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ErrorPage = () => {

  //* Navigation
  const navigate = useNavigate();
  const location = useLocation();
  const whereTo = location?.state;
  const fromWhere = location?.pathname;

  console.log(fromWhere,whereTo)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-sky-200 flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl font-bold text-sky-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Button size="lg" onClick={() => navigate("/")}>
        Go Back to Home
      </Button>
    </div>
  );
};

export default ErrorPage;
