async function atualizarContador() {
    const contadorElement = document.getElementById('contador');
    if (!contadorElement) return;

    try {
        const response = await fetch('/api');
        if (!response.ok) throw new Error('Erro ao buscar contador');
        
        const data = await response.json();
        if (data && typeof data.visitas === 'number') {
            contadorElement.textContent = data.visitas.toLocaleString();
        }
    } catch (error) {
        console.error('Erro:', error);
        contadorElement.textContent = 'Erro ao carregar';
    }
}

document.addEventListener('DOMContentLoaded', atualizarContador);
