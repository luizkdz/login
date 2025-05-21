import { BrowserRouter as Router } from "react-router-dom";
import Rotas from "./routes/index.js"; // Importando o arquivo de rotas
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CepProvider } from "./context/CepContext.js";
import './App.css';
import { CarrinhoProvider } from "./context/carrinhoContext.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RPQUjPDLwp5J169RayJV15xJQ9aE9bkqtnknFrGbJuPk3Hf6HXr6Lh7TxsQTKoEZcsfw1vA4sWllB1RKw9LG5Wp00g2M3D8ap")
function App() {
  return (
    <Elements stripe={stripePromise}>
    <CarrinhoProvider>
    <CepProvider>
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
    <Router>
      <Rotas />
    </Router>
    </GoogleOAuthProvider>
    </CepProvider>
    </CarrinhoProvider>
    </Elements>
  );
}

export default App;