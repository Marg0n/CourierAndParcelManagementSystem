
import ErrorBoundaryWrapper from '@/pages/shared/errors/ErrorBoundary';
import ScrollToTop from '@/utils/ScrollToTop';
import { Outlet } from 'react-router-dom';

const AgentLayout = () => {
    return (
        <ErrorBoundaryWrapper>
            <ScrollToTop />
            <Outlet/>
        </ErrorBoundaryWrapper>
    );
};

export default AgentLayout;