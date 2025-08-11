// App.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import TransactionList from "./component/TransactionList";
import Layout from "./Layout";
import Home from "./Home";
import EditTranactionPage from "./component/EditTranactionPage";
import Activities from "./pages/Activities";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserContextProvider from "./UserContext";
import axios from "axios";
import ProfilePage from "./pages/ProfilePage";
import IndexPage from "./pages/IndexPage";
import SplitExpanse from "./component/SplitExpanse";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPasswordPage from "./pages/ResetPasswordPage";

axios.defaults.withCredentials = true;


function App() {
  const [refresh, setRefresh] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);

  return (
    <UserContextProvider>
      <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route
              path="/home"
              element={
                <Home
                  totalBalance={totalBalance}
                  setRefresh={setRefresh}
                  setTotalBalance={setTotalBalance}
                />
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
            <Route path="/split-expanse" element={<SplitExpanse/>}/>


            <Route
              path="/transactions"
              element={
                <TransactionList
                  totalBalance={totalBalance}
                  setTotalBalance={setTotalBalance}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              }
            />

            <Route
              path="transactions/updateTransaction/:id"
              element={<EditTranactionPage />}
            />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/:id" element={<Activities />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right mt-6"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    </UserContextProvider>
  );
}

export default App;
