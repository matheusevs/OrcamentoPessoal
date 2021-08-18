class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            // console.log(i, this[i])
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd{
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoiD(){
        let proximoId = localStorage.getItem('id') //null
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoiD()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        //arrat de despesas
        let despesas = Array()
        let id = localStorage.getItem('id')
        
        //recuperar todas as despesas cadastradas em localStorage
        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade de haver índices que foram pulados/removidos
            //nestes caso nos vamos pular esses índices
            if(despesa == null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if(despesa.validarDados()){
        bd.gravar(despesa)
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso.'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal_btn').className = 'btn btn-success'
        document.getElementById('modal_btn').innerHTML = 'Fechar'
        
        $('#modalRegistraDespesa').modal('show')

        limparCampos(ano, mes, dia, tipo, descricao, valor)
    }
    else{
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro.'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro no registro, verifique se todos os campos foram preenchidos corretamente.'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'

        $('#modalRegistraDespesa').modal('show')
        
    }
}

function limparCampos(ano, mes, dia, tipo, descricao, valor){
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''
}

function carregaListaDespesas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }
    
    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('lista_despesas')
    listaDespesas.innerHTML = ''

    //percorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d){
        //criando a linha(tr)
        let linha = listaDespesas.insertRow()

        //criar colunas(td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar o tipo
        switch(parseInt(d.tipo)){
            case 1: d.tipo = 'Alimentação'
            break;

            case 2: d.tipo = 'Educação'
            break

            case 3: d.tipo = 'Lazer'
            break

            case 4: d.tipo = 'Saúde'
            break

            case 5: d.tipo = 'Transporte'
            break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$${d.valor}`
        
        //criar botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            document.getElementById('modal_titulo').innerHTML = 'Tem certeza que deseja deletar?'
            document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
            document.getElementById('modal_conteudo').innerHTML = 'Ao deletar esse registro, não será possível a recuperação!'
            document.getElementById('modal_btn_cancelar').className = 'btn btn-danger'
            document.getElementById('modal_btn_confirmar').className = 'btn btn-success'
            document.getElementById('modal_btn_cancelar').innerHTML = 'Cancelar'
            document.getElementById('modal_btn_confirmar').innerHTML = 'Continuar'
            document.getElementById('modal_btn_cancelar').setAttribute('onclick', 'apagaDespesa(false, '+id+')')
            document.getElementById('modal_btn_confirmar').setAttribute('onclick', 'apagaDespesa(true, '+id+')')
            $('#modalApagaDespesa').modal('show')
        }
        linha.insertCell(4).append(btn)
    })
}

function apagaDespesa(confirm, id){
    if(confirm == true){
        bd.remover(id)
        window.location.reload()
        return
    }
}

function pesquisaDespesas(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}