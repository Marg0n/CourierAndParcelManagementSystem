import { Login } from "@/pages/auth/Login";
import { Registration } from "@/pages/auth/Registration";
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
