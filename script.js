document.getElementById('search-btn').addEventListener('click', async function() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const resultDiv = document.getElementById('result');

    if (!searchValue) {
        resultDiv.innerHTML = '<p>Por favor, ingresa un nombre de Pokémon.</p>';
        return;
    }

    try {
        // Obtener datos del Pokémon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`);
        if (!response.ok) throw new Error('Pokémon no encontrado');
        
        const data = await response.json();

        // Obtener la especie para las evoluciones
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        // Obtener las evoluciones
        const evolutions = await getEvolutions(speciesData.evolution_chain.url);

        // Mostrar información
        resultDiv.innerHTML = `
            <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p>Altura: ${data.height}</p>
            <p>Peso: ${data.weight}</p>
            <p>Poder: ${data.base_experience}</p>
            <p>Especie: ${speciesData.name.charAt(0).toUpperCase() + speciesData.name.slice(1)}</p>
            <h3>Evoluciones:</h3>
            <div id="evolutions">${evolutions}</div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p>${error.message}</p>`;
    }
});

// Función para obtener las evoluciones
async function getEvolutions(chainUrl) {
    const response = await fetch(chainUrl);
    const data = await response.json();

    let evolutionsHtml = '';
    let current = data.chain;

    while (current) {
        evolutionsHtml += `
            <div style="display: inline-block; margin: 10px;">
                <img src="https://pokeapi.co/media/sprites/pokemon/${current.species.url.split('/')[6]}.png" alt="${current.species.name}" style="width: 100px;">
                <p>${current.species.name.charAt(0).toUpperCase() + current.species.name.slice(1)}</p>
            </div>
        `;
        current = current.evolves_to[0]; // Solo toma la primera evolución
    }

    return evolutionsHtml;
}
