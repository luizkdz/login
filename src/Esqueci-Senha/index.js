import axios from "axios";
import { useState } from "react";
import './styles.css';
import Header from '../componentes/header/index.js'
import Footer from "../componentes/footer/index.js";
function EsqueciSenha() {
    const[email,setEmail] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const resposta = await axios.post("http://localhost:5000/esqueci-minha-senha", {email});
            
            alert(`O email foi enviado para ${resposta.data.message.email}`);
        }
        catch(error){
            alert("Email não enviado");
        }
        
    }

    const handleVoltar = () => {
        window.location.href = "/";
    }
    
    return (
    <div className="pagina-toda">
        <Header/>
        <div className="card-container">
            <div className="card">
                <img src = "./images/logo.svg" alt= "logo"/>
                <form onSubmit={handleSubmit}>
                <div className="container-email">
                    <input type= "email" placeholder= "Digite seu email" onChange = {(e) => {setEmail(e.target.value)}} ></input>
                    <button type="submit">Enviar email</button>
                    <button onClick={handleVoltar}>Voltar</button>
                </div>
                </form>
                
        </div>
    </div>
    <Footer/>
    </div>
    
)

}



export default EsqueciSenha;