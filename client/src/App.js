import "@mui/material";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import "react-icons";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/md";
import "react-router-dom";
import { useCookies } from 'react-cookie';
import React, { useState, useEffect } from 'react';

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
import { motion } from "framer-motion";
import { Suspense } from 'react';


function App() {
  initiateSocketConnection();
  const [showBanner, setShowBanner] = useState(true);

  const handleDeny = () => {
    localStorage.setItem('cookieConsent', 'denied');
    setShowBanner(false);
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  useEffect(() => {
    const userDecision = localStorage.getItem('cookieConsent');
    if (userDecision === 'denied' || userDecision === 'accepted') {
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

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
      {showBanner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, delay: 2 }}
                  transition={{
                    ease: 'easeInOut',
                    duration: 3,
                    delay: 0.15,
                  }}
                  className="cookie-consent"
                  style={{
                    backgroundColor: '#0051d3',
                    padding: '10px',
                    color: '#ffffff',
                    textAlign: 'center',
                    position: 'fixed',
                    bottom: '0',
                    width: '100%',
                  }}
                >
                  <p>
                    Este sitio usa cookies. Para más información visita nuestra{' '}
                    <a href="/privacy" style={{ color: '#FF7145' }}>política de privacidad</a>
                  </p>
                  <button onClick={handleDeny}>Denegar</button>
                  <button onClick={handleAccept}>Aceptar</button>
                </motion.div>
              )}
      </Suspense>
    </ThemeProvider>
  </AnimatePresence>
  );
}

export default App;
