export const fetchCountries = name => {
  const countries = fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      return response.json();
    })
    .then(result => {
      if (result.status === 404) {
        throw new Error();
      }
      return result;
    })
    .catch(err => null);

  return countries;
};
export const parseCountries = countries => {
  const countriesList = countries
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li class="country-list__item country"> <img src="${svg}" alt="${official} flag" width="40px" height="30px" class="country__flag"/> <p class="country__name">${official} </p>  </li>`
    )
    .join('');
  return countriesList;
};
export const parseSingleCountry = country => {
  const {
    name: { official },
    flags: { svg },
    capital,
    population,
    languages,
  } = country;
  const parsedLanguages = Object.values(languages).join(', ');
  const parsedCountry = `<h1 class="country-info__header">
	<img src="${svg}" alt="${official} flag" width="60px" height="40px" class="country__flag">
	<p class="country__name">${official}</p>
	</h1>
	<p> <span class="country-info__title"> Capital: </span> ${capital[0]} </p>
	<p> <span class="country-info__title"> Population: </span> ${population}</p>
	<p> <span class="country-info__title"> Languages: </span>${parsedLanguages}</p>`;
  return parsedCountry;
};
