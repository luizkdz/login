import { BrowserRouter as Router } from "react-router-dom";
import Rotas from "./routes/index.js"; // Importando o arquivo de rotas
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CepProvider } from "./context/CepContext.js";
import './App.css';
function App() {
  return (
    <CepProvider>
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
    <Router>
      <Rotas />
    </Router>
    </GoogleOAuthProvider>
    </CepProvider>
  );
}

export default App;