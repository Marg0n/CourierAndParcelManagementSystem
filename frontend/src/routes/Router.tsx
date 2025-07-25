import { Login } from "@/pages/auth/Login";
import { Registration } from "@/pages/auth/Registration";
import LandingPage from "@/pages/Landing/LandingPage";
import { createBrowserRouter } from "react-router-dom";

const Router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: 'login',
        element: <Login/>
    },
    {
        path: 'registration',
        element: <Registration/>
    },
]);

export default Router;
