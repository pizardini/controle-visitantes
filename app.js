const API_URL = "https://script.google.com/macros/s/AKfycby8V0pXIO2NVrisRSMON5VfaqYgnzz9VVD40fsy2g6f8MoqiKol-WFHpST35-DHh1fe/exec";

function dataHoje(){

let hoje = new Date();

return hoje.toISOString().split("T")[0];

}

function converterDataBR(data){

if(!data) return null;

let partes = data.split("/");

return new Date(
partes[2],
partes[1]-1,
partes[0]
);

}

function formatarData(dataISO){

let data = new Date(dataISO);

let dia = String(data.getDate()).padStart(2,"0");
let mes = String(data.getMonth()+1).padStart(2,"0");
let ano = data.getFullYear();

return `${dia}/${mes}`;

}

function dentroDoPeriodo(dataFiltro,inicio,fim){

let data = dataFiltro;
let dataInicio = inicio.substring(0,10);
let dataFim = fim.substring(0,10);

return data >= dataInicio && data <= dataFim;

}

function gerarZPL(nome,empresa,estudo,id){

let tamanho = document.getElementById("tamanhoEtiqueta").value;

if(tamanho === "5x3"){

return `
^XA
^CI28
^PW400
^LL240

^FO30,30^A0N,25,25^FDVISITANTE^FS
^FO30,70^A0N,30,30^FD${nome}^FS
^FO30,120^A0N,20,20^FD${empresa}^FS
^FO30,150^A0N,20,20^FD${estudo}^FS
^FO30,180^A0N,20,20^FD${id}^FS

^XZ
`;

}

if(tamanho === "9.5x4"){

return `
^XA
^CI28
^PW760
^LL320

^FO40,30^A0N,40,40^FDVISITANTE^FS
^FO40,100^A0N,50,50^FD${nome}^FS
^FO40,180^A0N,30,30^FD${empresa}^FS
^FO40,220^A0N,30,30^FD${estudo}^FS
^FO40,270^A0N,30,30^FD${id}^FS

^XZ
`;

}

}

function chaveImpressao(id,data){

return "impresso_"+id+"_"+data;

}

function imprimir(nome,empresa,estudo,id,botao){

let data = document.getElementById("dataFiltro").value;

let chave = chaveImpressao(id,data);

if(localStorage.getItem(chave)){

let confirmar = confirm("Este crachá já foi impresso hoje. Deseja reimprimir?");

if(!confirmar) return;

}

BrowserPrint.getDefaultDevice("printer", function(device){

let zpl = gerarZPL(nome,empresa,estudo,id);

device.send(zpl);

localStorage.setItem(chave,true);

botao.innerText="Reimprimir";
botao.className="reimprimir";

});

}

async function carregar(){

let dataFiltro = document.getElementById("dataFiltro").value;

let resposta = await fetch(API_URL);

let dados = await resposta.json();

let tabela = document.getElementById("tabela");

tabela.innerHTML="";

dados.forEach((linha,index)=>{

let nome = linha.nome;
let tipo = linha.tipo;
let estudo = linha.estudo;
let inicio = linha.inicio;
let fim = linha.fim;
let id = linha.id;
if(!dentroDoPeriodo(dataFiltro,inicio,fim)) return;

let periodo = `${formatarData(inicio)} → ${formatarData(fim)}`;

let chave = chaveImpressao(id,dataFiltro);

let jaImpresso = localStorage.getItem(chave);

let textoBotao = jaImpresso ? "Reimprimir" : "Imprimir";
let classe = jaImpresso ? "reimprimir" : "imprimir";

let tr = document.createElement("tr");

tr.innerHTML=`
<td>${nome}</td>
<td>${tipo}</td>
<td>${estudo}</td>
<td>${periodo}</td>
<td>
<button class="${classe}" onclick="imprimir('${nome}','${tipo}','${estudo}','${id}',this)">
${textoBotao}
</button>
</td>
`;

tabela.appendChild(tr);

});

}

document.getElementById("dataFiltro").value = dataHoje();

carregar();