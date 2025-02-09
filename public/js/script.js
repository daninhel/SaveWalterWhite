async function atualizarContador() {
    const contadorElement = document.getElementById('contador');
    if (!contadorElement) {
        console.error('Elemento contador não encontrado');
        return;
    }

    try {
        console.log('Iniciando requisição para a API...');
        // Usa a URL completa em produção ou relativa em desenvolvimento
        const apiUrl = window.location.hostname.includes('vercel.app') 
            ? `${window.location.origin}/api` 
            : '/api';
            
        console.log('Fazendo requisição para:', apiUrl);
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta da API:', data);
        
        if (data && typeof data.visitas === 'number') {
            contadorElement.textContent = data.visitas.toLocaleString();
        } else {
            throw new Error('Formato de resposta inválido');
        }
    } catch (error) {
        console.error('Erro ao buscar contador:', error);
        contadorElement.textContent = 'Erro ao carregar';
    }
}

// Tenta atualizar assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', atualizarContador);

// Tenta novamente após 2 segundos (caso a primeira tentativa falhe)
setTimeout(atualizarContador, 2000);
