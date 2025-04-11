import { useState } from "react";
import './styles.css';
import axios from "axios";
import { useCep } from "../../context/CepContext";
const ModalCep = ({ fecharModalCep, calcularFretePorCep, setLocalidade, setValorFrete, setPrazo,produtoId }) => {
    const {setCep} = useCep();
    const [tempCep, setTempCep] = useState("");

    const handleCepChange = (e) => {
        setTempCep(e.target.value);
    };

    const handleConfirmarCep = async () => {
        try {
            // Busca localidade no ViaCEP
            const response = await axios.get(`https://viacep.com.br/ws/${tempCep}/json`);
            const novaLocalidade = response.data.localidade;

            if (!novaLocalidade) {
                alert("CEP inválido. Por favor, tente novamente.");
                return;
            }

            // Salva localidade no backend (cookie)
            await axios.post("http://localhost:5000/definir-localidade", { localidade: tempCep }, { withCredentials: true });

            // Atualiza estados no componente pai
            setCep(tempCep);
            await calcularFretePorCep(produtoId,tempCep, setLocalidade, setValorFrete, setPrazo);

            fecharModalCep();
        } catch (err) {
            console.error("Erro ao definir localidade:", err);
        }
    };

    return (
        <div className="modal-cep">
            <div className="modal-conteudo">
                <img src="/images/phone.png" className="imagem-mapa-celular" alt="Mapa no celular"/>
                <h3>Digite seu CEP</h3>
                <input 
                    type="text" 
                    className="input-cep" 
                    placeholder="Digite seu CEP" 
                    value={tempCep} 
                    onChange={handleCepChange} 
                    maxLength={8} 
                    autoFocus 
                />
                <div className="botoes-modal">
                    <button onClick={fecharModalCep} className="botao-cancelar">Cancelar</button>
                    <button className="botao-confirmar" onClick={handleConfirmarCep}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalCep;