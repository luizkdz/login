export const calcularFrete = (valor) => {
    return valor == 0 ? "Frete Grátis" : `Frete: R$ ${valor}`;
};