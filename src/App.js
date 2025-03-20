import { BrowserRouter as Router } from "react-router-dom";
import Rotas from "./routes/index.js"; // Importando o arquivo de rotas
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
    <Router>
      <Rotas />
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;