
import Error404Page from "../pages/Error404Page";
import HelloPage from "../pages/HelloPage";
import MainPage from "../pages/MainPage";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";



const UserRouter = () => {
  return (
    <Routes>
      <Route path="" element={<MainPage />} errorElement={<Error404Page />} />
      <Route
        path="/hello"
        element={<HelloPage />}
        errorElement={<Error404Page />}
      />
      <Route
        path="/home"
        element={<HomePage />}
        errorElement={<Error404Page />}
      />
    </Routes>
  );
};

export default UserRouter;