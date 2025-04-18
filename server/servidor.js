import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import session from "express-session";
import passport from "../server/passport.js";
import axios from "axios";

dotenv.config();

const app = express();
const port = 5000;


const emailTransporter = process.env.EMAIL_TRANSPORTER;
const senhaEmail = process.env.SENHA_EMAIL;


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailTransporter,
        pass: senhaEmail
    }
});


app.use(session({
    secret: "segredo_seguranca",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST","DELETE","PUT"],
    credentials: true,
    allowedHeaders: ["Content-type", "Authorization"]
}));

app.use(cookieParser());


export const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"loginBd",
    port:"3306"
});

const gerarTokens = async (usuarioId) => {
    const accessToken = jwt.sign({usuarioId} , "segredo_seguranca", {expiresIn:"15m"});
    const refreshToken = jwt.sign({usuarioId}, "segredo_seguranca", {expiresIn:"7d"});

    await db.query("INSERT INTO refresh_tokens (usuario_id, token) VALUES (?, ?)" , [usuarioId, refreshToken]);

    return {accessToken, refreshToken};
}



const autenticarToken = async (req, res, next) => {
    
    const token = req.cookies.accessToken;
    
    if (!token) {
        return res.status(401).json({ message: "Token ausente ou inválido" });
    } 
    jwt.verify(token, "segredo_seguranca", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token inválido" });
        req.usuarioId = decoded.usuarioId;
        next();
      });

}

app.get("/paginainicial",autenticarToken, async (req, res) => {
    const [usuarios] = await db.query("SELECT nome FROM usuarios where id = ?",[req.usuarioId]);
    if(usuarios.length === 0 ){
        return res.status(404).json({message: "Usuario não encontrado"});
    }
    
    return res.status(200).json({nome:usuarios[0].nome});
})
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const encontrado = usuarios[0];

    if (!encontrado || !(await bcrypt.compare(senha, encontrado.senha_hash))) {
        return res.status(401).json({message:"Usuário ou senha inválidos"});
    }

    const { accessToken, refreshToken } = await gerarTokens(encontrado.id);

    res.cookie("accessToken", accessToken,{
        httpOnly:true,
        maxAge: 1 * 60 * 1000,
        
    });
    res.cookie("refreshToken", refreshToken , {
        httpOnly:true,
        maxAge:15 * 60 * 1000 * 4 * 24 * 7,
    })
    
    res.json({ accessToken });
});

app.post("/renovarsessao" , async (req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
       return res.status(400).json({message:"Token invalido"});
    }

    try{

    const [token] = await db.query("SELECT * from refresh_tokens where token = ?", [refreshToken]);
    
    if(token.length === 0){
        return res.status(400).json({message:"token não existe"});
    }
    const tokenCerto = token[0].token;
    
    try {
        const decoded = jwt.verify(tokenCerto, "segredo_seguranca");
        const newAccessToken = jwt.sign(
            { usuarioId: decoded.usuarioId },
            "segredo_seguranca",
            { expiresIn: "15m" }
        );
        res.cookie("accessToken", newAccessToken,{
            httpOnly:true,
            maxAge: 1 * 60 * 1000,
        })
        return res.status(200).json({token:newAccessToken});
    }
    catch(erro){
        return res.status(400).json({message:"Token invalido"})
    
    }
} catch(erro){
    return res.status(500).json({message:"Erro interno do servidor"});
}
})  

app.get("/", (req, res) => {
    res.send("Servidor rodando com sucesso!");
});

app.get("/auth/google", passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback", passport.authenticate("google",{failureRedirect:"/"}), 
    async (req,res) => {
        const email = req.user.emails[0].value;
        const [usuarios] = await db.query("SELECT * FROM usuarios where email = ?",[email]);
        const usuario = usuarios[0];
        if(!usuario){
            return res.status(400).json({message: "Usuario não encontrado"});
        }
        const {accessToken, refreshToken} = await gerarTokens(usuario.id);

        res.cookie("accessToken", accessToken,
            {httpOnly:true,
            maxAge:15 * 60 * 1000
            }
         )
         res.cookie("refreshToken", refreshToken,
            {httpOnly:true,
            maxAge:15 * 60 * 1000 * 4 * 24 * 7
            }
         )
         res.redirect("http://localhost:3000/paginainicial");
})

app.get("/auth/logout", (req, res) => {
    req.logout(() => {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.redirect("http://localhost:3000");
    });
});

app.post("/cadastrar", async (req,res) => {
    const {nome, email, senha} = req.body;

    const hashedPassword = await bcrypt.hash(senha,10);

    try{
        const emailJaExiste = await db.query("SELECT * from usuarios where email = ?", [email]);
        if(emailJaExiste[0].length > 0 ){
            return res.status(400).send("O email já é cadastrado");
        }
        await db.query("INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)", [nome,email, hashedPassword]);
    
    return res.status(200).send("O usuario foi criado com sucesso");
}
catch(error){
    return res.status(500).send("Erro ao cadastrar usuario");
}
});

app.post("/logout", async (req, res) => {
    const accessToken = req.cookies.accessToken;
    res.clearCookie("accessToken", { httpOnly: true });
    db.query("DELETE FROM refresh_tokens where token = ? ", [accessToken]);
    return res.status(200).json({ message: "Logout realizado com sucesso!" });
});

const enviarEmail = async (destinatario, assunto, mensagem) => {
    try{
        await transporter.sendMail({
        from: emailTransporter,
        to: destinatario,
        subject:assunto,
        text:mensagem
    })}
    catch(error){
        console.log(error);
}
}

