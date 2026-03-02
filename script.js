// Required: Use async/await OR .then() for API calls
// Required: Use try/catch OR .catch() for error handling

async function searchCountry(countryName) {
    const spinner = document.getElementById('loading-spinner');

    try {
        spinner.classList.remove("hidden");

        document.getElementById('country-info').innerHTML = '';
        document.getElementById('bordering-countries').innerHTML = '';
        document.getElementById('error-message').innerHTML = '';

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if (!response.ok) {
            throw new Error('Country not found');
        }

        const countryData = await response.json();
        const country = countryData[0];

        document.getElementById('country-info').innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        if (country.borders) {
            const borderingCountries = [];

            for (const border of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);

                if (borderResponse.ok) {
                    const borderData = await borderResponse.json();
                    borderingCountries.push({
                        name: borderData[0].name.common,
                        flag: borderData[0].flags.svg
                    });
                }
            }

            document.getElementById('bordering-countries').innerHTML = `
                <h3>Bordering Countries:</h3>
                <div>
                    ${borderingCountries.map(border => `
                        <div style="margin-bottom: 10px;">
                            <img src="${border.flag}" alt="${border.name} flag" width="60">
                            <p>${border.name}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            document.getElementById('bordering-countries').innerHTML = `<p>No bordering countries.</p>`;
        }

    } catch (error) {
        document.getElementById('error-message').innerHTML =
            `<p class="error">ERROR: ${error.message}</p>`;
    } finally {
        spinner.classList.add("hidden");
    }
}
