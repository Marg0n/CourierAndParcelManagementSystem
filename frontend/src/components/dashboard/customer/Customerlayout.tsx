
import ErrorBoundaryWrapper from '@/pages/shared/errors/ErrorBoundary';
import { Outlet } from 'react-router-dom';

const Customerlayout = () => {
    return (
        <ErrorBoundaryWrapper>
            <Outlet/>
        </ErrorBoundaryWrapper>
    );
};

export default Customerlayout;