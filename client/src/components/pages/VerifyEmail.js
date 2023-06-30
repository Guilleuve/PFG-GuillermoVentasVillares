import { Container } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "config";

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!isVerified) {
          const token = new URLSearchParams(window.location.search).get('token');
          await axios.get(BASE_URL + "verify-email", { params: { token } });
          setVerificationStatus("Correo electrónico validado exitosamente");
          setIsVerified(true);

          // Esperar 5 segundos y redirigir
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error) {
        console.log(error);
        setVerificationStatus('Error al verificar el correo electrónico.');
      }
    };

    verifyEmail();
  }, [isVerified, navigate]);

  return (
    <Container>
      <div>
        {verificationStatus ? (
          <>
            <div style={{ textAlign: 'center' }}>
              {isVerified ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="green" viewBox="0 0 24 24">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="red" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              )}
            </div>
            <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              {isVerified ? 'Verificación exitosa, se le redirigirá a la página principal' : 'Error al verificar el correo electrónico'}
            </p>
          </>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            Verificando el correo electrónico...
          </p>
        )}
      </div>
    </Container>
  );
};

export default VerifyEmail;