async function atualizarContador() {
    const contadorElement = document.getElementById('contador');
    if (!contadorElement) {
        console.error('Elemento contador não encontrado');
        return;
    }

    try {
        const response = await fetch('/api');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && typeof data.visitas === 'number') {
            contadorElement.textContent = data.visitas.toLocaleString();
        } else {
            throw new Error('Formato de resposta inválido');
        }
    } catch (error) {
        console.error('Erro ao atualizar contador:', error);
        contadorElement.textContent = '';
    }
}

// Atualiza o contador quando a página carrega
document.addEventListener('DOMContentLoaded', atualizarContador);
