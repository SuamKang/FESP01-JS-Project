import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TodoList from "./pages/list/TodoList";
import TodoRegist from "./pages/regist/TodoRegist";
import TodoInfo from "./pages/info/TodoInfo";
import TodoUpdate from "./pages/update/TodoUpdate";
import Error from "./pages/errors/Error";
import Root from "./pages/Root";

import "./index.css"; // global.css 복사

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    errorElement: <Error />,
    element: <Root />,
    children: [
      {
        path: "/",
        element: <TodoList />,
      },
      {
        path: "/regist",
        element: <TodoRegist />,
      },
      {
        path: "/info",
        element: <TodoInfo />,
      },
      {
        path: "/edit",
        element: <TodoUpdate />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
