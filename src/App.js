import { BrowserRouter as Router } from "react-router-dom";
import Rotas from "./routes/index.js"; // Importando o arquivo de rotas

function App() {
  return (
    <Router>
      <Rotas />
    </Router>
  );
}

export default App;