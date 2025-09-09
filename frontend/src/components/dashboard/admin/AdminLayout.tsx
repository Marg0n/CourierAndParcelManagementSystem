
import ErrorBoundaryWrapper from '@/pages/shared/errors/ErrorBoundary';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <ErrorBoundaryWrapper>
           <Outlet/>
        </ErrorBoundaryWrapper>
    );
};

export default AdminLayout;