export const calcularFrete = (valor) => {
    return valor == 0 || valor === null ? "Frete Grátis" : `Frete: R$ ${valor}`;
};