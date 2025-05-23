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
import Stripe from "stripe"

dotenv.config();

const app = express();
const port = 5000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{
    apiVersion:"2023-10-16",
});
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
        maxAge: 1 * 60 * 1000 * 15,
        
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
            maxAge: 1 * 60 * 1000 * 15,
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
        const [resultado] = await db.query("INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)", [nome,email, hashedPassword]);
    
        const idUsuario = resultado.insertId;

    return res.status(200).json(idUsuario);
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
    p.parcelas_máximas, p.preco_pix,p.cep_origem, p.desconto, COUNT(DISTINCT p.id) as total_produtos,
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
        
        const localidade = req.query.localidade || '';
        const precoMin = req.query.precoMin;
        const precoMax = req.query.precoMax;
        const ordenarPor = req.query.ordenarPor;
        const {preco,marcas,categoria,promocoes,entrega,avaliacao,vendidoPor,tipoCompra,tipoProduto} = req.query;
        
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
    const {corId, voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId } = req.query;
    
    const params = [];
    try {
    let query = `SELECT 
    p.id AS produto_id,
    p.nome AS produto_nome,
    p.descricao AS produto_descricao,
    p.preco AS produto_preco,
    p.preco_parcelado AS produto_preco_parcelado,
    p.parcelas_máximas AS produto_parcelas_máximas,
    p.preco_pix AS produto_preco_pix,
    p.desconto AS produto_desconto,
    p.estoque AS produto_estoque,
    p.cep_origem,
    c.nome AS categoria_nome,
    ci.id as cart_item_id
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    left join cart_items ci on p.id = ci.produto_id 
    WHERE 1=1
    `
        
    if(id){
        query += ` AND p.id = ?`
        params.push(id);
    }
    if(corId){
        query+=` AND ci.cores_ids = ? `
        params.push(corId);
    }
    if(voltagemId){
        query+=` AND ci.voltagemId = ?`
        params.push(voltagemId);
    }
    if(dimensoesId){
        query+=` AND ci.dimensoesId = ?`
        params.push(dimensoesId);
    }
    if(pesosId){
        query+=` AND ci.pesosId = ?`
        params.push(pesosId);
    }
    if(generoId){
        query+=` AND ci.generoId = ?`
        params.push(generoId);
    }
    if(estampasId){
        query+=` AND ci.estampasId = ?`
        params.push(estampasId);
    }
    if(tamanhosId){
        query+=` AND ci.tamanhosId = ?`
        params.push(tamanhosId);
    }
    if(materiaisId){
        query+=` AND ci.materiaisId = ?`
        params.push(materiaisId);
    }
    const segundoParams = [];
    let segundaQuery = `SELECT 
    p.id AS produto_id,
    p.nome AS produto_nome,
    p.descricao AS produto_descricao,
    p.preco AS produto_preco,
    p.preco_parcelado AS produto_preco_parcelado,
    p.parcelas_máximas AS produto_parcelas_máximas,
    p.preco_pix AS produto_preco_pix,
    p.desconto AS produto_desconto,
    p.estoque AS produto_estoque,
    (SELECT i.url FROM imagens_produto i WHERE i.produto_id = p.id limit 1) AS imagens,
    c.nome AS categoria_nome,
    sv.id as produto_salvo_id
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    left join itens_salvos sv on p.id = sv.produto_id
    WHERE 1=1`

    if(id){
        segundaQuery+= ` AND sv.produto_id = ?`
        segundoParams.push(id);
    }
    if(corId){
        segundaQuery+= ` AND sv.cor_id = ?`
        segundoParams.push(corId);
    }
    if(voltagemId){
        segundaQuery+= ` AND sv.voltagem_id = ?`
        segundoParams.push(voltagemId);
    }
    if(dimensoesId){
        segundaQuery+= ` AND sv.dimensoes_id = ?`
        segundoParams.push(dimensoesId);
    }
    if(pesosId){
        segundaQuery+= ` AND sv.pesos_id = ?`
        segundoParams.push(pesosId);
    }
    if(generoId){
        segundaQuery+= ` AND sv.genero_id = ?`
        segundoParams.push(generoId);
    }
    if(estampasId){
        segundaQuery+= ` AND sv.estampas_id = ?`
        segundoParams.push(estampasId);
    }
    if(tamanhosId){
        segundaQuery+= ` AND sv.tamanhos_id = ?`
        segundoParams.push(tamanhosId);
    }
    if(materiaisId){
        segundaQuery+= ` AND sv.materiais_id = ?`
        segundoParams.push(materiaisId);
    }


    const [produto] = await db.query(query,params);

    const [itemSalvo] = await db.query(segundaQuery,segundoParams);
    
    const [imagens] = await db.query("Select url from imagens_produto where produto_id = ?",[id]);

    const [avaliacoes] = await db.query("select nota,comentario,usuario_id from avaliacoes where produto_id = ?",[id]);

    const [frete] = await db.query("select cidade, valor, prazo from frete where produto_id = ?",[id]);

    const [cor] = await db.query("select c.id , c.valor from cores c join produtos_cor pc on c.id = pc.cor_id and pc.produto_id = ?",[id]);

    const [materiais] = await db.query("select m.id, m.valor from material m join produtos_materiais pm on m.id = pm.material_id and pm.produto_id = ?",[id]);

    const [dimensoes] = await db.query("SELECT d.id,d.largura,d.comprimento,d.altura,d.unidade from dimensoes d join produtos_dimensoes pd on d.id=pd.dimensoes_id and pd.produto_id = ?",[id]);

    const [estampas] = await db.query("SELECT e.id, e.valor from estampas e join produtos_estampas pe on e.id=pe.estampa_id and pe.produto_id = ?",[id]);

    const [generos] = await db.query("SELECT g.id, g.valor from generos g join produtos_genero pg on g.id=pg.genero_id and pg.produto_id = ?",[id]);

    const [pesos] = await db.query("SELECT p.id, p.valor,p.unidade from pesos p join produtos_pesos pp on p.id=pp.peso_id and pp.produto_id = ?",[id]);

    const [voltagens] = await db.query("SELECT v.id, v.valor from voltagens v join produtos_voltagens pv on v.id=pv.voltagens_id and pv.produto_id = ?",[id]);

    const [tamanhos] = await db.query("SELECT t.id, t.valor from tamanhos t join produtos_tamanhos pt on t.id=pt.tamanho_id and pt.produto_id = ?",[id]);
    
    const [vendedores] = await db.query("select u.nome, u.created_at,ve.total_vendidos,ve.nota_entrega,ve.nota_atendimento from usuarios u join produtos p ON p.user_id = u.id left join vendedores_estatisticas ve on ve.user_id = u.id where p.id = ?",[id]);

    const [usuariosComentarios] = await db.query("SELECT u.nome,u.foto_url, a.created_at, a.nota, a.comentario FROM usuarios u JOIN avaliacoes a ON u.id = a.usuario_id WHERE a.produto_id = ? ",[id]);
    

        
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
            produto_salvo: itemSalvo[0],
            imagens: imagens.map(img => img.url),
            avaliacoes: avaliacoes,
            totalAvaliacoes,
            mediaAvaliacoes,
            totalComentarios,
            cor,
            materiais,
            dimensoes,
            estampas,
            generos,
            pesos,
            voltagens,
            tamanhos,
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

    
    return resultado.length > 0 ? resultado[0] : {valor:25.00, prazo: 7};
}

