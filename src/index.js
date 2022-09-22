import './css/styles.css';
import './css/country.scss';
import {
  fetchCountries,
  parseCountries,
  parseSingleCountry,
} from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const options = {
  position: 'center-top',
  fontSize: '20px',
  width: 'fit-content',
};
const debounced = debounce(getCountries, DEBOUNCE_DELAY);
const listElement = document.querySelector('.country-list');
const infoWrapper = document.querySelector('.country-info');
searchInput.addEventListener('input', debounced);
async function getCountries(e) {
  listElement.innerHTML = '';
  infoWrapper.innerHTML = '';
  const name = e.target.value.trim();
  if (!name) return;
  const countries = await fetchCountries(name);
  switch (true) {
    case !countries:
      Notify.failure('Oops, there is no country with that name', options);
      break;
    case countries.length > 10:
      Notify.info(
        'Too many matches found. Please enter a more specific name.',
        options
      );

      break;
    case countries.length === 1:
      const parsedCountry = parseSingleCountry(countries[0]);

      infoWrapper.insertAdjacentHTML('afterbegin', parsedCountry);

      break;
    default:
      listElement.insertAdjacentHTML('afterbegin', parseCountries(countries));
      break;
  }
}
