import { useState } from "react";
import axios from "axios";
import './styles.css';
import Header from '../componentes/header/index.js'
import Footer from "../componentes/footer/index.js";
import { GoogleLogin } from "@react-oauth/google";
function CriarConta(){

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha,setSenha] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const resposta = await axios.post("http://localhost:5000/cadastrar", {nome, email, senha}, {include:true}, {withCredentials: true});
            
             await axios.post("http://localhost:5000/criar-costumer",{nome,email,idUsuario:resposta.data},{withCredentials:true});
            
            alert(resposta.data);
            window.location.href = "/";
        }
        catch(err){
            alert(err.response?.data);
        }
    
    }
    const handleBack = () => {
        window.location.href= "/";
    }
    const handleGoogleRedirect = () => {
        window.location.href = "http://localhost:5000/auth/google";
    }
    
    return (
    <div className="pagina-toda">
        <Header/>
        
        <div className="container-card-criar-conta">
        <div>
        <h3>Quero criar uma conta</h3>
        <div className="usar-conta-google-login-google">
        <p>Use sua conta google para se conectar*</p>
        <div className="login-google" onClick = {handleGoogleRedirect}>
          <GoogleLogin onError={() => {
            alert("Erro ao fazer login com o google");
          }}/>
          </div>
          </div>
        </div>
            <div className="card-pagina-criar-conta">  
        <form onSubmit={handleSubmit}>
            <div className="container-criarConta">
            <label htmlFor="nome">Nome:</label>
        <input className="input-email-senha" placeholder = "Nome" type = "nome" required onChange={(e) => setNome(e.target.value)}></input>
        <label htmlFor="email">Email:</label>
        <input className="input-email-senha" placeholder = "Email" type = "email" required onChange={(e) => setEmail(e.target.value)}></input>
        <label htmlFor="senha">Senha:</label>
        <input className="input-email-senha" placeholder = "Senha" required onChange={(e) => setSenha(e.target.value)}></input>
        <button className="botao-entrar" type="submit">Cadastrar</button>
         <button className="botao-entrar" onClick={handleBack}>Voltar</button>
        </div>
        </form>
       
        
    </div>
    </div>
    <Footer/>
    </div>

)}



export default CriarConta;