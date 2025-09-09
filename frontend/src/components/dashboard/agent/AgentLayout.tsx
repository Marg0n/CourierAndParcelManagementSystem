
import ErrorBoundaryWrapper from '@/pages/shared/errors/ErrorBoundary';
import { Outlet } from 'react-router-dom';

const AgentLayout = () => {
    return (
        <ErrorBoundaryWrapper>
            <Outlet/>
        </ErrorBoundaryWrapper>
    );
};

export default AgentLayout;