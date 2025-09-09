
import ErrorBoundary from '@/pages/shared/errors/ErrorBoundary';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <ErrorBoundary>
           <Outlet/>
        </ErrorBoundary>
    );
};

export default AdminLayout;