const gerarNovaSenha = (tamanho) => {
    return crypto.randomBytes(tamanho).toString("base64").slice(0,tamanho);
}
app.post("/esqueci-minha-senha",async (req,res) => {
    const {email} = req.body;
    try{
        const [usuarioEmail] = await db.query("SELECT email from usuarios where email = ?",[email]);
        
        if(usuarioEmail.length === 0){
            return res.status(400).json({message: "O email não está cadastrado"});
        }
        const usuarioSelecionado = usuarioEmail[0];
        const novaSenha = gerarNovaSenha(12);
        const novaSenhaComHash = await bcrypt.hash(novaSenha,10);
        await db.query("UPDATE usuarios SET senha_hash = ? where email = ?",[novaSenhaComHash,usuarioSelecionado.email]);
        await enviarEmail(usuarioSelecionado.email, "Restauração de senha", `Olá usuário sua senha é ${novaSenha}`);
       return res.status(200).send({message: usuarioSelecionado});
    }
    catch(error){
       return res.status(400).json({message:"Esse email não é válido"});
    }
})


app.get("/produtos", async (req,res) => {
    
    try{
        const localidade = req.query.localidade || '';
        const { marcas, promocoes, tipoEntrega, tipoCompra, tipoProduto, vendidoPor, categoria, preco,  entrega, avaliacao } = req.query;
        const precoMin = req.query.precoMin;
        const precoMax = req.query.precoMax;
        const params = [localidade];
        let query = `SELECT 
    p.id, p.nome, p.preco, p.descricao, p.preco_parcelado, 
    p.parcelas_máximas, p.preco_pix, p.desconto, COUNT(DISTINCT p.id) as total_produtos,
    COALESCE(MIN(f.valor), MIN(f_default.valor), 0) AS valor_frete, 
    (SELECT i.url FROM imagens_produto i WHERE i.produto_id = p.id LIMIT 1) AS url, 
    ROUND(COALESCE(AVG(a.nota), 0), 1) AS media_avaliacoes,COUNT(p.id) OVER() as total_produtos,
    COUNT(a.nota) AS total_avaliacoes
FROM produtos p 
LEFT JOIN avaliacoes a ON p.id = a.produto_id 
LEFT JOIN ( 
    -- Busca o menor frete para a cidade informada 
    SELECT produto_id, MIN(valor) AS valor  
    FROM frete  
    WHERE cidade = ? 
    GROUP BY produto_id 
) f ON p.id = f.produto_id 
LEFT JOIN ( 
    -- Caso não tenha frete para a cidade informada, busca o menor frete disponível 
    SELECT produto_id, MIN(valor) AS valor  
    FROM frete  
    GROUP BY produto_id 
) f_default ON p.id = f_default.produto_id
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN tipo_compra tc ON p.tipo_compra_id = tc.id
LEFT JOIN tipo_produto tp ON p.tipo_produto_id = tp.id
LEFT JOIN produto_promocao pp ON p.id = pp.produto_id
LEFT JOIN promocoes pr ON pr.id = pp.promocao_id
LEFT JOIN entregas e ON p.entrega_id = e.id
LEFT JOIN marcas m ON p.marca_id = m.id
LEFT JOIN usuarios u on p.user_id = u.id

 where 1=1
`;
    if(preco){
    const [min, max] = preco.split('-');
    query += ` AND p.preco between ? AND ?`
    params.push(min, max)
}

if(precoMin && precoMax){
    query+=` AND p.preco between ? AND ?`
    params.push(precoMin,precoMax);
}

if(categoria){
    const categoriaArray = categoria.split(',');
    query += ` AND c.nome IN (${categoriaArray.map(() => "?").join(", ")})`
    params.push(...categoriaArray)
}

if(marcas){
    const marcasArray = marcas.split(',');
    query += ` AND m.nome IN (${marcasArray.map(() => "?").join(", ")})`
    params.push(...marcasArray);
}

if(promocoes){
    const promocoesArray = promocoes.split(',');
    query += ` AND pr.nome IN (${promocoesArray.map(() => "?").join(", ")})`
    params.push(...promocoesArray);
}

if(entrega){
    const entregaArray = entrega.split(',');
    query += ` AND e.tipo_entrega IN (${entregaArray.map(() => "?").join(", ")})`
    params.push(...entregaArray);
}

if(avaliacao){
    const avaliacaoArray = avaliacao.split(',');
    query += ` AND ROUND(COALESCE(AVG(a.nota), 0), 1) IN (${avaliacaoArray.map(() => "?").join(", ")})`
    params.push(...avaliacaoArray);
}

if(vendidoPor){
    const vendidoPorArray = vendidoPor.split(',');
    query += ` AND u.nome IN (${vendidoPorArray.map(() => "?").join(", ")})`
    params.push(...vendidoPorArray);
}

if(tipoCompra){
    const tipoCompraArray = tipoCompra.split(',');
    query += ` AND tc.nome IN (${tipoCompraArray.map(() => "?").join(", ")})`
    params.push(...tipoCompraArray);
}

if(tipoProduto){
    const tipoProdutoArray = tipoProduto.split(',');
    query += ` AND tp.nome IN (${tipoProdutoArray.map(() => "?").join(", ")})`
    params.push(...tipoProdutoArray);
}
        
    query += ` GROUP BY p.id, p.nome, p.preco, p.descricao, p.preco_parcelado,  
        p.parcelas_máximas, p.preco_pix, p.desconto;`;
        
        const [produtos] = await db.query(query,params);
        if(produtos.length === 0 ){
        return res.status(400).json({message: "Não existem produtos cadastrados"});
    }
    const produtosComParcelamento = produtos.map((produto) => {
        const preco = produto.preco;
        const parcelas_maximas = produto.parcelas_maximas || 1;
        const opcoesParcelamento = [];

        for (let i = 1; i <= parcelas_maximas; i++) {
            opcoesParcelamento.push({
                parcelas: i,
                valorParcela: (preco / i).toFixed(2),
            });
        }

        return {
            ...produto,
            parcelas: opcoesParcelamento, 
        };
    });

    return res.status(200).json(produtosComParcelamento);
} catch(err){
    return res.status(500).json({message: "Erro ao buscar produtos"});
}})

