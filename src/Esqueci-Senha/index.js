import axios from "axios";
import { useState } from "react";


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
    
    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type= "email" placeholder= "Digite seu email" onChange = {(e) => {setEmail(e.target.value)}} ></input>
            <button type="submit">Enviar email</button>
        </form>
    </div>
    
)

}



export default EsqueciSenha;