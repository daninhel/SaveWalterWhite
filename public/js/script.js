document.addEventListener('DOMContentLoaded', async () => {
    const contadorElement = document.getElementById('contador');
    
    try {
        const response = await fetch('/api');
        const data = await response.json();
        contadorElement.textContent = data.visitas;
    } catch (error) {
        console.error('Erro ao buscar contador:', error);
        contadorElement.textContent = 'Erro ao carregar';
    }
});
