import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const CepContext = createContext();

export const CepProvider = ({ children }) => {
    const [cep, setCep] = useState("Insira seu cep");

    useEffect(() => {
        const obterCepDoServidor= async () => {
            try{
                const response = await axios.get("http://localhost:5000/obter-localidade", {withCredentials:true});
                if(response.data.localidade && response.data.localidade !== "Insira seu CEP"){
                    setCep(response.data.localidade);
                }
            }
            catch(err){
                console.error("Erro ao obter CEP:", err);
            }
        }
        obterCepDoServidor();
    },[]);

    return (
        <CepContext.Provider value={{ cep, setCep }}>
            {children}
        </CepContext.Provider>
    );
};

// Retorna o contexto corretamente e lança erro caso seja usado fora do Provider
export const useCep = () => {
    const context = useContext(CepContext);
    if (!context) {
        throw new Error("useCep deve ser usado dentro de um CepProvider");
    }
    return context;
};