app.get("/busca-produto/:nomeProduto?", async (req,res) => {
    try{
        const nomeProduto= req.params.nomeProduto || '';
        console.log(nomeProduto);
        const localidade = req.query.localidade || '';
        const precoMin = req.query.precoMin;
        const precoMax = req.query.precoMax;
        const ordenarPor = req.query.ordenarPor;
        const {preco,marcas,categoria,promocoes,entrega,avaliacao,vendidoPor,tipoCompra,tipoProduto} = req.query;
        console.log(ordenarPor);
        const params = [localidade];
        let query = `SELECT 
    p.id, p.nome, p.preco, p.descricao, p.preco_parcelado, 
    p.parcelas_máximas, p.preco_pix, p.desconto, 
    COALESCE(MIN(f.valor), MIN(f_default.valor), 0) AS valor_frete, 
    (SELECT i.url FROM imagens_produto i WHERE i.produto_id = p.id LIMIT 1) AS url, 
    ROUND(COALESCE(AVG(a.nota), 0), 1) AS media_avaliacoes, COUNT(p.id) OVER() as total_produtos,
    COUNT(a.nota) AS total_avaliacoes  
FROM produtos p 
LEFT JOIN avaliacoes a ON p.id = a.produto_id 
LEFT JOIN ( 
    -- Busca o menor frete para a cidade informada 
    SELECT produto_id, MIN(valor) AS valor  
    FROM frete  
    WHERE cidade = ? 
    GROUP BY produto_id 
) f ON p.id = f.produto_id 
LEFT JOIN ( 
    -- Caso não tenha frete para a cidade informada, busca o menor frete disponível 
    SELECT produto_id, MIN(valor) AS valor  
    FROM frete  
    GROUP BY produto_id 
) f_default ON p.id = f_default.produto_id

LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN tipo_compra tc ON p.tipo_compra_id = tc.id
LEFT JOIN tipo_produto tp ON p.tipo_produto_id = tp.id
LEFT JOIN produto_promocao pp ON p.id = pp.produto_id
LEFT JOIN promocoes pr ON pr.id = pp.promocao_id
LEFT JOIN entregas e ON p.entrega_id = e.id
LEFT JOIN marcas m ON p.marca_id = m.id
LEFT JOIN usuarios u on p.user_id = u.id
 where 1=1
`
    if(precoMin && precoMax){
            query+=` AND p.preco between ? AND ?`
            params.push(precoMin,precoMax);
        }
    if(nomeProduto){
        query+= ` AND p.nome like ?`
        params.push(`%${nomeProduto}%`);
    }
        
        if(categoria){
            const categoriaArray = categoria.split(',');
            query += ` AND c.nome IN (${categoriaArray.map(() => "?").join(", ")})`
            params.push(...categoriaArray)
        }
        
        if(marcas){
            const marcasArray = marcas.split(',');
            query += ` AND m.nome IN (${marcasArray.map(() => "?").join(", ")})`
            params.push(...marcasArray);
        }
        
        if(promocoes){
            const promocoesArray = promocoes.split(',');
            query += ` AND pr.nome IN (${promocoesArray.map(() => "?").join(", ")})`
            params.push(...promocoesArray);
        }
        
        if(entrega){
            const entregaArray = entrega.split(',');
            query += ` AND e.tipo_entrega IN (${entregaArray.map(() => "?").join(", ")})`
            params.push(...entregaArray);
        }
        
        if(vendidoPor){
            const vendidoPorArray = vendidoPor.split(',');
            query += ` AND u.nome IN (${vendidoPorArray.map(() => "?").join(", ")})`
            params.push(...vendidoPorArray);
        }
        
        if(tipoCompra){
            const tipoCompraArray = tipoCompra.split(',');
            query += ` AND tc.nome IN (${tipoCompraArray.map(() => "?").join(", ")})`
            params.push(...tipoCompraArray);
        }
        
        if(tipoProduto){
            const tipoProdutoArray = tipoProduto.split(',');
            query += ` AND tp.nome IN (${tipoProdutoArray.map(() => "?").join(", ")})`
            params.push(...tipoProdutoArray);
        }
    
    
    query += ` GROUP BY p.id, p.nome, p.preco, p.descricao, p.preco_parcelado,  
    p.parcelas_máximas, p.preco_pix, p.desconto, p.vendas`;


    if (avaliacao) {
        const avaliacaoArray = avaliacao.split(',');
        const conditions = avaliacaoArray.map((nota) => {
          return nota == 5 
            ? `ROUND(COALESCE(AVG(a.nota), 0), 1) = ?` 
            : `ROUND(COALESCE(AVG(a.nota), 0), 1) >= ?`
        }).join(" OR ")
      
        query += ` HAVING ${conditions}` // sem o ")"
        params.push(...avaliacaoArray);
      }
    if(ordenarPor){
        switch(ordenarPor){
            case "maisVendidos": query += ` ORDER BY p.vendas desc`;
            break;
            case "maisAvaliados": query += ` ORDER BY media_avaliacoes DESC`;
            break;
            case "menorPreco" : query += ` ORDER BY p.preco asc`
            break;
            case "maiorPreco" : query += ` ORDER BY p.preco desc`
            break;
            case "lancamento" : query += ` ORDER BY p.created_at desc`
            break;
            default : query += ` ORDER BY p.nome asc`
            break;

        }
    }
    const [resultado] = await db.query(query,params);
        
    if(resultado.length === 0){
       return res.status(200).json([]);
    }
    const produtosComParcelamento = resultado.map((produto) => {
        const preco = produto.preco;
        const parcelas_maximas = produto.parcelas_maximas || 1;
        const opcoesParcelamento = [];

        for (let i = 1; i <= parcelas_maximas; i++) {
            opcoesParcelamento.push({
                parcelas: i,
                valorParcela: (preco / i).toFixed(2),
            });
        }

        return {
            ...produto,
            parcelas: opcoesParcelamento,
        }; 
    });
           return res.status(200).json(produtosComParcelamento); 
            }
                catch(err){
        return res.status(500).json({message:"Erro ao buscar produtos"});
                }
    
})

app.get("/sugestoes-produto/:nomeProduto", async (req,res) => {
    try{
        const nomeProduto = req.params.nomeProduto || '';
        const [produtos] = await db.query(`SELECT id, nome from produtos where nome like ? limit 5`,[`%${nomeProduto}%`]);
        if(produtos.length === 0){
          return  res.status(200).json([]);
        }
        return res.status(200).json(produtos);
    }
    catch(err){
        return res.status(500).json({message: "Erro ao buscar sugestões"});
    }
})

