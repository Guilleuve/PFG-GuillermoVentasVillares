import "@mui/material";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import "react-icons";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/md";
import "react-router-dom";
import CookieConsent from "react-cookie-consent";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import theme from "./theme";

import HomePage from "components/pages/HomePage";
import PostWidget from "components/pages/PostPage";
import ProfilePage from "components/pages/ProfilePage";
import PrivateRoute from "./components/_more_components/PrivateRoute";
import PostCreate from "./components/pages/CreatePostPage";
import Login from "./components/pages/LoginPage";
import MessengerView from "./components/pages/MessengerPage";
import Register from "./components/pages/RegisterPage";
import SearchView from "./components/pages/SearchPage";
import { initiateSocketConnection } from "./helpers/socketHelper";
import PrivacyPage from "components/pages/PrivacyPage";

import { AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';


function App() {
  initiateSocketConnection();

  return (
  <AnimatePresence>
    <ThemeProvider theme={theme}>
    <CssBaseline />
		  <Suspense fallback={""}>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostWidget />} />
          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <PostCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/messenger"
            element={
              <PrivateRoute>
                <MessengerView />
              </PrivateRoute>
            }
          />
          <Route path="/search" element={<SearchView />} />
          <Route path="/users/:id" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<PrivacyPage />} />

        </Routes>
      </BrowserRouter>
      <CookieConsent
        style={{ textAlign: "center" }}
        debug={true}
        buttonStyle={{ color: "white", background: "#0051d3", marginRight: "20px" }}
        buttonText={"De acuerdo"}
      >
        Este sitio usa cookies. Para más información visita nuestra{" "}
        <a href="/privacy" style={{ color: "#478dff" }}>
          política de privacidad
        </a>
      </CookieConsent>
      </Suspense>
    </ThemeProvider>
  </AnimatePresence>
  );
}

export default App;
