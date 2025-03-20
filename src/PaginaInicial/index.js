import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaginaInicial() {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    try{
      const resposta = await axios.post("http://localhost:5000/renovarsessao", {}, { withCredentials: true });
      const token = resposta.data.token;
      return token;
    }
    catch(err){
      return null;
    }
  }
  const pickName = async () => {
    try {
      const resposta = await axios.get("http://localhost:5000/paginainicial", { withCredentials: true });
      if (resposta.data) {
        setNome(resposta.data.nome);
      }
      console.log("Nome recebido:", resposta.data);
    } catch (error) {     
      if ((error.response && error.response.status === 401) || (error.response && error.response.status === 403)){
        const novoTokenAcesso = await refreshAccessToken();

        if (novoTokenAcesso) {
          try {
            const novaResposta = await axios.get("http://localhost:5000/paginainicial", {withCredentials:true});
          
            if (novaResposta.data) {
              setNome(novaResposta.data.nome);
            }
          } catch (novoErro) {
            console.error("Erro ao buscar nome após renovação do token:", novoErro);
            alert("Não foi possível renovar o token.");
          }
        } else {  
          console.warn("Token não pôde ser renovado. Usuário precisa fazer login novamente.");
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await pickName();
    };
    
  
    fetchData();
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