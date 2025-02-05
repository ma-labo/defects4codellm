import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import Plot from './Plot'
import About from './About'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "plots",
        element: <Plot />,
    },
    {
        path: "about",
        element: <About />,
    }
]);

ReactDOM.render(<RouterProvider router={router} />, document.getElementById('root'));