app.get("/produto/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const [produto] = await db.query(`
            SELECT 
    p.id AS produto_id,
    p.nome AS produto_nome,
    p.descricao AS produto_descricao,
    p.preco AS produto_preco,
    p.preco_parcelado AS produto_preco_parcelado,
    p.parcelas_máximas AS produto_parcelas_máximas,
    p.preco_pix AS produto_preco_pix,
    p.desconto AS produto_desconto,
    p.estoque AS produto_estoque,
    c.nome AS categoria_nome
    
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?;`, [id]);

    const [imagens] = await db.query("Select url from imagens_produto where produto_id = ?",[id]);

    const [avaliacoes] = await db.query("select nota,comentario,usuario_id from avaliacoes where produto_id = ?",[id]);

    const [frete] = await db.query("select cidade, valor, prazo from frete where produto_id = ?",[id]);

    const [cor] = await db.query("select c.id , c.valor from cores c join produtos_cor pc on c.id = pc.cor_id and pc.produto_id = ?",[id]);

    const [materiais] = await db.query("select m.id, m.valor from material m join produtos_materiais pm on m.id = pm.material_id and pm.produto_id = ?",[id]);

    const [vendedores] = await db.query("select u.nome, u.created_at,ve.total_vendidos,ve.nota_entrega,ve.nota_atendimento from usuarios u join produtos p ON p.user_id = u.id left join vendedores_estatisticas ve on ve.user_id = u.id where p.id = ?",[id]);

    const [usuariosComentarios] = await db.query("SELECT u.nome,u.foto_url, a.created_at, a.nota, a.comentario FROM usuarios u JOIN avaliacoes a ON u.id = a.usuario_id WHERE a.produto_id = ? ",[id]);
    
        if (produto.length === 0) {
            return res.status(400).json({message: "Produto não encontrado"});
        }

        
        const vendedoresFormatados = vendedores.map(vendedor => ({
            nome: vendedor.nome,
            cliente_desde: new Date(vendedor.created_at).getFullYear(),
            total_vendidos: vendedor.total_vendidos,
            nota_entrega:vendedor.nota_entrega,
            nota_atendimento:vendedor.nota_atendimento
        }))

        const totalAvaliacoes = avaliacoes.length;
        const mediaAvaliacoes = totalAvaliacoes > 0 ? (avaliacoes.reduce((sum, a) => sum + parseFloat(a.nota), 0) / totalAvaliacoes) : 0.0;
        const totalComentarios = avaliacoes.filter((a) => a.comentario && a.comentario.trim() !== '').length;

        function formatTimeAgo(date) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
        
            const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365));
            const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30));
            const days = Math.floor(diffInSeconds / (60 * 60 * 24));
            const hours = Math.floor(diffInSeconds / (60 * 60));
            const minutes = Math.floor(diffInSeconds / 60);
        
            if (years > 0) {
                return `Há ${years} ano${years > 1 ? 's' : ''}`;
            } else if (months > 0) {
                return `Há ${months} mês${months > 1 ? 'es' : ''}`;
            } else if (days > 0) {
                return `Há ${days} dia${days > 1 ? 's' : ''}`;
            } else if (hours > 0) {
                return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
            } else if (minutes > 0) {
                return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
            } else {
                return 'Há menos de 1 minuto';
            }
        }
        const produtoFormatado = {
            ...produto[0],
            imagens: imagens.map(img => img.url),
            avaliacoes: avaliacoes,
            totalAvaliacoes,
            mediaAvaliacoes,
            totalComentarios,
            cor,
            materiais,
            frete:frete.length ? frete : null,
            vendedores: vendedoresFormatados,
            usuariosComentarios: usuariosComentarios.map((comentario) => ({
                ...comentario,
                dataFormatada: formatTimeAgo(comentario.created_at)
            }))
        };


       return  res.status(200).json({produto: produtoFormatado});
    } catch (error) {
        return res.status(500).json({message: "Erro no servidor"});
    }
});

app.get("/obter-localidade",autenticarToken, async (req,res) => { 

    try{
        const [resultado] = await db.query("SELECT localidade from usuarios where id = ?",[req.usuarioId])

        if(resultado.length > 0 && resultado[0].localidade){
           const localidadeBanco = resultado[0].localidade;
            return res.json({localidade:localidadeBanco});
        }
        const localidadeCookies = req.cookies.localidade || "Insira seu cep"
        res.json({localidade:localidadeCookies })
    }
    catch(err){
        console.log("Erro ao obter localidade", err);
        res.json({localidade: "Insira seu cep"});
    }
})

app.post("/definir-localidade", async (req,res) => {
    try{
        const {localidade} = req.body;

        if(!localidade){
            return res.status(400).json({message: "Localidade não fornecida"});
        }
        res.cookie("localidade", localidade, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly:false})
        res.json({message : "Localidade atualizada no cookie", localidade});
    }
    catch(err){
        console.log("Erro ao definir localidade", err);
        return res.status(500).json({message:"Erro ao definir localidade"});
    }
})

const buscaFretePorProduto = async (produto_id, cidade) => {
    const params = [produto_id,cidade,produto_id,produto_id,cidade,produto_id];
    let query = `SELECT 
        COALESCE(
    (SELECT valor FROM frete WHERE produto_id = ? AND cidade = ? ORDER BY valor ASC LIMIT 1),
    (SELECT valor FROM frete WHERE produto_id = ? ORDER BY valor ASC LIMIT 1)
  ) AS menor_valor_frete,
        COALESCE(
    (SELECT prazo FROM frete WHERE produto_id = ? AND cidade = ? ORDER BY valor ASC LIMIT 1),
    (SELECT prazo FROM frete WHERE produto_id = ? ORDER BY valor ASC LIMIT 1)
  ) AS menor_prazo_frete;`

    const [resultado] = await db.query(query,params);

    console.log('O resultado é ',resultado[0]);
    return resultado.length > 0 ? resultado[0] : {valor:25.00, prazo: 7};
}

app.get("/calcular-frete/:cep/:produto_id", async (req,res) => {
    try{
        const {cep, produto_id} = req.params;
        const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
        const cidade = resposta.data.localidade;

        if(!cidade){
            return res.status(400).json({message: "Localidade não encontrada para esse cep"})
        }
        const frete = await buscaFretePorProduto(produto_id,cidade);

        res.json({
            cidade,
            valor: frete?.menor_valor_frete ?? null,
            prazo: frete?.menor_prazo_frete ?? null
        });
    }
    catch(err){
        console.error("Erro ao calcular frete por cidade");
        return res.status(500).json({message: "Erro interno ao calcular frete"});
    }
})

app.get("/filtros", async (req,res) => {
    try{
        const [categorias] = await db.query("SELECT nome FROM CATEGORIAS");
        const [marcas] = await db.query("SELECT nome FROM MARCAS");
        const [promocoes] = await db.query("SELECT nome from PROMOCOES");
        const [entregas] = await db.query("SELECT tipo_entrega from entregas");
        const avaliacao = ["5","4","3","2","1"];
        const [vendidoPor] = await db.query(`SELECT u.nome FROM usuarios u INNER JOIN user_roles ur ON ur.user_id = u.id INNER JOIN roles r ON r.id = ur.role_id WHERE r.nome = 'vendedor'`);
        const [tipoCompra] = await db.query("select nome from tipo_compra");
        const [tipoProduto] = await db.query("select nome from tipo_produto");
        const [preco] = await db.query("SELECT MIN(preco) as precoMin , MAX(preco) AS precoMax from produtos");


    
    return res.status(200).json({
        categorias:categorias.map((item) => item.nome),
        marcas:marcas.map((item) => item.nome),
        promocoes:promocoes.map((item) => item.nome),
        entregas:entregas.map((item) => item.tipo_entrega),
        vendidoPor:vendidoPor.map((item) => item.nome),
        tipoCompra:tipoCompra.map((item) => item.nome),
        tipoProduto:tipoProduto.map((item) => item.nome),
        avaliacao,
        preco:{min:Number(preco[0].precoMin),
            max:Number(preco[0].precoMax)
        }
    });
    }
    catch(err){
        console.error("Erro ao exibir filtros", err);
    }
})

app.get("/carregarCategorias",async (req,res) => {
    try{
        const [categorias] = await db.query(`select id, nome from categorias_menu`);
        const [subCategorias] = await db.query(`select nome,categorias_menu_id from subcategorias_menu`)

        const categoriasComSub = categorias.map((categoria) => {
        const subCategoriasFiltradas = subCategorias.filter((sub) => {
            return sub.categorias_menu_id === categoria.id});
        
        return {
            ...categoria,
            subcategorias:subCategoriasFiltradas.map((sub) => sub.nome)
        }
        
        }
    )
    res.status(200).json(categoriasComSub);
    }
    catch(err){
        console.error("Não foi possível carregar as categorias");
        res.status(500).json({message:"Erro interno do servidor"});
    }
})

app.get("/cart", async (req,res) => {
    try{
    const localidade = req.query.localidade || '';
    const {userId} = req.query;
    const params = [localidade];
    let query = `
    SELECT 
        ci.id, 
        ci.cart_id, 
        ci.produto_id, 
        ci.quantidade, 
        p.nome AS produto_nome, 
        p.preco, 
        p.preco_pix, 
        p.desconto,
        GROUP_CONCAT(DISTINCT co.id) AS cores_ids,
        GROUP_CONCAT(DISTINCT co.valor) AS cores,
        GROUP_CONCAT(DISTINCT d.largura ORDER BY d.largura) AS larguras,
        GROUP_CONCAT(DISTINCT d.altura ORDER BY d.altura) AS alturas,
        GROUP_CONCAT(DISTINCT d.comprimento ORDER BY d.comprimento) AS comprimentos,
        GROUP_CONCAT(DISTINCT es.valor) AS estampas,
        GROUP_CONCAT(DISTINCT g.valor) AS generos,  -- Agrupando generos
    GROUP_CONCAT(DISTINCT ma.valor) AS materiais,  -- Agrupando materiais
    GROUP_CONCAT(DISTINCT pe.valor) AS pesos,  -- Agrupando pesos
    GROUP_CONCAT(DISTINCT ta.valor) AS tamanhos,  -- Agrupando tamanhos
    GROUP_CONCAT(DISTINCT vo.valor) AS voltagens,
        (
            SELECT url 
            FROM imagens_produto 
            WHERE produto_id = p.id 
            LIMIT 1
        ) AS imagem_produto,
        COALESCE(MIN(f.valor), MIN(f_default.valor), 0) AS valor_frete,
        m.nome AS marca_nome, 
        u_dono_produto.nome AS usuario_nome_dono_produto
    FROM cart_items ci
    LEFT JOIN produtos p ON p.id = ci.produto_id
    LEFT JOIN cart_item_cores cic ON cic.cart_item_id = ci.id
    LEFT JOIN cores co ON co.id = cic.cor_id
    LEFT JOIN cart_item_dimensoes cid ON cid.cart_item_id = ci.id
    LEFT JOIN dimensoes d ON d.id = cid.dimensao_id
    LEFT JOIN cart_item_materiais cim ON cim.cart_item_id = ci.id
    LEFT JOIN material ma ON ma.id = cim.material_id
    LEFT JOIN cart_item_pesos cip ON cip.cart_item_id = ci.id
    LEFT JOIN pesos pe ON pe.id = cip.peso_id
    LEFT JOIN cart_item_generos cig ON cig.cart_item_id = ci.id
    LEFT JOIN generos g ON g.id = cig.genero_id
    LEFT JOIN cart_item_estampas cie ON cie.cart_item_id = ci.id
    LEFT JOIN estampas es ON es.id = cie.estampa_id
    LEFT JOIN cart_item_tamanhos cit ON cit.cart_item_id = ci.id
    LEFT JOIN tamanhos ta ON ta.id = cit.tamanho_id
    LEFT JOIN cart_item_voltagens civ ON civ.cart_item_id = ci.id
    LEFT JOIN voltagens vo ON vo.id = civ.voltagem_id
    LEFT JOIN carts c ON ci.cart_id = c.id
    LEFT JOIN usuarios u_dono_produto ON u_dono_produto.id = p.user_id
    LEFT JOIN usuarios u_carrinho ON u_carrinho.id = c.usuario_id
    LEFT JOIN marcas m ON p.marca_id = m.id
    LEFT JOIN ( 
        SELECT produto_id, MIN(valor) AS valor  
        FROM frete  
        WHERE cidade = ? 
        GROUP BY produto_id 
    ) f ON p.id = f.produto_id
    LEFT JOIN ( 
        SELECT produto_id, MIN(valor) AS valor  
        FROM frete  
        GROUP BY produto_id 
    ) f_default ON p.id = f_default.produto_id
    WHERE 1 = 1
`;

    if(userId){
    query += ` AND c.usuario_id = ?`
    params.push(userId);
    }

    query += ` GROUP BY 
    ci.id, 
    ci.cart_id, 
    ci.produto_id, 
    ci.quantidade, 
    p.nome, 
    p.preco, 
    p.preco_pix, 
    p.desconto, 
    m.nome, 
    u_dono_produto.nome
    `
    
    const [resultado] = await db.query(query,params);

    return res.status(200).json(resultado);
    }
    catch(err){
    return res.status(400).json({message:"Não foi possível retornar os itens do carrinho",err});
    }
})
app.post("/cart" , autenticarToken, async (req,res) => {
    const {produtoId, quantidade, corId, voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId} = req.body;
    const userId = req.usuarioId;
    try{

        const [carrinho] = await db.query("SELECT id from carts where usuario_id = ?",[userId]);

        let cartId;
        if(carrinho.length > 0){
            cartId = carrinho[0].id;
        }
        else{
            const [novoCarrinho] = await db.query(`INSERT INTO carts (usuario_id) values (?)`, userId);
            cartId = novoCarrinho[0].id;
        }

    const [itemJaExiste] = await db.query(`SELECT * from cart_items where cart_id = ? AND produto_id = ?
        AND (cores_ids = ? OR (cores_ids IS NULL AND ? IS NULL)) AND (voltagemId = ? OR (voltagemId IS NULL AND ? IS NULL)) AND (dimensoesId = ? OR (dimensoesId IS NULL AND ? IS NULL))

AND (pesosId = ? OR (pesosId IS NULL AND ? IS NULL)) AND (generoId = ? OR (generoId IS NULL AND ? IS NULL)) AND (estampasId = ? OR (estampasId IS NULL AND ? IS NULL)) 
AND (tamanhosId = ? OR (tamanhosId IS NULL AND ? IS NULL)) AND (materiaisId = ? OR (materiaisId IS NULL AND ? IS NULL))`,[cartId, produtoId,
    corId, corId,
    voltagemId, voltagemId,
    dimensoesId, dimensoesId,
    pesosId, pesosId,
    generoId, generoId,
    estampasId, estampasId,
    tamanhosId, tamanhosId,
    materiaisId, materiaisId
  ]);

    let cartItemId;
    if(itemJaExiste.length > 0){
        await db.query(`UPDATE cart_items SET quantidade = quantidade + ?
WHERE cart_id = ? AND produto_id = ?
  AND (cores_ids = ? OR (cores_ids IS NULL AND ? IS NULL))
  AND (voltagemId = ? OR (voltagemId IS NULL AND ? IS NULL))
  AND (dimensoesId = ? OR (dimensoesId IS NULL AND ? IS NULL))
  AND (pesosId = ? OR (pesosId IS NULL AND ? IS NULL))
  AND (generoId = ? OR (generoId IS NULL AND ? IS NULL))
  AND (estampasId = ? OR (estampasId IS NULL AND ? IS NULL))
  AND (tamanhosId = ? OR (tamanhosId IS NULL AND ? IS NULL))
  AND (materiaisId = ? OR (materiaisId IS NULL AND ? IS NULL))`,
  [quantidade || 1, cartId, produtoId,
    corId, corId,
    voltagemId, voltagemId,
    dimensoesId, dimensoesId,
    pesosId, pesosId,
    generoId, generoId,
    estampasId, estampasId,
    tamanhosId, tamanhosId,
    materiaisId, materiaisId]);
        cartItemId = itemJaExiste[0].id;
    }
    else{
        const [novoItem] = await db.query(`
            INSERT INTO cart_items (
              cart_id, produto_id, quantidade,
              cores_ids, voltagemId, dimensoesId,
              pesosId, generoId, estampasId,
              tamanhosId, materiaisId
            ) VALUES (?, ?, ?,
                      ?, ?, ?,
                      ?, ?, ?,
                      ?, ?)
          `, [
            cartId, produtoId, quantidade || 1,
            corId, voltagemId, dimensoesId,
            pesosId, generoId, estampasId,
            tamanhosId, materiaisId
          ]);
        cartItemId = novoItem.insertId;
        console.log(cartItemId);
        console.log(cartId);
    if(corId) {
        await db.query(`INSERT INTO cart_item_cores (cart_item_id, cor_id) values (? , ?)`,[cartItemId,corId]);
    }
    if(voltagemId) {
        await db.query(`INSERT INTO cart_item_voltagens (cart_item_id, voltagem_id) values (? , ?)`,[cartItemId,voltagemId]);
    }
    if(dimensoesId) {
        await db.query(`INSERT INTO cart_item_dimensoes (cart_item_id, dimensao_id) values (? , ?)`,[cartItemId,dimensoesId]);
    }
    if(estampasId) {
        await db.query(`INSERT INTO cart_item_estampas (cart_item_id, estampa_id) values (? , ?)`,[cartItemId,estampasId]);
    }
    if(generoId) {
        await db.query(`INSERT INTO cart_item_generos (cart_item_id, genero_id) values (? , ?)`,[cartItemId,generoId]);
    }
    if(materiaisId) {
        await db.query(`INSERT INTO cart_item_materiais (cart_item_id, material_id) values (? , ?)`,[cartItemId,materiaisId]);
    }
    if(pesosId) {
        await db.query(`INSERT INTO cart_item_pesos (cart_item_id, peso_id) values (? , ?)`,[cartItemId,pesosId]);
    }
    if(tamanhosId) {
        await db.query(`INSERT INTO cart_item_tamanhos (cart_item_id, tamanho_id) values (? , ?)`,[cartItemId,tamanhosId]);
    }

    }
        return res.status(200).json({message: "O item foi adicionado ao carrinho"});
    }
    catch(err){
        return res.status(400).json({message:"Não foi possível adicionar o item ao carrinho"});
    }
    
})

app.put("/cart/:itemId", async (req,res) => {
    const {itemId} = req.params;
    const {quantidade, corId, voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId} = req.body;

    try{
        await db.query(`UPDATE cart_items SET quantidade = ? where id = ?`,[Number(quantidade),itemId]);
        
        if(corId) {
            await db.query(`UPDATE cart_item_cores SET cor_id = ? where cart_item_id = ? `,[corId,itemId]);
        }
        if(voltagemId) {
            await db.query(`UPDATE cart_item_voltagens SET voltagem_id = ? where cart_item_id = ?`,[voltagemId,itemId]);
        }
        if(dimensoesId) {
            await db.query(`UPDATE cart_item_dimensoes SET dimensao_id = ? where cart_item_id = ?`,[dimensoesId,itemId]);
        }
        if(estampasId) {
            await db.query(`UPDATE cart_item_estampas SET estampa_id = ? where cart_item_id = ?`,[estampasId,itemId]);
        }
        if(generoId) {
            await db.query(`UPDATE cart_item_generos SET genero_id = ? where cart_item_id = ?`,[generoId,itemId]);
        }
        if(materiaisId) {
            await db.query(`UPDATE cart_item_materiais SET material_id = ? where cart_item_id = ?`,[materiaisId,itemId]);
        }
        if(pesosId) {
            await db.query(`UPDATE cart_item_pesos SET peso_id = ? where cart_item_id = ? `,[pesosId,itemId]);
        }
        if(tamanhosId) {
            await db.query(`UPDATE cart_item_tamanhos SET tamanho_id = ? where cart_item_id = ?`,[tamanhosId,itemId]);
        }
     
        return res.status(200).json({message: "Carrinho atualizado com sucesso"});
    }
    catch(err){
        return res.status(400).json({message:"Não foi possível atualizar o carrinho"});
    }
    
})

app.delete("/cart/:itemId",autenticarToken, async (req,res) => {
    const {itemId} = req.params;
    const userId = req.usuarioId;
    try{
        const [cart] = await db.query(`SELECT id from carts where usuario_id = ?`,userId);

        if(cart.length === 0){
            return res.status(400).json({message:"Carrinho não encontrado para o usuario"})
        }
        const cartId = cart[0].id;
        await db.query(`DELETE FROM cart_items where id = ? AND cart_id = ?`,[itemId,cartId]);
        return res.status(200).json({message:"O item foi deletado do carrinho com sucesso"});
    }
    catch(err){
        return res.status(400).json({message:"Não foi possível remover o item do carrinho"});
    }
})

app.get("/itens-salvos", autenticarToken, async(req,res) => {
    const userId = req.usuarioId
    const params = [];
    let query = `SELECT it.produto_id,it.nome, it.url, it.quantidade,it.preco,it.created_at,
    v.valor as voltagem_valor,t.valor as tamanho_valor,p.valor as peso_valor,m.valor as material_valor ,g.valor as genero_valor,e.valor as estampa_valor,d.largura,d.altura,d.comprimento,
    c.valor as cor_valor
    from itens_salvos it
    left join itens_salvos_voltagens isv on isv.item_salvo_id = it.id
    left join voltagens v on v.id = isv.voltagem_id
    left join itens_salvos_tamanhos ist on ist.item_salvo_id = it.id
    left join tamanhos t on t.id = ist.tamanho_id
    left join itens_salvos_pesos isp on isp.item_salvo_id = it.id
    left join pesos p on p.id = isp.peso_id
    left join itens_salvos_materiais ism on ism.item_salvo_id = it.id
    left join material m on m.id = ism.material_id
    left join itens_salvos_genero isg on isg.item_salvo_id = it.id
    left join generos g on g.id = isg.genero_id
    left join itens_salvos_estampas ise on ise.item_salvo_id = it.id
    left join estampas e on e.id = ise.estampa_id
    left join itens_salvos_dimensoes isd on isd.item_salvo_id = it.id
    left join dimensoes d on d.id = isd.dimensao_id
    left join itens_salvos_cores isc on isc.item_salvo_id = it.id
    left join cores c on c.id = isc.cor_id

            where 1=1`
    
    try{
        if(userId){
        query += ` AND usuario_id = ?`
        params.push(userId);
        }

        query += ` ORDER BY created_at DESC`
        const [resposta] = await db.query(query,params);

        if(resposta.length === 0){
        return res.status(200).json([]);
        }

        return res.status(200).json(resposta);
    }
    catch(err){
        return res.status(500).json({message:"Erro interno do servidor",err});
    }
})

app.post("/itens-salvos",autenticarToken, async (req,res) => {

    const userId = req.usuarioId
    const { produtoId, corId , voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId} = req.body;
    const params = [
        userId, produtoId, userId, produtoId,
        corId, corId,
        voltagemId, voltagemId,
        dimensoesId, dimensoesId,
        pesosId, pesosId,
        generoId, generoId,
        estampasId, estampasId,
        tamanhosId, tamanhosId,
        materiaisId, materiaisId
      ];

    const [itemJaExiste] = await db.query(`
        SELECT * 
        FROM itens_salvos 
        WHERE produto_id = ? 
        AND usuario_id = ? 
        AND (cor_id = ? OR cor_id IS NULL)
        AND (voltagem_id = ? OR voltagem_id IS NULL)
        AND (dimensoes_id = ? OR dimensoes_id IS NULL)
        AND (pesos_id = ? OR pesos_id IS NULL)
        AND (genero_id = ? OR genero_id IS NULL)
        AND (estampas_id = ? OR estampas_id IS NULL)
        AND (tamanhos_id = ? OR tamanhos_id IS NULL)
        AND (materiais_id = ? OR materiais_id IS NULL)
    `, [
        userId, produtoId, userId, produtoId,
        corId,
        voltagemId,
        dimensoesId,
        pesosId,
        generoId,
        estampasId,
        tamanhosId,
        materiaisId
      ]);
    
    if(itemJaExiste.length > 0){
        try{
            await db.query(`UPDATE itens_salvos isalvo
                join cart_items ci on ci.produto_id = isalvo.produto_id
                join carts c on c.id = ci.cart_id
                set isalvo.quantidade = isalvo.quantidade + ci.quantidade
                where isalvo.produto_id = ? and isalvo.usuario_id = ? and c.usuario_id = ?
                AND (isalvo.cor_id = ? OR isalvo.cor_id IS NULL)
    AND (isalvo.voltagem_id = ? OR isalvo.voltagem_id IS NULL)
    AND (isalvo.dimensoes_id = ? OR isalvo.dimensoes_id IS NULL)
    AND (isalvo.pesos_id = ? OR isalvo.pesos_id IS NULL)
    AND (isalvo.genero_id = ? OR isalvo.genero_id IS NULL)
    AND (isalvo.estampas_id = ? OR isalvo.estampas_id IS NULL)
    AND (isalvo.tamanhos_id = ? OR isalvo.tamanhos_id IS NULL)
    AND (isalvo.materiais_id = ? OR isalvo.materiais_id IS NULL)
                `,[
                    produtoId, userId, userId,
                    corId,
                    voltagemId,
                    dimensoesId,
                    pesosId,
                    generoId,
                    estampasId,
                    tamanhosId,
                    materiaisId
                ])
                return res.status(200).json({message:"O item foi atualizado com sucesso"});
            }
        catch(err){
            return res.status(400).json({message: "Não foi possível atualizar a quantidade do item"});
        }
        
    }
    else{
        try{
            let itemSalvo;
            let query = `INSERT INTO itens_salvos (usuario_id,produto_id,nome,url,quantidade,preco,cor_id,voltagem_id,dimensoes_id,pesos_id,genero_id,estampas_id,tamanhos_id,materiais_id)

    SELECT ?,?, p.nome,(SELECT i.url FROM imagens_produto i WHERE i.produto_id = p.id LIMIT 1) AS url ,ci.quantidade,p.preco,ci.cores_ids,ci.voltagemId,ci.dimensoesId,ci.pesosId,ci.generoId,ci.estampasId,ci.tamanhosId,ci.materiaisId from 
    cart_items ci left join produtos p on ci.produto_id = p.id
    left join carts c on c.id = ci.cart_id
    where c.usuario_id = ? and ci.produto_id = ?
    AND (ci.cores_ids = ? OR ci.cores_ids IS NULL)
  AND (ci.voltagemId = ? OR ci.voltagemId IS NULL)
  AND (ci.dimensoesId = ? OR ci.dimensoesId IS NULL)
  AND (ci.pesosId = ? OR ci.pesosId IS NULL)
  AND (ci.generoId = ? OR ci.generoId IS NULL)
  AND (ci.estampasId = ? OR ci.estampasId IS NULL)
  AND (ci.tamanhosId = ? OR ci.tamanhosId IS NULL)
  AND (ci.materiaisId = ? OR ci.materiaisId IS NULL);
    `
            console.log(params);
            const [resultado] = await db.query(query,params);
            
            console.log(`resultado do insert` , resultado);
            itemSalvo = resultado.insertId;
            console.log(`Item salvo é`,itemSalvo);
            
            await db.query(`INSERT INTO itens_salvos_cores (item_salvo_id, cor_id)
VALUES (?, ?)`,[itemSalvo,corId]);

            await db.query(`INSERT INTO itens_salvos_voltagens (item_salvo_id, voltagem_id)
VALUES (?, ?)`,[itemSalvo,voltagemId])

            await db.query(`INSERT INTO itens_salvos_dimensoes (item_salvo_id, dimensao_id)
VALUES (?, ?)`,[itemSalvo,dimensoesId]);

            await db.query(`INSERT INTO itens_salvos_tamanhos (item_salvo_id, tamanho_id)
    VALUES (?, ?)`,[itemSalvo,tamanhosId]);
    await db.query(`INSERT INTO itens_salvos_pesos (item_salvo_id, peso_id)
        VALUES (?, ?)`,[itemSalvo,pesosId]);
        await db.query(`INSERT INTO itens_salvos_materiais (item_salvo_id, material_id)
VALUES (?, ?)`,[itemSalvo,materiaisId]);
await db.query(`INSERT INTO itens_salvos_genero (item_salvo_id, genero_id)
    VALUES (?, ?)`,[itemSalvo,generoId]);
    await db.query(`INSERT INTO itens_salvos_estampas (item_salvo_id, estampa_id)
        VALUES (?, ?)`,[itemSalvo,estampasId]);

            
            if (resultado.affectedRows === 0) {
                return res.status(400).json({ message: "Nada foi inserido" });
              } 
            return res.status(200).json({message:"O item foi inserido com sucesso"});
        }
        catch(err){
            return res.status(500).json({message:"Erro interno do servidor"});
        }
    }
    
    
})

app.delete("/itens-salvos",autenticarToken, async (req,res) => {
    const {produtoId} = req.body
    const userId = req.usuarioId
    console.log(`Produto id é:`,produtoId, userId);
    try{
        await db.query("DELETE FROM itens_salvos where produto_id = ? and usuario_id = ?",[produtoId,userId]);
        res.status(200).json({message:"O produto foi deletado com sucesso"});
    }
    catch(err){
        return res.status(500).json({message:"Erro interno do servidor"});
    }
})

app.listen(port, () => {console.log("servidor rodando na porta " + `${port}`)});