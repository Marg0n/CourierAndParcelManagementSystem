
import ErrorBoundary from '@/pages/shared/errors/ErrorBoundary';
import { Outlet } from 'react-router-dom';

const AgentLayout = () => {
    return (
        <ErrorBoundary>
            <Outlet/>
        </ErrorBoundary>
    );
};

export default AgentLayout;