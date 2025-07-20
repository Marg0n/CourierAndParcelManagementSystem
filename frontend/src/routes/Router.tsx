import { Login } from "@/components/auth/login";
import { createBrowserRouter } from "react-router-dom";

const Router = createBrowserRouter([
    {
        path: 'login',
        element: <Login/>
    }
]);

export default Router;
