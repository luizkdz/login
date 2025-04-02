export const calcularDesconto = (desconto) => {
    const descontoNumber = Number(desconto);
    return descontoNumber ? `(${descontoNumber}% de desconto no pix)` : "";
}