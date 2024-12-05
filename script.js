function atualizarContador() {
    let contador = localStorage.getItem('contadorVisitas'); // Verifica se o contador já existe no localStorage

    // Se não existir, inicializa com 0
    if (contador === null) {
        contador = 0;
    } else {
        contador = parseInt(contador)// Converte o valor para número
    }
    
    contador += 1// Incrementa o contador

    localStorage.setItem('contadorVisitas', contador)// Atualiza o valor no localStorage

    document.getElementById('contador').textContent = contador // Atualiza o contador na página
}

window.onload = atualizarContador // Chama a função ao carregar a página
