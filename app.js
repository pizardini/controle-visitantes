const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNtcjxYDCz_7brdXFebxJ2gzM3AfN47o7pz1zNUDzajhKUcsA_wX6ZCurO9dffDkuuzV87msFOYHES/pub?gid=1855995648&single=true&output=csv";

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

function dataNumero(data){

let partes = data.split("/");

let dia = partes[0].padStart(2,"0");
let mes = partes[1].padStart(2,"0");
let ano = partes[2];

return Number(`${ano}${mes}${dia}`);

}

function dentroDoPeriodo(dataFiltro,inicio,fim){

let data = Number(dataFiltro.replaceAll("-",""));

let inicioNum = dataNumero(inicio);
let fimNum = dataNumero(fim);

return data >= inicioNum && data <= fimNum;

}

function gerarZPL(nome,empresa,estudo,id){

return `
^XA
^CI28
^PW400
^LL240

^FO30,30^A0N,25,25^FDVISITANTE^FS
^FO30,70^A0N,30,30^FD${nome}^FS
^FO30,120^A0N,20,20^FD${empresa}^FS
^FO30,150^A0N,20,20^FD${estudo}^FS
^FO30,190^A0N,15,15^FD${id}^FS

^XZ
`;

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

let resposta = await fetch(CSV_URL);

let texto = await resposta.text();

let dados = Papa.parse(texto,{
header:true,
skipEmptyLines:true
}).data;

let tabela = document.getElementById("tabela");

tabela.innerHTML="";

dados.forEach((linha,index)=>{

let nome = linha["Nome do visitante"];
let tipo = linha["Tipo de visita"];
let estudo = linha["Estudo / Protocolo"];

let inicio = linha["Data de início da visita"];
let fim = linha["Data de fim da visita"];

let id = linha["ID_VISITA"] || ("VIS-"+index);

if(!dentroDoPeriodo(dataFiltro,inicio,fim)) return;

let periodo = `${inicio} → ${fim}`;

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