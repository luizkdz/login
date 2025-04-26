import {Link, Navigate, redirect, useNavigate} from 'react-router-dom';
import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import Header from '../componentes/header';
import Footer from '../componentes/footer';
import './styles.css';
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

const handleGoogleRedirect = () => {
    window.location.href = "http://localhost:5000/auth/google";
}
  return (
      <div className="pagina-toda">
        <Header/>
        
        <div className="container-card-home">
        <div className="container-digite-email-imagem">
        <h1>Digite seu e-mail<br/>para iniciar uma sessão</h1>
        <img src = "/images/data-science.png" className="imagem-icone-data-science"/> 
        </div>
          <div className="card-home">
            
        <form onSubmit={handleSubmit}>
          <div className="container-login">
          <label htmlFor="email">Email:</label>
          <input className="input-email-senha" id="email" placeholder="Email" type="email"  onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="email">Senha:</label>
          <input className="input-email-senha" id="senha" placeholder="Senha" type="password" onChange={(e) => setSenha(e.target.value)} required />
          <button className="botao-entrar" type="submit">Entrar</button>
         <div className="container-links">
          <div className="criar-conta">
          <Link className = "link-criar-conta"to="/cadastrar">Criar Conta</Link></div>
          <div className="esqueci-senha">
          <Link className = "link-esqueci-senha"to ="/esqueci-minha-senha">Esqueceu sua senha?</Link></div>
          </div>
          <div className="container-hr-ou">
          <hr className="hr-class"/><p>ou</p><hr className="hr-class"/></div>
          <div className="login-google" onClick = {handleGoogleRedirect}>
          <GoogleLogin onError={() => {
            alert("Erro ao fazer login com o google");
          }}/>
          </div>
           </div>
        </form>
      </div>
      </div>
      <Footer/>
      </div>

    
  );
}

export default Home;