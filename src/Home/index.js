import {Link, Navigate, useNavigate} from 'react-router-dom';
import { useState } from "react";
import axios from "axios";

function Home(){



const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.post("http://localhost:5000/login", { nome, senha }, {include:true}, {withCredentials: true});
      if(resposta.status === 200){
        document.cookie = `usuarioLogado=${resposta.data.nome}; max-age=3600; path=/;`  
      }
      navigate("/paginainicial");
    } catch (err) {
      alert("Erro ao fazer login");
    }
  };

  return (
    
      

      <div className="App">
        <form onSubmit={handleSubmit}>
          <input id="email" placeholder="Email" type="email" className="input-login" onChange={(e) => setNome(e.target.value)} required />
          <input id="senha" placeholder="Senha" type="password" className="input-login" onChange={(e) => setSenha(e.target.value)} required />
          <button type="submit">Logar</button>
          <Link to="/cadastrar">Criar Conta</Link> 
        </form>
      </div>
    
  );
}

export default Home;