import { Login } from "@/components/auth/Login";
import { Registration } from "@/components/auth/Registration";
import { createBrowserRouter } from "react-router-dom";

const Router = createBrowserRouter([
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
