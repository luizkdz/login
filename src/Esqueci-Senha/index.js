import axios from "axios";
import { useState } from "react";
import './styles.css';
import Header from '../componentes/header/index.js'
import Footer from "../componentes/footer/index.js";
import { GoogleLogin } from "@react-oauth/google";

const handleGoogleRedirect = () => {
    window.location.href = "http://localhost:5000/auth/google";
}
function EsqueciSenha() {
    const[email,setEmail] = useState("");
    const [emailEnviado, setEmailEnviado] = useState("");
    const [mostrarEmailEnviado, setMostrarEmailEnviado] = useState(false);
    const [mostrarEmailNaoEnviado, setMostrarEmailNaoEnviado] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const resposta = await axios.post("http://localhost:5000/esqueci-minha-senha", {email});
            setEmailEnviado(resposta.data.message.email);
            setMostrarEmailEnviado(true);
            setMostrarEmailNaoEnviado(false)
        }
        catch(error){
            setMostrarEmailNaoEnviado(true);
        }
        
    }

    const handleVoltar = () => {
        window.location.href = "/";
    }
    
    return (
    <div className="pagina-toda">
        <Header/>
        <div className="card-container-pagina-esqueci-senha">
            <div className="insira-seu-email">
            <h3>Insira o seu e-mail para continuar</h3>
            <div className="usar-conta-google-login-google">
            <p>Use sua conta google para se conectar*</p>
            <div className="login-google" onClick = {handleGoogleRedirect}>
          <GoogleLogin onError={() => {
            alert("Erro ao fazer login com o google");
          }}/>
          </div>
          </div>
            <div className="card-pagina-esqueci-senha">
                <form onSubmit={(e) => handleSubmit(e)}>
                <div className="container-email">
                <label htmlFor="email">Email:</label>
                    <input className="input-email-senha" type= "email" placeholder= "Digite seu email" onChange = {(e) => {setEmail(e.target.value)}} ></input>
                    {mostrarEmailEnviado && (
                        <div><p>O email foi enviado para {emailEnviado}✅</p></div>
                    )}
                    {mostrarEmailNaoEnviado && (
                        <div><p>Ocorreu um erro, o email não foi enviado ❌</p></div>
                    )}
                    <button style={{cursor:"pointer"}}className="botao-entrar" type="submit">Enviar email</button>
                    
                    <button style={{cursor:"pointer"}} className="botao-entrar" onClick={() => handleVoltar()}>Voltar</button>
                </div>
                </form>
                
        </div>
        </div>
    </div>
    <Footer/>
    </div>
    
)

}



export default EsqueciSenha;