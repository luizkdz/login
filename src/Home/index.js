import {Link, Navigate, redirect, useNavigate} from 'react-router-dom';
import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
function Home(){



  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.post("http://localhost:5000/login", 
        { email, senha }, 
        { withCredentials: true },
        {include:true}
      );

      if (resposta.status === 200) {
        navigate("/paginainicial");
      }   
    } catch (err) {
      alert("Erro ao fazer login");
    }
};

const handleGoogleSuccess = async (credentialResponse) => {
  try {
      const resposta = await axios.post("http://localhost:5000/auth/google", 
          { token: credentialResponse.credential }, 
          { withCredentials: true }
      );

      if (resposta.status === 200) {
          navigate("/paginainicial");
      }
  } catch (error) {
      alert("Erro ao autenticar com o Google");
  }
};
const handleGoogleRedirect = () => {
    window.location.href = "http://localhost:5000/auth/google";
}
  return (
      <div className="App">
        <form onSubmit={handleSubmit}>
          <input id="email" placeholder="Email" type="email" className="input-login" onChange={(e) => setEmail(e.target.value)} required />
          <input id="senha" placeholder="Senha" type="password" className="input-login" onChange={(e) => setSenha(e.target.value)} required />
          <button type="submit">Logar</button>
          <Link to="/cadastrar">Criar Conta</Link>
          <Link to ="/esqueci-minha-senha">Esqueceu sua senha?</Link>
          <div onClick = {handleGoogleRedirect}>
          <GoogleLogin onError={() => {
            alert("Erro ao fazer login com o google");
          }}/>
          </div> 
        </form>
      </div>
    
  );
}

export default Home;