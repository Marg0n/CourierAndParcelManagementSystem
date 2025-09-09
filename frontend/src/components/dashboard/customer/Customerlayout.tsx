
import ErrorBoundary from '@/pages/shared/errors/ErrorBoundary';
import { Outlet } from 'react-router-dom';

const Customerlayout = () => {
    return (
        <ErrorBoundary>
            <Outlet/>
        </ErrorBoundary>
    );
};

export default Customerlayout;