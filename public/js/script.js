async function atualizarContador() {
  try {
    const response = await fetch('/api/contador'); // Ajuste se necessário para URL completa
    if (!response.ok) throw new Error('Erro na requisição');

    const data = await response.json();
    document.getElementById('contador').textContent = data.visitas;
  } catch (error) {
    console.error('Erro ao atualizar o contador:', error);
  }
}

// Chama a função ao carregar a página
window.addEventListener('load', atualizarContador);
