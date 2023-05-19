import { Box, Container, Stack } from "@mui/material";
import GoBack from "../_more_components/GoBack";

const PrivacyPage = () => {
  return (
    <Container>
      <Box margin={5}></Box>
      <GoBack />

      <Stack spacing={2}>
        <h1 style={{ color: "#333", fontSize: "24px", textAlign: "justify" }}>Política de Privacidad</h1>
        <p style={{ color: "#666", fontSize: "16px", textAlign: "justify" }}>
          En esta web, nos importa tu privacidad y queremos asegurarnos de que entiendes cómo utilizamos las cookies. Pero no te preocupes, no estamos aquí para recolectar información personal sobre ti ni para invadir tu espacio virtual.
        </p>
        <p style={{ color: "#666", fontSize: "16px", textAlign: "justify" }}>
          Nuestras cookies son como pequeños ayudantes tecnológicos que se encargan de que todo funcione a la perfección en este sitio web. Son necesarias para proporcionar una experiencia de usuario fluida y eficiente.
        </p>
        <p style={{ color: "#666", fontSize: "16px", textAlign: "justify" }}>
          A diferencia de otras páginas, no utilizamos cookies para rastrear tus movimientos en línea ni para recopilar información personal.
        </p>
        <p style={{ color: "#666", fontSize: "16px", textAlign: "justify" }}>
          Valoramos tu privacidad tanto como tú, y estamos comprometidos a protegerla. Si tienes alguna pregunta sobre nuestra política de privacidad o sobre cómo utilizamos las cookies, no dudes en contactarnos.
        </p>
        <p style={{ color: "#666", fontSize: "16px", textAlign: "justify" }}>
          ¡Disfruta navegando por nuestra web y no olvides que tus datos personales están a salvo con nosotros!
        </p>
        <Box marginTop={20}></Box>
        <img src="/assets/privacyImage.svg" height="500px" alt="Política de privacidad" />
      </Stack>
    </Container>
  );
};

export default PrivacyPage;