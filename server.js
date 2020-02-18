const express = require('express');
const server = express();

//configurando a conexão com o Banco de Dados
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: 'docker',
    host: 'localhost',
    port: 5432,
    database: 'doe_maratonaDev3'
});



//configurando o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//Habilitar body do form
server.use(express.urlencoded({ extended: true }));

//configurando o Nunjucks ( template engine )
const nunjucks = require('nunjucks');
nunjucks.configure("./", {
    express: server,
    noCache: true,
});

//lista de doadores
const donors = [
    {
        name: "Diego Fernandes",
        blood: "AB+"
    },
    {
        name: "Cleiton Souza",
        blood: "B+"
    },
    {
        name: "Robson Marques",
        blood: "A+"
    },
    {
        name: "Mayk Brito",
        blood: "O+"
    },
]

server.get('/', (req, res) => {
    db.query("SELECT * from donors", function(err, result){
        if(err) return res.send("Erro de banco de dados");
        const donors = result.rows;
        return res.render("index.html", { donors });
    })
})

server.post('/', (req, res) => {
    //pega dados do formulário
    const { name, email, blood } = req.body;

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }

    //colocando valores dentro do Banco de dados
    const query =
        `INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    const values = [name, email, blood];

    db.query(query, values, function (err) {
        //fluxo de erro
        if (err) return res.send("erro no bando de dados");
        //fluxo ideal
        return res.redirect('/');
    });

})

server.listen(3333, () => {
    console.log('O servidor está rodando')
})