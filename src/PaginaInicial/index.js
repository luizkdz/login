import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaginaInicial() {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const pickName = async () => {
      try {
        const resposta = await axios.get("http://localhost:5000/paginainicial", { withCredentials: true });
        setNome(resposta.data.nome);
        console.log("Nome recebido:", resposta.data.nome); // Mova o console.log para cá
      } catch (error) {
        console.log("Erro ao buscar nome:", error);
      }
    };
    pickName();
  }, []);

  const handleLogout = async () => {
    try{
        const resposta = await axios.post("http://localhost:5000/logout", {}, {withCredentials: true});
        
        alert(resposta.data.message);
    }
    catch(error){
        alert("Erro ao fazer logout");
    }
    navigate('/');
  }

  return (
    <div>
      <h1>Bem-vindo, {nome} </h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default PaginaInicial;