app.get("/calcular-frete/:cep/:produto_id", async (req,res) => {
    try{
        const {cep, produto_id} = req.params;
        const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
        const cidade = resposta.data.localidade;
        const estado = resposta.data.estado;

        if(!cidade){
            return res.status(400).json({message: "Localidade não encontrada para esse cep"})
        }
        const frete = await buscaFretePorProduto(produto_id,cidade);

        res.json({
            cidade,
            estado,
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

app.get("/cart",autenticarToken, async (req,res) => {
    try{
    const localidade = req.query.localidade || '';
    const userId = req.usuarioId;
    const params = [localidade];
    let query = `
    SELECT 
        ci.id, 
        ci.cart_id, 
        ci.produto_id, 
        ci.quantidade,
        ci.frete_selecionado,
        p.nome AS produto_nome, 
        p.preco, 
        p.preco_pix, 
        p.desconto,
        p.cep_origem,
        p.parcelas_máximas,
        GROUP_CONCAT(DISTINCT co.id) AS cores_ids,
        GROUP_CONCAT(DISTINCT co.valor) AS cores,
        GROUP_CONCAT(DISTINCT d.id) as dimensoes_ids,
        GROUP_CONCAT(DISTINCT d.unidade) as dimensoes_unidade,
        GROUP_CONCAT(DISTINCT d.largura ORDER BY d.largura) AS larguras,
        GROUP_CONCAT(DISTINCT d.altura ORDER BY d.altura) AS alturas,
        GROUP_CONCAT(DISTINCT d.comprimento ORDER BY d.comprimento) AS comprimentos,
        GROUP_CONCAT(DISTINCT es.id) as estampas_ids,
        GROUP_CONCAT(DISTINCT es.valor) AS estampas,
        GROUP_CONCAT(DISTINCT g.id) as generos_ids,
        GROUP_CONCAT(DISTINCT g.valor) AS generos,  -- Agrupando generos
        GROUP_CONCAT(DISTINCT ma.id) as materiais_ids,
    GROUP_CONCAT(DISTINCT ma.valor) AS materiais,  -- Agrupando materiais
    GROUP_CONCAT(DISTINCT pe.id) as pesos_ids,
    GROUP_CONCAT(DISTINCT pe.valor) AS pesos,
    GROUP_CONCAT(DISTINCT pe.unidade) AS pesos_unidade,  -- Agrupando pesos
    GROUP_CONCAT(DISTINCT ta.id) as tamanhos_ids,
    GROUP_CONCAT(DISTINCT ta.valor) AS tamanhos,  -- Agrupando tamanhos
    GROUP_CONCAT(DISTINCT vo.id) as voltagem_ids,
    GROUP_CONCAT(DISTINCT vo.valor) AS voltagens,
        (
            SELECT url 
            FROM imagens_produto 
            WHERE produto_id = p.id 
            LIMIT 1
        ) AS imagem_produto,
        COALESCE(MIN(f.valor), MIN(f_default.valor), 0) AS valor_frete,
        m.nome AS marca_nome, 
        u_dono_produto.nome AS usuario_nome_dono_produto,
        u_dono_produto.id AS usuario_id_dono_produto

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
    return res.status(500).json({message:"Não foi possível retornar os itens do carrinho",err});
    }
})
app.post("/cart" , autenticarToken, async (req,res) => {
    const {produtoId, quantidade, corId, voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId,freteSelecionado} = req.body;
    
    console.log(`dimensoesIde`,dimensoesId);
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
        const params = [];
        let query = `SELECT * from cart_items where 1=1`

        if(cartId){
            query += ` AND cart_id = ?`
            params.push(cartId);
        }
        if(produtoId){
            query += ` AND produto_id = ?`
            params.push(produtoId);
        }
        if(corId){
            query += ` AND cores_ids = ?`
            params.push(corId);
        }
        if(voltagemId){
            query += ` AND voltagemId = ?`
            params.push(voltagemId);
        }
        if(dimensoesId){
            query += ` AND dimensoesId = ?`
            params.push(dimensoesId);
        }
        if(pesosId){
            query += ` AND pesosId= ?`
            params.push(pesosId);
        }
        if(generoId){
            query += ` AND generoId = ?`
            params.push(generoId);
        }
        if(estampasId){
            query += ` AND estampasId = ?`
            params.push(estampasId);
        }
        if(tamanhosId){
            query += ` AND tamanhosId = ?`
            params.push(tamanhosId);
        }
        if(materiaisId){
            query += ` AND materiaisId = ?`
            params.push(materiaisId);
        }

    const [itemJaExiste] = await db.query(query,params);

    let cartItemId;
    const segundoParams = [Number(quantidade)];
    let segundaQuery = `UPDATE cart_items SET quantidade = quantidade + ? where 1=1`;

    if(cartId){
        segundaQuery += ` AND cart_id = ?`
        segundoParams.push(cartId);
    }
    
    if(produtoId){
        segundaQuery += ` AND produto_id = ?`
        segundoParams.push(produtoId);
    }
    if(corId){
        segundaQuery += ` AND cores_ids = ?`
        segundoParams.push(corId);
    }
    if(voltagemId){
        segundaQuery += ` AND voltagemId = ?`
        segundoParams.push(voltagemId);
    }
    if(dimensoesId){
        segundaQuery += ` AND dimensoesId = ?`
        segundoParams.push(dimensoesId);
    }
    if(pesosId){
        segundaQuery += ` AND pesosId = ?`
        segundoParams.push(pesosId);
    }
    if(generoId){
        segundaQuery += ` AND generoId = ?`
        segundoParams.push(generoId);
    }
    if(estampasId){
        segundaQuery += ` AND estampasId = ?`
        segundoParams.push(estampasId);
    }
    if(tamanhosId){
        segundaQuery += ` AND tamanhosId = ?`
        segundoParams.push(tamanhosId);
    }
    if(materiaisId){
        segundaQuery += ` AND materiaisId = ?`
        segundoParams.push(materiaisId);
    }

    if(itemJaExiste.length > 0){
        await db.query(segundaQuery,segundoParams);
        cartItemId = itemJaExiste[0].id;
    }
    else{
        const columns = ["cart_id", "produto_id", "quantidade"]
        const values = [cartId,produtoId,quantidade || 1]

        if(corId){
            columns.push("cores_ids")
            values.push(corId);
        }
        if(voltagemId){
            columns.push("voltagemId")
            values.push(voltagemId);
        }
        
        if (dimensoesId) {
            columns.push("dimensoesId");
            values.push(dimensoesId);
        }
        
        if (pesosId) {
            columns.push("pesosId");
            values.push(pesosId);
        }
        
        if (generoId) {
            columns.push("generoId");
            values.push(generoId);
        }
        
        if (estampasId) {
            columns.push("estampasId");
            values.push(estampasId);
        }
        
        if (tamanhosId) {
            columns.push("tamanhosId");
            values.push(tamanhosId);
        }
        
        if (materiaisId) {
            columns.push("materiaisId");
            values.push(materiaisId);
        }
        if(freteSelecionado){
            columns.push(`frete_selecionado`);
            values.push(freteSelecionado);
        }
        
        const placeholders = columns.map(() => "?").join(", ");
        
        const sql = `INSERT INTO cart_items (${columns.join(", ")})
        values (${placeholders})`;
        
        const [novoItem] = await db.query(sql, values);
        cartItemId = novoItem.insertId;
        
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

app.put("/cart/:itemId",autenticarToken, async (req,res) => {
    const {itemId} = req.params;
    const userId = req.usuarioId;
    const {produtoId,quantidade, corId, voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId,alterar} = req.body;

    try{
        let query = `UPDATE cart_items ci join carts c on ci.cart_id = c.id SET `
        let updates = [];
        let params = [];
        
        if(quantidade){
            updates.push("ci.quantidade = ?");
            params.push(quantidade);
        }

        if(corId){
            updates.push("ci.cores_ids = ?")
            params.push(corId);
        }
        
        if(voltagemId){
            updates.push("ci.voltagemId = ?")
            params.push(voltagemId);
        }
        if(dimensoesId){
            updates.push("ci.dimensoesId = ?")
            params.push(dimensoesId);
        }
        if(pesosId){
            updates.push("ci.pesosId = ?")
            params.push(pesosId);
        }
        if(generoId){
            updates.push("ci.generoId = ?")
            params.push(generoId);
        }
        if(estampasId){
            updates.push("ci.estampasId = ?")
            params.push(estampasId);
        }
        if(tamanhosId){
            updates.push("ci.tamanhosId = ?")
            params.push(tamanhosId);
        }
        if(materiaisId){
            updates.push("ci.materiaisId = ?")
            params.push(materiaisId);
        }

        query += updates.join(", ");
        query += ` WHERE 1=1 `
        
        if(itemId){
            query+= ` AND ci.id = ?`
            params.push(itemId);
        }

        if(userId){
            query += ` AND c.usuario_id = ?`
            params.push(userId);
        }

        await db.query(query,params);

        const segundoParams = [];
        let segundaQuery = `SELECT ci.id FROM cart_items ci left join carts c on ci.cart_id = c.id 
        where 1=1`
        
        if(userId){
            segundaQuery+=` AND c.usuario_id = ?`
            segundoParams.push(userId);
        }

        if(itemId){
            segundaQuery+= ` AND ci.id != ?`
            segundoParams.push(itemId);
        }
        if(corId){
            segundaQuery+= ` AND ci.cores_ids = ?`
            segundoParams.push(corId);
        }
        if(voltagemId){
            segundaQuery+= ` AND ci.voltagemId = ?`
            segundoParams.push(voltagemId);
        }
        if(dimensoesId){
            segundaQuery+= ` AND ci.dimensoesId = ?`
            segundoParams.push(dimensoesId);
        }
        if(pesosId){
            segundaQuery+= ` AND ci.pesosId = ?`
            segundoParams.push(pesosId);
        }
        if(generoId){
            segundaQuery+= ` AND ci.generoId = ?`
            segundoParams.push(generoId);
        }
        if(estampasId){
            segundaQuery+= ` AND ci.estampasId = ?`
            segundoParams.push(estampasId);
        }
        if(tamanhosId){
            segundaQuery+= ` AND ci.tamanhosId = ?`
            segundoParams.push(tamanhosId);
        }
        if(materiaisId){
            segundaQuery+= ` AND ci.materiaisId = ?`
            segundoParams.push(materiaisId);
        }
        if(produtoId){
            segundaQuery+= ` AND ci.produto_id = ?`
            segundoParams.push(produtoId);
        }

        const [resultado] = await db.query(segundaQuery,segundoParams);
        

        
        if(resultado.length > 0){
            const itemExistente = resultado[0];
            
            if(itemExistente){
                
                await db.query(`UPDATE cart_items SET quantidade = quantidade + ? where id = ? `,[quantidade,itemExistente.id]);
                
            if(alterar){
                await db.query(`delete from cart_items where id = ?`, [itemId]); 
            }
            }
            
    }


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
    const {corId, voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId} = req.body;
    const userId = req.usuarioId;
    try{
        const [cart] = await db.query(`SELECT id from carts where usuario_id = ?`,userId);

        if(cart.length === 0){
            return res.status(400).json({message:"Carrinho não encontrado para o usuario"})
        }
        const cartId = cart[0].id;
        const params = [];
        let query = `DELETE FROM cart_items where 1=1 `
        if(itemId){
            query+= ` AND produto_id = ?`
            params.push(itemId);
        }
        if(cartId){
            query += ` AND cart_id = ?`
            params.push(cartId);
        }
        if(corId){
            query += ` AND cores_ids = ?`
            params.push(corId);
        }
        if(voltagemId){
            query += ` AND voltagemId = ?`
            params.push(voltagemId);
        }
        if(dimensoesId){
            query += ` AND dimensoesId = ?`
            params.push(dimensoesId);
        }
        if(pesosId){
            query += ` AND pesosId = ?`
            params.push(pesosId);
        }
        if(generoId){
            query += ` AND generoId = ?`
            params.push(generoId);
        }
        if(estampasId){
            query += ` AND estampasId = ?`
            params.push(estampasId);
        }
        if(tamanhosId){
            query += ` AND tamanhosId = ?`
            params.push(tamanhosId);
        }
        if(materiaisId){
            query += ` AND materiaisId = ?`
            params.push(materiaisId);
        }

            await db.query(query,params);
        return res.status(200).json({message:"O item foi deletado do carrinho com sucesso"});
    }
    catch(err){
        return res.status(400).json({message:"Não foi possível remover o item do carrinho"});
    }
})

app.get("/itens-salvos", autenticarToken, async(req,res) => {
    const userId = req.usuarioId
    const params = [];
    let query = `SELECT it.id ,it.produto_id,it.nome, it.url, it.quantidade,it.preco,it.created_at,
    v.valor as voltagem_valor,t.valor as tamanho_valor,p.valor as peso_valor,p.unidade as peso_unidade,m.valor as material_valor ,g.valor as genero_valor,e.valor as estampa_valor,d.largura,d.altura,d.comprimento,d.unidade as dimensoes_unidade,
    c.id as cor_id,
    c.valor as cor_valor,
    v.id as voltagem_id,
    t.id as tamanho_id,
    p.id as peso_id,
    m.id as material_id,
    g.id as genero_id,
    e.id as estampas_id,
    d.id as dimensoes_id
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
    const params = [];

    let query = ` SELECT * 
        FROM itens_salvos 
        WHERE 1=1 `
    
    if(produtoId){
        query+=` AND produto_id = ?`
        params.push(produtoId);
    }

    if(userId){
        query+= ` AND usuario_id = ?`
        params.push(userId)
    }

    if(corId){
        query += ` AND cor_id = ?`
        params.push(corId)
    }
    if(voltagemId){
        query += ` AND voltagem_id = ?`
        params.push(voltagemId)
    }
    if(dimensoesId){
        query += ` AND dimensoes_id = ?`
        params.push(dimensoesId)
    }
    if(pesosId){
        query += ` AND pesos_id = ?`
        params.push(pesosId)
    }
    if(generoId){
        query += ` AND genero_id = ?`
        params.push(generoId);
    }
    if(estampasId){
        query += ` AND estampas_id = ?`
        params.push(estampasId);
    }
    if(tamanhosId){
        query += ` AND tamanhos_id = ?`
        params.push(tamanhosId);
    }
    if(materiaisId){
        query += ` AND materiais_id = ?`
        params.push(materiaisId);
    }

    const [itemJaExiste] = await db.query(query,params);

    if(itemJaExiste.length > 0){
        try{
            let segundaQuery = `UPDATE itens_salvos isalvo
                join cart_items ci on ci.produto_id = isalvo.produto_id
                join carts c on c.id = ci.cart_id
                set isalvo.quantidade = isalvo.quantidade + ci.quantidade
                where 1=1 `

            const segundoParams = [];
            
                if(produtoId){
                    segundaQuery+=` AND isalvo.produto_id = ?`
                    segundoParams.push(produtoId);
                }
                if(userId){
                    segundaQuery+=` AND isalvo.usuario_id = ? and c.usuario_id = ?`
                    segundoParams.push(userId,userId);
                }
                if(corId){
                    segundaQuery+=` AND isalvo.cor_id = ?`
                    segundoParams.push(corId);
                }
                if(voltagemId){
                    segundaQuery+=` AND isalvo.voltagem_id = ?`
                    segundoParams.push(voltagemId);
                }
                if(dimensoesId){
                    segundaQuery+=` AND isalvo.dimensoes_id = ?`
                    segundoParams.push(dimensoesId);
                }
                if(pesosId){
                    segundaQuery+=` AND isalvo.pesos_id = ?`
                    segundoParams.push(pesosId);
                }
                if(generoId){
                    segundaQuery+= ` AND isalvo.genero_id = ?`
                    segundoParams.push(generoId);
                }
                if(estampasId){
                    segundaQuery+= ` AND isalvo.estampas_id = ?`
                    segundoParams.push(estampasId);
                }
                if(tamanhosId){
                    segundaQuery+= ` AND isalvo.tamanhos_id = ?`
                    segundoParams.push(tamanhosId);
                }
                if(materiaisId){
                    segundaQuery+=` AND isalvo.materiais_id = ?`
                    segundoParams.push(materiaisId);
                }

                await db.query(segundaQuery,segundoParams);

                return res.status(200).json({message:"O item foi atualizado com sucesso"});
            }
        catch(err){
            return res.status(400).json({message: "Não foi possível atualizar a quantidade do item"});
        }
        
    }
    else{
        try{
            let itemSalvo;
            const terceiroParams = [userId,produtoId];
            let terceiraQuery = `INSERT INTO itens_salvos (usuario_id,produto_id,nome,url,quantidade,preco,cor_id,voltagem_id,dimensoes_id,pesos_id,genero_id,estampas_id,tamanhos_id,materiais_id)

    SELECT ?,?, p.nome,(SELECT i.url FROM imagens_produto i WHERE i.produto_id = p.id LIMIT 1) AS url ,ci.quantidade,p.preco,ci.cores_ids,ci.voltagemId,ci.dimensoesId,ci.pesosId,ci.generoId,ci.estampasId,ci.tamanhosId,ci.materiaisId from 
    cart_items ci left join produtos p on ci.produto_id = p.id
    left join carts c on c.id = ci.cart_id
    where 1=1`

            if(userId){
                terceiraQuery+= ` AND c.usuario_id = ?`
                terceiroParams.push(userId);
            }
            if(produtoId){
                terceiraQuery+= ` AND ci.produto_id = ?`
                terceiroParams.push(produtoId);
            }
            if(corId){
                terceiraQuery+= ` AND ci.cores_ids = ?`
                terceiroParams.push(corId); 
            }
            if(voltagemId){
                terceiraQuery+= ` AND ci.voltagemId = ?`
                terceiroParams.push(voltagemId); 
            }
            if(dimensoesId){
                terceiraQuery+= ` AND ci.dimensoesId = ?`
                terceiroParams.push(dimensoesId);
            }
            if(pesosId){
                terceiraQuery+= ` AND ci.pesosId = ?`
                terceiroParams.push(pesosId);
            }
            if(generoId){
                terceiraQuery+= ` AND ci.generoId = ?`
                terceiroParams.push(generoId);
            }
            if(estampasId){
                terceiraQuery+= ` AND ci.estampasId = ?`
                terceiroParams.push(estampasId); 
            }
            if(tamanhosId){
                terceiraQuery+= ` AND ci.tamanhosId = ?`
                terceiroParams.push(tamanhosId); 
            }
            if(materiaisId){
                terceiraQuery+= ` AND ci.materiaisId = ?` 
                terceiroParams.push(materiaisId);
            }


            const [resultado] = await db.query(terceiraQuery,terceiroParams);
            
            itemSalvo = resultado.insertId;
            

            if(corId){
                await db.query(`INSERT INTO itens_salvos_cores (item_salvo_id, cor_id)
                    VALUES (?, ?)`,[itemSalvo,corId]);
            }
            
            if(voltagemId){
                await db.query(`INSERT INTO itens_salvos_voltagens (item_salvo_id, voltagem_id)
                    VALUES (?, ?)`,[itemSalvo,voltagemId])
            }
            if(materiaisId){
                await db.query(`INSERT INTO itens_salvos_materiais (item_salvo_id, material_id)
                    VALUES (?, ?)`,[itemSalvo,materiaisId]);
            }
            
            if(dimensoesId){
                await db.query(`INSERT INTO itens_salvos_dimensoes (item_salvo_id, dimensao_id)
VALUES (?, ?)`,[itemSalvo,dimensoesId]);
            }
            
            if(tamanhosId){
                await db.query(`INSERT INTO itens_salvos_tamanhos (item_salvo_id, tamanho_id)
    VALUES (?, ?)`,[itemSalvo,tamanhosId]);
            }
            
            if(pesosId){
                await db.query(`INSERT INTO itens_salvos_pesos (item_salvo_id, peso_id)
        VALUES (?, ?)`,[itemSalvo,pesosId]);
            }
    
            if(generoId){
                await db.query(`INSERT INTO itens_salvos_genero (item_salvo_id, genero_id)
                VALUES (?, ?)`,[itemSalvo,generoId]);
            }
            if(estampasId){
                await db.query(`INSERT INTO itens_salvos_estampas (item_salvo_id, estampa_id)
                    VALUES (?, ?)`,[itemSalvo,estampasId]);
            }
                

            
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

app.put("/itens-salvos/:itemId", autenticarToken, async (req,res) => {
    const {itemId} = req.params;

    const userId = req.usuarioId
    
    const {quantidade, corId, voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId,produtoId, alterar} = req.body;
    
    try{ 
        let query = `UPDATE itens_salvos SET `
        let updates = [];
        let params = [];
        
        if(quantidade){
            updates.push(" quantidade = ?");
            params.push(quantidade);
        }

        if(corId){
            updates.push(" cor_id = ?")
            params.push(corId);
        }
        
        if(voltagemId){
            updates.push(" voltagem_id = ?")
            params.push(voltagemId);
        }
        if(dimensoesId){
            updates.push(" dimensoes_id = ?")
            params.push(dimensoesId);
        }
        if(pesosId){
            updates.push(" pesos_id = ?")
            params.push(pesosId);
        }
        if(generoId){
            updates.push(" genero_id = ?")
            params.push(generoId);
        }
        if(estampasId){
            updates.push(" estampas_id = ?")
            params.push(estampasId);
        }
        if(tamanhosId){
            updates.push(" tamanhos_id = ?")
            params.push(tamanhosId);
        }
        if(materiaisId){
            updates.push(" materiais_id = ?")
            params.push(materiaisId);
        }

        query += updates.join(", ");
        query += ` WHERE 1=1 `
        
        if(itemId){
            query+= ` AND id = ?`
            params.push(itemId);
        }

        if(userId){
            query += ` AND usuario_id = ?`
            params.push(userId);
        }

        const [primeiroResultado] = await db.query(query,params);
        
        
        const segundoParams = [];
        let segundaQuery = `SELECT * FROM itens_salvos 
        where 1=1`
        
        if(userId){
            segundaQuery+=` AND usuario_id = ?`
            segundoParams.push(userId);
        }

        if(itemId){
            segundaQuery+= ` AND id != ?`
            segundoParams.push(itemId);
        }
        if(corId){
            segundaQuery+= ` AND cor_id = ?`
            segundoParams.push(corId);
        }
        if(voltagemId){
            segundaQuery+= ` AND voltagem_id = ?`
            segundoParams.push(voltagemId);
        }
        if(dimensoesId){
            segundaQuery+= ` AND dimensoes_id = ?`
            segundoParams.push(dimensoesId);
        }
        if(pesosId){
            segundaQuery+= ` AND pesos_id = ?`
            segundoParams.push(pesosId);
        }
        if(generoId){
            segundaQuery+= ` AND genero_id = ?`
            segundoParams.push(generoId);
        }
        if(estampasId){
            segundaQuery+= ` AND estampas_id = ?`
            segundoParams.push(estampasId);
        }
        if(tamanhosId){
            segundaQuery+= ` AND tamanhos_id = ?`
            segundoParams.push(tamanhosId);
        }
        if(materiaisId){
            segundaQuery+= ` AND materiais_id = ?`
            segundoParams.push(materiaisId);
        }
        if(produtoId){
            segundaQuery+= ` AND ci.produto_id = ?`
            segundoParams.push(produtoId);
        }

        const [resultado] = await db.query(segundaQuery,segundoParams);

        

        if(resultado.length > 0){
            const itemExistente = resultado[0];
            
            if(itemExistente){
                
                await db.query(`UPDATE itens_salvos set quantidade = ? where id = ?`,[quantidade,itemExistente.id]);
                
            if(alterar){
                await db.query(`delete from itens_salvos where id = ?`, [itemId]); 
            }
                
            }    
    }
        
        if(corId) {
            
            await db.query(`UPDATE itens_salvos_cores SET cor_id = ? where item_salvo_id = ? `,[corId,itemId]);
        }
        if(voltagemId) {
            await db.query(`UPDATE itens_salvos_voltagens SET voltagem_id = ? where item_salvo_id = ?`,[voltagemId,itemId]);
        }
        if(dimensoesId) {
            await db.query(`UPDATE itens_salvos_dimensoes SET dimensao_id = ? where item_salvo_id = ?`,[dimensoesId,itemId]);
        }
        if(estampasId) {
            await db.query(`UPDATE itens_salvos_estampas SET estampa_id = ? where item_salvo_id = ?`,[estampasId,itemId]);
        }
        if(generoId) {
            await db.query(`UPDATE itens_salvos_generos SET genero_id = ? where item_salvo_id = ?`,[generoId,itemId]);
        }
        if(materiaisId) {
            await db.query(`UPDATE itens_salvos_materiais SET material_id = ? where item_salvo_id = ?`,[materiaisId,itemId]);
        }
        if(pesosId) {
            await db.query(`UPDATE itens_salvos_pesos SET peso_id = ? where item_salvo_id = ? `,[pesosId,itemId]);
        }
        if(tamanhosId) {
            await db.query(`UPDATE itens_salvos_tamanhos SET tamanho_id = ? where item_salvo_id = ?`,[tamanhosId,itemId]);
        }

        return res.status(200).json({message:"Produto atualizado com sucesso"});
     
    }
    catch(err){
        
        console.error("Não foi possivel atualizar o item");
        return res.status(500).json({message:"Erro interno do servidor"});
    }
}  
)

app.delete("/itens-salvos",autenticarToken, async (req,res) => {
    const {produtoId, corId, voltagemId, dimensoesId, pesosId, generoId, estampasId, tamanhosId, materiaisId} = req.body
    const userId = req.usuarioId
    
    try{
        const params = [];
        let query =`DELETE FROM itens_salvos where 1=1`;
        
        if(produtoId){
            query+= ` AND produto_id = ?`
            params.push(produtoId);
        }
        if(userId){
            query += ` AND usuario_id = ?`
            params.push(userId);
        }
        if(corId){
            query += ` AND cor_id = ?`
            params.push(corId);
        }
        if(voltagemId){
            query += ` AND voltagem_id = ?`
            params.push(voltagemId);
        }
        if(dimensoesId){
            query += ` AND dimensoes_id = ?`
            params.push(dimensoesId);
        }
        if(pesosId){
            query += ` AND pesos_id = ?`
            params.push(pesosId);
        }
        if(generoId){
            query += ` AND genero_id = ?`
            params.push(generoId);
        }
        if(estampasId){
            query += ` AND estampas_id = ?`
            params.push(estampasId);
        }
        if(tamanhosId){
            query += ` AND tamanhos_id = ?`
            params.push(tamanhosId);
        }
        if(materiaisId){
            query += ` AND materiais_id = ?`
            params.push(materiaisId);
        }

        await db.query(query,params);


        res.status(200).json({message:"O produto foi deletado com sucesso"});
    }
    catch(err){
        return res.status(500).json({message:"Erro interno do servidor"});
    }
})

app.get("/categorias-tipo", async (req,res) => {
    try{
        const [resultado] = await db.query("Select * from categorias_tipos");

        return res.status(200).json(resultado);
    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel carregar as categorias"})
    }
})

app.get("/enderecos",autenticarToken, async (req,res) => {
    const userId = req.usuarioId;

    try{
        const [resultado] = await db.query("SELECT * from enderecos e left join usuarios u on e.usuario_id = u.id where u.id = ?",[userId])

        if(resultado.length === 0){
            return res.status(200).json([]);
        }
        return res.status(200).json(resultado);
    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel obter os endereços"})
    }
})

app.post("/salvar-endereco",autenticarToken, async (req,res) => {
    const {cep, rua,numero, complemento, informacoesAdicionais, tipoDoLocal, nome, telefone,bairro,cidade,estado} = req.body;
    const userId = req.usuarioId;

    try{
        const params = [];
        const columns = [];

        if(userId){
            columns.push(`usuario_id`);
            params.push(userId);
        }

        if(cep){   
            columns.push(`cep`);
            params.push(cep);
        }
        if(bairro){   
            columns.push(`bairro`);
            params.push(bairro);
        }
        if(cidade){   
            columns.push(`cidade`);
            params.push(cidade);
        }
        if(estado){   
            columns.push(`estado`);
            params.push(estado);
        }
        if(rua){   
            columns.push(`logradouro`);
            params.push(rua);
        }
        if(numero){   
            columns.push(`numero`);
            params.push(numero);
        }
        if(complemento){   
            columns.push(`complemento`);
            params.push(complemento);
        }
        if(informacoesAdicionais){   
            columns.push(`informacoes_adicionais`);
            params.push(informacoesAdicionais);
        }
        if(tipoDoLocal){   
            columns.push(`tipo_do_local`);
            params.push(tipoDoLocal);
        }
        if(nome){   
            columns.push(`nome_destinatario`);
            params.push(nome);
        }
        if(telefone){   
            columns.push(`telefone`);
            params.push(telefone);
        }

        const placeholders = columns.join(", ");
        const valuePlaceholders = columns.map(() => "?").join(", ");
        let query = `INSERT INTO enderecos (${placeholders}) values (${valuePlaceholders})`;

     await db.query(query, params);
    
    return res.status(200).json({message:"O endereço foi cadastrado com sucesso"});
    }

    catch(err){
        return res.status(500).json({message:"Não foi possivel cadastrar o endereco"});
    }
})

app.put("/salvar-endereco/:enderecoId",autenticarToken, async(req,res) => {
    const userId = req.usuarioId;
    const {enderecoId} = req.params;
    const {cep, rua,numero, complemento, informacoesAdicionais, tipoDoLocal, nome, telefone,bairro,cidade,estado} = req.body;
    try{
            const params = [];
            const columns = [];
    
            if(cep){   
                columns.push(`cep = ?`);
                params.push(cep);
            }
            if(bairro){   
                columns.push(`bairro = ?`);
                params.push(bairro);
            }
            if(cidade){   
                columns.push(`cidade = ?`);
                params.push(cidade);
            }
            if(estado){   
                columns.push(`estado = ? `);
                params.push(estado);
            }
            if(rua){   
                columns.push(`logradouro = ?`);
                params.push(rua);
            }
            if(numero){   
                columns.push(`numero = ?`);
                params.push(numero);
            }
            if(complemento){   
                columns.push(`complemento = ?`);
                params.push(complemento);
            }
            if(informacoesAdicionais){   
                columns.push(`informacoes_adicionais = ?`);
                params.push(informacoesAdicionais);
            }
            if(tipoDoLocal){   
                columns.push(`tipo_do_local = ?`);
                params.push(tipoDoLocal);
            }
            if(nome){   
                columns.push(`nome_destinatario = ?`);
                params.push(nome);
            }
            if(telefone){   
                columns.push(`telefone = ?`);
                params.push(telefone);
            }
    
            const setClause = columns.join(", ");
            let query = `UPDATE enderecos set ${setClause}`;
    
            query += ` WHERE 1=1 `

            if(enderecoId){
                query += ` AND id_endereco = ? `
                params.push(enderecoId);
            }
            if(userId){
                query += ` AND usuario_id = ? `
                params.push(userId);
            }
         
            await db.query(query, params);
        
        return res.status(200).json({message:"O endereço foi cadastrado com sucesso"});
        

    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel editar o endereco"});
    }
})

app.put("/enderecos/:enderecoId",autenticarToken, async (req,res) => {
    const {enderecoId} = req.params;
    try{
        await db.query("UPDATE enderecos set padrao = 1 where id_endereco = ?",[enderecoId]);
        await db.query("UPDATE enderecos set padrao = 0 where id_endereco != ? ",[enderecoId]);
    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel tornar padrão"});
    }
})

app.get("/enderecos/:enderecoId",autenticarToken, async (req,res) => {
    const {enderecoId} = req.params;
    const userId = req.usuarioId;
    try{
        const [resultado] = await db.query("SELECT * from enderecos e left join usuarios u on e.usuario_id = u.id where u.id = ? and e.id_endereco = ?",[userId,enderecoId]);
    
        if(resultado.length === 0){
            return res.status(200).json([]);
        }
        
            return res.status(200).json(resultado[0]);
    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel carregar o endereco para editar"})
    }
})

app.delete("/enderecos/:enderecoId",autenticarToken, async (req,res) => {
    const userId = req.usuarioId;
    const {enderecoId} = req.params;

    try{
        await db.query("DELETE FROM enderecos where id_endereco = ? and usuario_id = ? ",[enderecoId,userId]);
    return res.status(200).json({message:"O endereço foi deletado com sucesso"});

    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel excluir o endereço"})
    }
})

app.get("/cartoes-salvos",autenticarToken, async (req,res) => {
    const userId = req.usuarioId;
    
    try{
        const [resultado] = await db.query("SELECT id_cartao, numero_mascarado, nome_titular, bandeira, data_expiracao from cartoes_salvos where id_usuario = ?",[userId]);

        if(resultado.length === 0){
            return res.status(200).json([]);
        }

        return res.status(200).json(resultado);
    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel retornar os cartões salvos"});
    }
})


app.post("/cartoes-salvos", autenticarToken, async (req,res) => {
    const {numeroCartao, nomeTitularCartao, vencimentoCartao, tipoDeDocumento,documentoTitular, bandeira} = req.body;
    const userId = req.usuarioId;
    try{
        const numerosFinaisCartao = numeroCartao?.slice(-4);
        const numeroMascaradoCartao = `**** **** **** ` + numerosFinaisCartao;
        const [resultado] = await db.query(`INSERT INTO cartoes_salvos (numero_mascarado, id_usuario, nome_titular, bandeira, data_expiracao)
             values (?,?,?,?,?)`,[numeroMascaradoCartao,userId,nomeTitularCartao,bandeira,vencimentoCartao]);
            
            const insertedId = resultado.insertId;
            console.log(insertedId);
             return res.status(200).json({message:"O cartão foi adicionado com sucesso",
                id_cartao:insertedId
             });
    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel salvar o cartão"});
    }
})

app.delete("/cartoes-salvos/:idCartao", autenticarToken, async(req,res) => {
        const userId = req.usuarioId;
        const {idCartao} = req.params;
    try{
        await db.query("DELETE FROM cartoes_salvos where id_usuario = ? and id_cartao =  ?",[userId,idCartao]);
        return res.status(200).json({message:"O cartão foi deletado com sucesso"});
    }
    catch(err){
        return res.status(500).json({message:"Não foi possível excluir o cartão"});
    }
})

app.post("/confirmar-compra", autenticarToken, async (req,res) => {
    const userId = req.usuarioId;
    const {itens, statusPedido,codigoRastramento,dataEnvio,dataCancelamento,observacoes,valorTotal, metodoPagamento, enderecoEnvio,enderecoSelecionado, cartaoUsado,parcelas,valorParcela,valorFrete,freteSelecionado} = req.body.pedido;
    console.log(`enederecoEnvioe`,enderecoEnvio);
    
    const numero = cartaoUsado?.numero || null
    const expiracao = cartaoUsado?.expiracao || null;
    const lougradouroEndereco = enderecoEnvio?.logradouro || null ;
    const cidadeEndereco = enderecoEnvio?.cidade || null
    const numeroEndereco = enderecoEnvio?.numero || null
    const complementoEndereco = enderecoEnvio?.complemento || null
    const estadoEndereco = enderecoEnvio?.estado || null;

    try{
        const columns = [];
        const params = [];

        if(userId){
            columns.push(`user_id`)
            params.push(userId);
        }
        
        if(statusPedido){
            columns.push(`status`)
            params.push(statusPedido);
        }
        
        if(metodoPagamento){
            columns.push(`metodo_pagamento`)
            params.push(metodoPagamento);
        }
        
        if(lougradouroEndereco){
            columns.push(`endereco_logradouro`)
            params.push(lougradouroEndereco);
        }
        if(cidadeEndereco){
            columns.push(`endereco_cidade`)
            params.push(cidadeEndereco);
        }
        if(numeroEndereco){
            columns.push(`endereco_numero`)
            params.push(numeroEndereco);
        }
        if(complementoEndereco){
            columns.push(`endereco_complemento`)
            params.push(complementoEndereco);
        }
        if(estadoEndereco){
            columns.push(`endereco_estado`)
            params.push(estadoEndereco);
        }
        
        if(codigoRastramento){
            columns.push(`codigo_rastreamento`)
            params.push(codigoRastramento);
        }
        
        if(dataEnvio){
            columns.push(`data_envio`)
            params.push(dataEnvio);
        }
        
        if(dataCancelamento){
            columns.push(`data_cancelamento`)
            params.push(dataCancelamento);
        }
        if(valorTotal){
            columns.push(`total`)
            params.push(valorTotal);
        }
        if(observacoes){
            columns.push(`observacoes`)
            params.push(observacoes);
        }
        if(numero){
            columns.push(`cartao_mascarado`)
            params.push(numero);
        }
        if(expiracao){
            columns.push(`cartao_expiracao`);
            params.push(expiracao);
        }
        if(valorParcela){
            columns.push(`valor_parcela`)
            params.push(valorParcela);
        }
        if(parcelas){
            columns.push(`parcelas`);
            params.push(parcelas);
        }
        if(valorFrete){
            columns.push(`preco_frete`);
            params.push(valorFrete);
        }

        const placeholders = columns.join(", ");
        const valuePlaceholders = columns.map(() => "?").join(", ");
        
        let query = `INSERT INTO pedidos (${placeholders}) values (${valuePlaceholders})`

        const [resultado] = await db.query(query,params);

        let pedidoId = resultado.insertId;

       console.log(`itense`,itens);
        
        for (const item of itens) {
            const columns = ['pedido_id', 'produto_id', 'quantidade', 'preco_unitario', 'sub_total'];
            const params = [pedidoId, item.produto_id, item.quantidade, item.preco, Number(item.preco) * Number(item.quantidade)];
            const variacoes = [];
            const insertParams = [pedidoId,item.produto_id]
            if (item.cores) {
                columns.push('cor_nome');
                params.push(item.cores);
                variacoes.push(`cor_nome = ?`)
                insertParams.push(item.cores);
            }
            if (item.voltagens) {
                columns.push('voltagem');
                params.push(item.voltagens);
                variacoes.push(`voltagem = ?`)
                insertParams.push(item.voltagens);
            }
            if (item.dimensoes) {
                columns.push('dimensoes');
                params.push(item.dimensoes);
                variacoes.push(`dimensoes = ?`)
                insertParams.push(item.dimensoes);
            }
            if (item.pesos) {
                columns.push('pesos');
                params.push(item.pesos);
                variacoes.push(`pesos = ?`)
                insertParams.push(item.pesos);
            }
            if (item.generos) {
                columns.push('generos');
                params.push(item.generos);
                variacoes.push(`generos = ?`)
                insertParams.push(item.generos);
            }
            if (item.estampas) {
                columns.push('estampas');
                params.push(item.estampas);
                variacoes.push(`estampas = ?`)
                insertParams.push(item.estampas);
            }
            if (item.tamanhos) {
                columns.push('tamanhos');
                params.push(item.tamanhos);
                variacoes.push(`tamanhos = ?`)
                insertParams.push(item.tamanhos);
            }
            if (item.materiais) {
                columns.push('materiais');
                params.push(item.materiais);
                variacoes.push(`materiais = ?`)
                insertParams.push(item.materiais);
            }
            if(item.frete_selecionado){
                columns.push(`frete_selecionado`);
                params.push(item.frete_selecionado);
            }

            const whereClause = ['pedido_id = ?','produto_id = ?', ...variacoes].join(" AND ");
            console.log(`insertParamse`,insertParams);
            console.log(`variacoese`,variacoes);
            console.log(`whereClausee`,whereClause);
            const [existente] = await db.query(`SELECT * from itens_pedido where ${whereClause}`,insertParams);
            console.log(existente[0]);

            if(existente.length > 0){
                const itemExistente = existente[0];

                const novaQuantidade = Number(itemExistente.quantidade) + Number(item.quantidade);
                const novoSubtotal = Number(item.preco) * novaQuantidade;
            
            await db.query(`UPDATE itens_pedido set quantidade = ?, sub_total = ? where ${whereClause}`,[novaQuantidade,novoSubtotal,...params])

            }
            else{
            
            const placeholders = columns.map(() => '?').join(', ');
        
            const query = `INSERT INTO itens_pedido (${columns.join(', ')}) VALUES (${placeholders})`;
        
            await db.query(query, params);
            }
        
            
        }
             
        
        return res.status(200).json({pedidoId:pedidoId});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possivel confirmar a compra"})
    }
})


app.get("/meus-pedidos", autenticarToken, async(req,res) => {
    const userId = req.usuarioId;

    try{
        const [pedidos] = await db.query("SELECT * from pedidos where user_id = ?",[userId]);

        
        if(pedidos.length === 0){
            return res.status(200).json([]);
        }
        for (const pedido of pedidos) {
            const [itens] = await db.query("SELECT ip.id,ip.pedido_id,ip.produto_id,ip.quantidade,ip.preco_unitario,ip.sub_total,p.nome,ip.cor_nome,ip.voltagem,ip.dimensoes,ip.pesos,ip.generos,ip.estampas,ip.tamanhos,ip.materiais,(SELECT i.url FROM imagens_produto i WHERE i.produto_id = ip.produto_id LIMIT 1) AS url FROM itens_pedido ip left join produtos p on p.id = ip.produto_id WHERE pedido_id = ?", [pedido.id]);
            pedido.itens = itens;
        }

        const quantidadeDePedidos = pedidos.length;



        return res.status(200).json(
             {  quantidadeDePedidos,
                dados:pedidos});
    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel retornar seus pedidos"})
    }
})

app.get("/meus-pedidos/:idPedido", autenticarToken, async (req, res) => {
    const userId = req.usuarioId;
    const { idPedido } = req.params;
    try {
        // Primeiro, pegue as informações do pedido
        const [pedidoResultado] = await db.query(
            `SELECT p.id, p.user_id, p.data_pedido, p.total, p.status, p.metodo_pagamento, 
                    p.endereco_logradouro,p.endereco_cidade,p.endereco_estado,p.endereco_complemento,p.endereco_numero, p.observacoes, p.codigo_rastreamento, 
                    p.parcelas,p.valor_parcela,p.preco_frete,p.data_envio, p.data_cancelamento, p.cartao_mascarado, p.cartao_expiracao 
             FROM pedidos p 
             WHERE p.id = ? AND p.user_id = ?`,
            [idPedido, userId]
        );

        // Se o pedido não for encontrado, retorne erro
        if (pedidoResultado.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        const pedido = pedidoResultado[0]; // Pedido encontrado

        // Agora, pegue os itens do pedido
        const [itensResultado] = await db.query(
            `SELECT ip.id, ip.produto_id, ip.quantidade, ip.preco_unitario, ip.sub_total, 
                    ip.cor_nome, ip.voltagem, ip.dimensoes, ip.pesos, ip.generos, 
                    ip.estampas, ip.tamanhos, ip.materiais,(SELECT i.url FROM imagens_produto i WHERE i.produto_id = ip.produto_id LIMIT 1) AS url, pr.nome,
                    f.valor as valor_frete
                    FROM itens_pedido ip
             left join produtos pr on pr.id = ip.produto_id
             LEFT JOIN (
                SELECT produto_id, MIN(valor) AS valor
                FROM frete
                GROUP BY produto_id
            ) f ON f.produto_id = ip.produto_id
             WHERE ip.pedido_id = ?`,
            [idPedido]
        );

        // Se não houver itens para esse pedido, retorne erro
        if (itensResultado.length === 0) {
            return res.status(404).json({ message: "Itens do pedido não encontrados" });
        }

        // Adicionar os itens ao pedido
        pedido.itens = itensResultado;

        // Retornar o pedido com os itens
        return res.status(200).json(pedido);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao carregar pedido" });
    }
});

app.get("/meus-pedidos-pesquisa/:nomePesquisa?",autenticarToken, async (req,res) => {
    const userId = req.usuarioId;
    const nomePesquisa = req.params.nomePesquisa || '';
    const filtro = req.query.filtroSelecionado;
    console.log(`nomePesquisae`,nomePesquisa);
    

    try{
        
        let query = `select *,(SELECT i.url FROM imagens_produto i WHERE i.produto_id = pr.id LIMIT 1) AS url from itens_pedido ip left join pedidos p on p.id = ip.pedido_id left join produtos pr on pr.id = ip.produto_id where ip.pedido_id in (select ip2.pedido_id from itens_pedido ip2 left join produtos pr2 on pr2.id = ip2.produto_id where 1=1`
        
        const params = [];
        
        if(nomePesquisa){
            query += ` AND pr2.nome like ?`;
            params.push(`%${nomePesquisa}%`);
        }

        query += ` ) AND p.user_id = ?`
        params.push(userId);


        if(filtro === "Todas") {
        } else {
            switch(filtro) {
                case "Este Mês":
                    query += ` AND MONTH(p.data_pedido) = ?`;
                    params.push(new Date().getMonth() + 1); 
                    break;
                case "Mês passado":
                    query += ` AND MONTH(p.data_pedido) = ? AND YEAR(p.data_pedido) = ?`;
                    params.push(new Date().getMonth()); 
                    params.push(new Date().getFullYear()); 
                    break;
                case "Esse ano":
                    query += ` AND YEAR(p.data_pedido) = ?`;
                    params.push(new Date().getFullYear()); 
                    break;
                case "2024":
                case "2023":
                case "2022":
                case "2021":
                    query += ` AND YEAR(p.data_pedido) = ?`;
                    params.push(Number(filtro)); 
                    break;
                default:
                    break;
            }
        }

        const [resposta] = await db.query(query,params);

        const pedidosUnicos = new Set(resposta.map(item => item.pedido_id));
        const quantidadeDePedidos = pedidosUnicos.size;

        return res.status(200).json({
            quantidadeDePedidos,
            dados:resposta});
    
    
    
    }
    catch(err){
        return res.status(500).json({message:"Não foi possivel pesquisar pedido"});
    }
})


app.get("/buscar-cores-produto/:nomeCor", async (req,res) => {

    const {nomeCor} = req.params

    try{
        const [cores] = await db.query("SELECT * from cores where valor like ? ",[`%${nomeCor}%`]);

        return res.status(200).json(cores);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Não foi possivel buscar a cor"});
    }
});

app.get("/buscar-estampa-produto/:nomeEstampa", async (req,res) => {

    const {nomeEstampa} = req.params

    try{
        const [estampas] = await db.query("SELECT * from estampas where valor like ?",[`%${nomeEstampa}%`]);
        

        return res.status(200).json(estampas);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Não foi possivel buscar a cor"});
    }
});


app.get("/buscar-genero-produto/:nomeGenero", async (req,res) => {

    const {nomeGenero} = req.params

    try{
        const [generos] = await db.query("SELECT * from generos where valor like ? ",[`%${nomeGenero}%`]);
        return res.status(200).json(generos);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Não foi possivel buscar a cor"});
    }
});

app.get("/buscar-materiais-produto/:nomeMateriais", async (req,res) => {

    const {nomeMateriais} = req.params

    try{
        const [materiais] = await db.query("SELECT * from material where valor like ?",[`%${nomeMateriais}%`]);
        return res.status(200).json(materiais);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Não foi possivel buscar o material"});
    }
});

app.get("/buscar-tamanhos-produto/:nomeTamanhos", async (req,res) => {

    const {nomeTamanhos} = req.params

    try{
        const [tamanhos] = await db.query("SELECT * from tamanhos where valor like ?",[`%${nomeTamanhos}%`]);
        return res.status(200).json(tamanhos);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Não foi possivel buscar o tamanho"});
    }
});

app.get("/buscar-voltagens-produto/:nomeVoltagens", async (req,res) => {

    const {nomeVoltagens} = req.params

    try{
        const [voltagens] = await db.query("SELECT * from voltagens where valor like ?",[`%${nomeVoltagens}%`]);
        return res.status(200).json(voltagens);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Não foi possivel buscar a cor"});
    }
});

app.post("/anunciar-produto", autenticarToken, async(req,res) => {
    const userId = req.usuarioId;
    const {nomeProduto,descricao,
        precoProduto,estoque,tipoProdutoId,
        cor,dimensoes,estampa,genero,
        material,pesos,
        tamanho,voltagem,opiniaoClientes,
    imagens,precoProdutoPix,numeroParcelas,precoTotalParcelado,desconto,cep,
    numeroParcelasGratis,
    taxaJurosAoMes,condicaoProduto,freteSelecionado} = req.body;
    

    try{
        const columns = [];
        const params = [];

        if(nomeProduto){
            columns.push(`nome`);
            params.push(nomeProduto);
        }
        if(descricao){
            columns.push(`descricao`);
            params.push(descricao);
        }
        if(precoProduto){
            columns.push(`preco`);
            params.push(precoProduto);
        }
        if(estoque){
            columns.push(`estoque`);
            params.push(estoque);
        }
        if(userId){
            columns.push(`user_id`);
            params.push(userId);
        }
        if(tipoProdutoId){
            columns.push(`tipo_produto_id`);
            params.push(tipoProdutoId);
        }
        if(precoProdutoPix){
            columns.push(`preco_pix`);
            params.push(precoProdutoPix);
        }
        if(numeroParcelas){
            columns.push(`parcelas_máximas`);
            params.push(numeroParcelas);
        }
        if(desconto && desconto > 0){
            columns.push(`desconto`);
            params.push(desconto);
        }
        if(precoTotalParcelado){
            columns.push(`preco_parcelado`);
            params.push(precoTotalParcelado);
        }
        if(condicaoProduto){
            columns.push(`tipo_produto_id`);
            params.push(condicaoProduto);
        }
       
        if(cep){
            columns.push(`cep_origem`)
            params.push(cep);
        }

        if(freteSelecionado){
            columns.push(`frete_selecionado`);
            params.push(freteSelecionado);
        }

        const placeholders = columns.join(", ");
        const valuePlaceholders = columns.map(() => "?").join(", ");

        let query = `INSERT INTO produtos (${placeholders}) values (${valuePlaceholders})`;
        
        const [resultado] = await db.query(query,params);

        const produtoId = resultado.insertId;

        if(cor){

            for(const c of cor){
                const [corJaExiste] = await db.query("SELECT id from cores where valor = ? ",[c]);
                if(corJaExiste.length > 0){
                    let query = `INSERT INTO produtos_cor (produto_id,cor_id) values (?,?)`
                const params = [produtoId,corJaExiste[0].id];
                await db.query(query,params) 
                }
                else{
                 const [resultado] = await db.query("INSERT INTO cores (valor) values (?)",[c]);
                 let query = `INSERT INTO produtos_cor (produto_id,cor_id) values (?,?)`
                 const params = [produtoId,resultado.insertId];
                 await db.query(query,params) 
                }
            }

            
            
        }
        if(dimensoes){

            const {largura,altura,comprimento,unidadeDimensoes} = dimensoes;
            const columns = [];
            const params = [];
            
            if(largura){
                columns.push(`largura`)
                params.push(largura);
            }
            if(altura){
                columns.push(`altura`)
                params.push(altura);
            }
            if(comprimento){
                columns.push(`comprimento`)
                params.push(comprimento);
            }
            if((unidadeDimensoes && comprimento) || (unidadeDimensoes && largura) || (unidadeDimensoes && altura)){
                columns.push(`unidade`)
                params.push(unidadeDimensoes);
            }

            const placeholders = columns.join(", ");
            const valuePlaceholders = columns.map(() => "?").join(", ");
            
            let query = `INSERT INTO dimensoes (${placeholders}) values (${valuePlaceholders})`

            const [resultado] = await db.query(query,params);

            await db.query("INSERT INTO produtos_dimensoes (produto_id,dimensoes_id) values (?,?)",[produtoId,resultado.insertId])
            
        }
        if(estampa){


            for(const e of estampa){
                const [estampaExistente] = await db.query("SELECT id from estampas where valor = ?",[e]);
                if(estampaExistente.length > 0){
                    let query = "INSERT INTO produtos_estampas (produto_id,estampa_id) values (?,?)"
                    await db.query(query,[produtoId,estampaExistente[0].id])
                }
                else{
                const [novaEstampa] =  await db.query("INSERT INTO estampas (valor) values (?)",[e]);
                let query = "INSERT INTO produtos_estampas (produto_id,estampa_id) values (?,?)"
                await db.query(query,[produtoId,novaEstampa.insertId]);
                }
            }

            

        }
        if(genero){
            
            for(const g of genero){
                const [generoExistente] = await db.query("SELECT id from generos where valor = ?",[g])
            if(generoExistente.length > 0){
                let query = "INSERT INTO produtos_genero (produto_id,genero_id) values (?,?)"
                await db.query(query,[produtoId,generoExistente[0].id])
            }
            else{
                const [novoGenero] =  await db.query("INSERT INTO generos (valor) values (?)",[g]);
            let query = "INSERT INTO produtos_genero (produto_id,genero_id) values (?,?)"
            await db.query(query,[produtoId,novoGenero.insertId]);
            }
            }
            
            
        }
        if(material){

            for(const m of material){
                const [materialExistente] = await db.query("SELECT id from material where valor = ?",[m])
            if(materialExistente.length > 0){
                let query = "INSERT INTO produtos_materiais (produto_id,material_id) values (?,?)"
                await db.query(query,[produtoId,materialExistente[0].id])
            }
            else{
                const [novoMaterial] =  await db.query("INSERT INTO material (valor) values (?)",[m]);
            let query = "INSERT INTO produtos_materiais (produto_id,material_id) values (?,?)"
            await db.query(query,[produtoId,novoMaterial.insertId]);
            }
            }
            
        }
        if(pesos){
            const {peso, unidadePeso} = pesos;
            if(peso && unidadePeso) {
                const [novoPeso] =  await db.query("INSERT INTO pesos (valor,unidade) values (?,?)",[peso,unidadePeso]);
                 let query = "INSERT INTO produtos_pesos (produto_id,peso_id) values (?,?)"
            await db.query(query,[produtoId,novoPeso.insertId]);
            }
            
        }
        if(tamanho){

            for(const t of tamanho){
                const [tamanhoExistente] = await db.query("SELECT id from tamanhos where valor = ?",[t])
                if(tamanhoExistente.length > 0){
                    let query = "INSERT INTO produtos_tamanhos (produto_id,tamanho_id) values (?,?)"
                    await db.query(query,[produtoId,tamanhoExistente[0].id])
                }
                else{
                    const [novoTamanho] =  await db.query("INSERT INTO tamanhos (valor) values (?)",[t]);
                let query = "INSERT INTO produtos_tamanhos (produto_id,tamanho_id) values (?,?)"
                await db.query(query,[produtoId,novoTamanho.insertId]);
                }
            }
            

        }
        if(voltagem){

            for(const v of voltagem){
                const [voltagemExistente] = await db.query("SELECT id from voltagens where valor = ?",[v])
            if(voltagemExistente.length > 0){
                let query = "INSERT INTO produtos_voltagens (produto_id,voltagens_id) values (?,?)"
                await db.query(query,[produtoId,voltagemExistente[0].id])
            }
            else{
                const [novaVoltagem] =  await db.query("INSERT INTO voltagens (valor) values (?)",[v]);
            let query = "INSERT INTO produtos_voltagens (produto_id,voltagens_id) values (?,?)"
            await db.query(query,[produtoId,novaVoltagem.insertId]);
            }
            }
            
        }
        if(imagens){
            const {imagem1,imagem2,imagem3,imagem4,imagem5} = imagens;
            
          if(imagem1){
            await db.query("INSERT INTO imagens_produto (produto_id,url) values (?,?)",[produtoId,imagem1]);
          }
          if(imagem2){
            await db.query("INSERT INTO imagens_produto (produto_id,url) values (?,?)",[produtoId,imagem2]);
          }
          if(imagem3){
            await db.query("INSERT INTO imagens_produto (produto_id,url) values (?,?)",[produtoId,imagem3]);
          }
          if(imagem4){
            await db.query("INSERT INTO imagens_produto (produto_id,url) values (?,?)",[produtoId,imagem4]);
          }
          if(imagem5){
            await db.query("INSERT INTO imagens_produto (produto_id,url) values (?,?)",[produtoId,imagem5]);
          }
            
        }

        return res.status(200).json(produtoId);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possível anunciar o produto"})
    }
})


function calcularPrazoEPreco(cepOrigem, cepDestino) {
  // Calculando a diferença entre os dois CEPs
  const diff = Math.abs(parseInt(cepOrigem?.slice(0,5)) - parseInt(cepDestino?.slice(0,5)));
  
  // Calculando o prazo de entrega (em dias)
  const prazoEmDias = Math.floor(diff / 1000) + 1; // Pelo menos 1 dia
  
  // Simulando o preço de envio
  const precoBase = 10; // Preço base
  const aumentoPorDistancia = Math.floor(diff / 500); // A cada 500 unidades de diferença, aumenta R$ 2
  const precoEnvio = precoBase + aumentoPorDistancia * 2; // Aumento no preço

  return {
    prazoEmDias,
    precoEnvio: precoEnvio.toFixed(2)
  };
}

app.post("/calcular-prazo-preco", autenticarToken,async (req,res) => {
    const userId = req.usuarioId;
    const {cepOrigem, cepDestino} = req.body;
    
    
    try{
        const resposta = await axios.get(`https://viacep.com.br/ws/${cepDestino}/json`);
        const {prazoEmDias,precoEnvio} = calcularPrazoEPreco(cepOrigem,cepDestino);
        return res.status(200).json({cepOrigem,
            cepDestino,
            prazoEmDias,
            precoEnvio,
            localidade:resposta.data.localidade,
            estado:resposta.data.uf,
            mensagem:`Prazo estimado de envio ${prazoEmDias} dias.Preço do envio: R$ ${precoEnvio}`
})

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possivel calcular o prazo e o preço"})
    }
})

app.post("/inserir-frete-valor", autenticarToken, async (req, res) => {
    const {prazo,valor,localidade,produtoId, estado} = req.body
    
    try{
        const [resultado] = await db.query("SELECT * from frete where produto_id = ? and cidade = ?",[produtoId,localidade]);
        if(resultado.length === 0){
            await db.query("INSERT INTO frete (produto_id,cidade,valor,prazo,estado) values (?,?,?,?,?)",[produtoId,localidade,valor,prazo,estado]);
            return res.status(200).json({message:"Frete inserido com sucesso"});
        }
        else{
            return res.status(200).json({message:"Frete ja existe pra essa localidade"});
        }
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possivel inserir o valor do frete"})
    }
})

app.post("/adicionar-nova-venda",autenticarToken, async (req,res) => {
    const userId = req.usuarioId;
    const {statusVenda,itens,vendedorId, metodoPagamento, total, enderecoLogradouro, enderecoCidade, enderecoNumero, enderecoComplemento, enderecoEstado, parcelas, valorParcelas, precoFrete, pedidoId} = req.body;
    
    try{
        const columns = [];
        const params = [];

        if(vendedorId){
            columns.push(`id_vendedor`);
            params.push(vendedorId);
        }
        if(statusVenda){
            columns.push(`status_venda`);
            params.push(statusVenda);
        }
        if(metodoPagamento){
            columns.push(`metodo_pagamento`);
            params.push(metodoPagamento);
        }

        
        if(total){
            columns.push(`total`);
            params.push(total);
        }
        if(enderecoLogradouro){
            columns.push(`endereco_logradouro`);
            params.push(enderecoLogradouro);
        }
        if(enderecoCidade){
            columns.push(`endereco_cidade`);
            params.push(enderecoCidade);
        }
        if(enderecoNumero){
            columns.push(`endereco_numero`);
            params.push(enderecoNumero);
        }
        if(enderecoComplemento){
            columns.push(`endereco_complemento`);
            params.push(enderecoComplemento);
        }
        if(enderecoEstado){
            columns.push(`endereco_estado`);
            params.push(enderecoEstado);
        }
        if(parcelas){
            columns.push(`parcelas`);
            params.push(parcelas);
        }
        if(valorParcelas){
            columns.push(`valor_parcelas`);
            params.push(valorParcelas);
        }
        if(precoFrete){
            columns.push(`preco_frete`);
            params.push(precoFrete);
        }
        if(pedidoId){
            columns.push(`pedido_id`);
            params.push(pedidoId);
        }
        if(userId){
            columns.push(`id_comprador`);
            params.push(userId);
        }

        
        const placeholders = columns.join(", ");
        const valuePlaceholders = columns.map(() => "?").join(", ");
        
        let query = `INSERT INTO vendas (${placeholders}) values (${valuePlaceholders})`;

        const [resultado] = await db.query(query,params);

        if(itens){
            for(const item of itens){
                const params =[];
                const columns = [];
                columns.push(`id_venda`)
                params.push(resultado.insertId); 
                
                if(item.usuario_id_dono_produto){
                    columns.push(`id_vendedor`);
                    params.push(item.usuario_id_dono_produto);
                    }
            
                if(item.produto_id){
                    columns.push(`produto_id`)
                    params.push(item.produto_id);
                }
                if(item.cor_nome){
                    columns.push(`cor_nome`)
                    params.push(item.cor_nome);
                }
                if(item.voltagem){
                    columns.push(`voltagem`)
                    params.push(item.voltagem);
                }
                if(item.dimensoes){
                    columns.push(`dimensoes`)
                    params.push(item.dimensoes);
                }
                if(item.pesos){
                    columns.push(`pesos`)
                    params.push(item.pesos);
                }
                if(item.generos){
                    columns.push(`generos`)
                    params.push(item.generos);
                }
                if(item.estampas){
                    columns.push(`estampas`)
                    params.push(item.estampas);
                }
                if(item.tamanhos){
                    columns.push(`tamanhos`)
                    params.push(item.tamanhos);
                }
                if(item.materiais){
                    columns.push(`materiais`)
                    params.push(item.materiais);
                }
                if(item.quantidade){
                    columns.push(`quantidade`)
                    params.push(item.quantidade);
                }
                if(item.preco){
                    columns.push(`preco_unitario`)
                    params.push(item.preco);
                }
                if(item.quantidade && item.preco){
                    columns.push(`sub_total`)
                    params.push(Number(item.preco * item.quantidade));
                }

                const placeholders = columns.join(", ");
                const valuePlaceholders = columns.map(() => "? ").join(", ");

                await db.query(`INSERT INTO itens_venda (${placeholders}) values (${valuePlaceholders})`,params);
                
            }
        }
    return res.status(200).json(resultado.insertId);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possivel adicionar nova venda"});
    }})
     
app.post("/criar-pagamento-cartao",autenticarToken, async (req, res) => {
  const { valorTotal,paymentMethodId } = req.body;
  const userId = req.usuarioId;

    

  try {
    console.log(`paymentMethodId e`,paymentMethodId);
    const [resultado] = await db.query("SELECT stripe_customer_id from usuarios where id = ?",[userId]);
    const customerId = resultado[0].stripe_customer_id;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(valorTotal * 100), // centavos
      currency: "brl",
      customer:customerId,
      payment_method: paymentMethodId,
      off_session:true,
      confirm:true
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});
    

app.post("/criar-boleto", async (req, res) => {
  const { valorTotal, nome, email } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(valorTotal * 100),
      currency: "brl",
      payment_method_types: ["boleto"],
    });

    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method_data: {
          type: "boleto",
          boleto:{
            tax_id:"000.000.000-00"
          },
          billing_details: {
            name: nome,
            email: email,
            address:{
                line1:"Rua exemplo, 123",
                city:"Sao Paulo",
                state:"SP",
                postal_code:"01000-000",
                country:"BR"
            }
          },
        },
      }
    );

    const boletoUrl = confirmedPaymentIntent.next_action?.boleto_display_details?.hosted_voucher_url;
    const vencimento = confirmedPaymentIntent.next_action?.boleto_display_details?.expires_at;

    res.json({
      boletoUrl,
      vencimento,
      clientSecret:confirmedPaymentIntent.client_secret
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao gerar boleto", detalhes: err.message });
  }
});


app.post("/criar-costumer",autenticarToken, async (req,res) => {
    
    const {nome,email,idUsuario} = req.body;
    try{
        const customer = await stripe.customers.create({
            name:nome,
            email:email,
        })
        await db.query("UPDATE usuarios set stripe_customer_id = ? where id = ?",[customer.id,idUsuario]);
        

        res.status(200).json({customerId:customer.id});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possivel criar o customer"})
    }
})


app.get(`/listar-cartoes-stripe`,autenticarToken,async (req,res) => {
    const userId = req.usuarioId;

    try{
        const [resultado] = await db.query("SELECT stripe_customer_id from usuarios where id = ?",[userId]);
        const customerId = resultado[0].stripe_customer_id;

        const paymentMethods = await stripe.paymentMethods.list({
            customer:customerId,
            type:"card"
        });

        const fingerPrintsSet = new Set();
        const cartoesUnicos = [];

        for (const metodo of paymentMethods.data){
            const fingerPrint = metodo.card.fingerprint;
            if(!fingerPrintsSet.has(fingerPrint)){
                fingerPrintsSet.add(fingerPrint);
                cartoesUnicos.push(metodo);
            }
        }

        return res.status(200).json(cartoesUnicos);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possivel listar os cartões"});
    }
})

app.post("/salvar-cartao-stripe",autenticarToken, async(req,res) => {
    const userId = req.usuarioId;
    
    try{
        const [resultado] = await db.query("SELECT stripe_customer_id from usuarios where id = ?",[userId]);
        console.log(userId);
        console.log(resultado[0].stripe_customer_id);
        const customerId = resultado[0].stripe_customer_id;

        const setupIntent = await stripe.setupIntents.create({
            customer:customerId,
            usage:"off_session"
        })
        
    return res.status(200).json({clientSecret:setupIntent.client_secret});
    }
        catch(err){
            console.log(err);
            return res.status(500).json({message:"Não foi possivel salvar o cartão"});
        }
})

app.post("/salvar-cartao-id",autenticarToken, async(req,res) => {
    const userId = req.usuarioId;

    const {paymentMethodId,nomeTitularCartao} = req.body;

    
    try{
        const [resultado] = await db.query("SELECT stripe_customer_id from usuarios where id = ?",[userId]);
        const customerId = resultado[0].stripe_customer_id;


        await stripe.paymentMethods.attach(paymentMethodId,{customer:customerId})

        await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const { brand, last4, exp_month, exp_year } = paymentMethod.card;

    const bandeira = brand;
    const numeroMascaradoCartao = `**** **** **** ${last4}`;
    const dataExpiracao = `${String(exp_month).padStart(2, "0")}/${exp_year}`;

    // Salvar no banco
    await db.query(
      `INSERT INTO cartoes_salvos 
        (numero_mascarado, id_usuario, nome_titular, bandeira, data_expiracao, stripe_payment_method_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [
        numeroMascaradoCartao,
        userId,
        nomeTitularCartao,
        bandeira,
        dataExpiracao,
        paymentMethodId,
      ]
    );

     return res.status(200).json({message:"Cartão salvo com sucesso"})
        
}

    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possivel salvar o cartão"});
    }
})

app.get("/carregar-vendas", autenticarToken,async (req,res) => {
    const userId = req.usuarioId;
    try{
        
        
        const [itensVenda] = await db.query("SELECT *,(SELECT i.url FROM imagens_produto i WHERE i.produto_id = p.id LIMIT 1) AS url from itens_venda iv left join vendas v on id_venda = v.id left join produtos p on p.id = iv.produto_id where v.id_vendedor = ?",[userId]);
        
        const vendasAgrupadas = {};

        for(const row of itensVenda){
            const idVenda = row.id_venda;
            if(!vendasAgrupadas[idVenda]){
                vendasAgrupadas[idVenda]={
                    venda:{
                        id:row.id_venda,
                        total:row.total,
                        metodo_pagamento:row.metodo_pagamento,
                        data_venda:row.data_venda,
                        status_venda:row.status_venda,
                        endereco_logradouro:row.endereco_logradouro,
                        endereco_cidade:row.endereco_cidade,
                        endereco_numero:row.endereco_numero,
                        endereco_complemento:row.endereco_complemento,
                        endereco_estado:row.endereco_estado,
                        parcelas:row.parcelas,
                        valor_parcelas:row.valor_parcelas,
                        preco_frete:row.preco_frete,
                        pedido_id:row.pedido_id,
                        id_comprador:row.id_comprador,
                        id_vendedor:row.id_vendedor
                    },
                    itens:[]
                }
                        }
                vendasAgrupadas[idVenda].itens.push({
                    url:row.url,
                    nome:row.nome,
                    produto_id:row.produto_id,
                    quantidade:row.quantidade,
                    preco_unitario:row.preco_unitario,
                    sub_total:row.preco_total,
                    cor_nome:row.cor_nome,
                    voltagem:row.voltagem,
                    dimensoes:row.dimensoes,
                    pesos:row.pesos,
                    generos:row.generos,
                    estampas:row.estampas,
                    tamanhos:row.tamanhos,
                    materiais:row.materiais,
                })

        }

        const resultadoFinal = Object.values(vendasAgrupadas);
        
        
        return res.status(200).json(resultadoFinal);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possível carregar as vendas"});
    }
})


app.post("/confirmar-pagamento-boleto/:idPagamento", async (req,res) => {
    
    const {idPagamento} = req.params;
    try{
        await db.query("UPDATE vendas set status_venda = 'pago' where id = ?",[idPagamento]);
        return res.status(200).json({message:"O pagamento foi atualizado com sucesso"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possivel confirmar o pagamento"});
    }
})

app.listen(port, () => {console.log("servidor rodando na porta " + `${port}`)});