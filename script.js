// Search function
async function searchCountry(countryName) {
    const spinner = document.getElementById('loading-spinner');
    const countryInfo = document.getElementById('country-info');
    const borderingCountriesSection = document.getElementById('bordering-countries');
    const errorMessage = document.getElementById('error-message');

    try {
        // Show spinner
        spinner.classList.remove("hidden");

        // Clear previous content
        countryInfo.innerHTML = '';
        borderingCountriesSection.innerHTML = '';
        errorMessage.innerHTML = '';

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if (!response.ok) {
            throw new Error('Country not found');
        }

        const countryData = await response.json();
        const country = countryData[0];

        // Display main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" 
                 alt="${country.name.common} flag" 
                 width="150">
        `;

        // Fetch bordering countries (optimized)
        if (country.borders && country.borders.length > 0) {

            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    .then(res => {
                        if (!res.ok) throw new Error("Border fetch failed");
                        return res.json();
                    })
            );

            const borderResults = await Promise.all(borderPromises);

            const borderingCountries = borderResults.map(data => ({
                name: data[0].name.common,
                flag: data[0].flags.svg
            }));

            borderingCountriesSection.innerHTML = `
                <h3>Bordering Countries:</h3>
                <div>
                    ${borderingCountries.map(border => `
                        <div style="margin-bottom: 10px;">
                            <img src="${border.flag}" 
                                 alt="${border.name} flag" 
                                 width="60">
                            <p>${border.name}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            borderingCountriesSection.innerHTML = `<p>No bordering countries.</p>`;
        }

    } catch (error) {
        errorMessage.innerHTML = `<p class="error">ERROR: ${error.message}</p>`;
    } finally {
        // Hide spinner
        spinner.classList.add("hidden");
    }
}

// ===============================
// Event Listeners
// ===============================

const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');

// Search button click
searchBtn.addEventListener('click', () => {
    const countryName = countryInput.value.trim();
    if (countryName) {
        searchCountry(countryName);
        countryInput.value = '';
    }
});

// Enter key press
countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const countryName = countryInput.value.trim();
        if (countryName) {
            searchCountry(countryName);
            countryInput.value = '';
        }
    }
});
