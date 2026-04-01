const API_URL = "https://script.google.com/macros/s/AKfycby4DuNs37fn8k990Vt4iQyYny7R8KtGKOZVkAGk6-shwQh8sJd50JvbtsAqjzcKiRk/exec";

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

function gerarZPL(nome,empresa,setor,id,inicio,fim){

    let tamanho = document.getElementById("tamanhoEtiqueta").value;
    let dataInicio = formatarData(inicio);
    let dataFim = formatarData(fim);

    let dataVisita = dataInicio === dataFim ? dataInicio : `${dataInicio} → ${dataFim}`;

    if(tamanho === "5x3"){

        return `
        ^XA
        ^CI28
        ^PW400
        ^LL240

        ^FO30,30^A0N,25,25^FDVISITANTE^FS
        ^FO30,70^A0N,30,30^FD${nome}^FS
        ^FO30,130^A0N,20,20^FD${dataVisita}^FS
        ^FO30,150^A0N,20,20^FD${empresa}^FS
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
        ^FO40,200^A0N,30,30^FD${empresa}^FS
        ^FO40,240^A0N,25,25^FD${dataVisita}^FS
        ^FO40,280^A0N,30,30^FD${id}^FS

        ^XZ
        `;

    }

    if(tamanho === "8x3"){

        return `
        ^XA
        ^CI28
        ^PW640
        ^LL240

        ^FO30,20^A0N,25,25^FDVISITANTE^FS
        ^FO30,60^A0N,35,35^FD${nome}^FS
        ^FO30,110^A0N,25,25^FD${empresa}^FS
        ^FO30,150^A0N,20,20^FD${dataVisita}^FS
        ^FO30,190^A0N,20,20^FD${id}^FS

        ^XZ
        `;

    }

}

function chaveImpressao(id,data){

    return "impresso_"+id+"_"+data;

}

function imprimir(nome,empresa,setor,id,inicio,fim,botao){

    let data = document.getElementById("dataFiltro").value;
    let chave = chaveImpressao(id,data);

    if(localStorage.getItem(chave)){

        let confirmar = confirm("Este crachá já foi impresso hoje. Deseja reimprimir?");

        if(!confirmar)
            return;

    }

    BrowserPrint.getDefaultDevice("printer", function(device){

    let zpl = gerarZPL(nome,empresa,setor,id,inicio,fim);

    device.send(zpl);

    localStorage.setItem(chave,true);

    botao.innerText="Reimprimir";
    botao.className="reimprimir";

    });

}

async function carregar(){

    let dataFiltro = document.getElementById("dataFiltro").value;

    let resposta = await fetch(API_URL + "?data=" + dataFiltro);

    let dados = await resposta.json();

    let tabela = document.getElementById("tabela");

    tabela.innerHTML="";

    dados.forEach((linha,index)=>{

    let nome = linha.nome;
    let tipo = linha.tipo;
    let setor = linha.setor;
    let empresa = linha.estudo;
    let inicio = linha.inicio;
    let fim = linha.fim;
    let id = linha.id;
        // if(!dentroDoPeriodo(dataFiltro,inicio,fim)) Filtra apenas os resultados do dia
        //     return;

    let dataInicio = formatarData(inicio);
    let dataFim = formatarData(fim);

    let periodo = dataInicio === dataFim ? dataInicio : `${dataInicio} → ${dataFim}`;

    let chave = chaveImpressao(id,dataFiltro);

    let jaImpresso = localStorage.getItem(chave);

    let textoBotao = jaImpresso ? "Reimprimir" : "Imprimir";
    let classe = jaImpresso ? "reimprimir" : "imprimir";

    let tr = document.createElement("tr");

    tr.innerHTML=`
    <td>${nome}</td>
    <td>${tipo}</td>
    <td>${empresa}</td>
    <td>${setor}</td>
    <td>${periodo}</td>
    <td>
    <button class="${classe}" onclick="imprimir('${nome}','${tipo}','${empresa}','${id}','${inicio}','${fim}',this)">
    ${textoBotao}
    </button>
    </td>
    `;

    tabela.appendChild(tr);

    });

}

const selectTamanho = document.getElementById("tamanhoEtiqueta");

selectTamanho.addEventListener("change", function(){
  localStorage.setItem("tamanhoEtiqueta", this.value);
});

const tamanhoSalvo = localStorage.getItem("tamanhoEtiqueta");

if(tamanhoSalvo){
  document.getElementById("tamanhoEtiqueta").value = tamanhoSalvo;
}

document.getElementById("dataFiltro").value = dataHoje();

carregar();
