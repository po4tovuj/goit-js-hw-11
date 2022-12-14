import { getImages } from './js/imagesApi';
import { Notify } from 'notiflix';
import { parsePhoto } from './js/parsePhotoTotemplate';
import SimpleLightbox from 'simplelightbox';
import debounce from 'lodash.debounce';

let page = 1;
let per_page = 40;

let totalPages = 1;
let searchQuery = '';
const formElement = document.querySelector('#search-form');
const galleryWrapper = document.querySelector('.gallery');
formElement.addEventListener('submit', handleSubmit);

const options = {
  position: 'left-top',
  fontSize: '20px',
  width: 'fit-content',
};

const getLastElement = () =>
  document.querySelector('.gallery > .photo-card:last-child');

let lightBox = new SimpleLightbox('.gallery div', {
  sourceAttr: 'data-large',
});

const infScrollCallback = entries => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  // if we reach max results
  if (page === totalPages) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      options
    );
    infScrollObserver.disconnect();
    return;
  }
  page++;

  loadMore();
};
const infScrollObserver = new IntersectionObserver(infScrollCallback, {});

async function handleSubmit(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.searchQuery.value.trim() || '';
  infScrollObserver.disconnect();
  // there are no clear requirments about to should happen if we click submit button with same query, so lets do not search if the query is the same as it was.
  if (query === searchQuery) {
    return;
  }
  searchQuery = query;
  page = 1;
  galleryWrapper.innerHTML = '';
  const photoList = await getImages({ query, page, per_page })
    .then(({ hits, totalHits }) => {
      if (!hits.length) {
        throw new Error(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      }
      totalPages = Math.ceil(totalHits / per_page);

      Notify.success(`Hooray! We found ${totalHits} images.`, options);
      return hits;
    })
    .catch(err => {
      const message = err.message;
      Notify.failure(message, options);
      return [];
    });
  const photoListParsed = parsePhoto(photoList);

  galleryWrapper.insertAdjacentHTML('afterbegin', photoListParsed);
  if (totalPages > 1) {
    infScrollObserver.observe(getLastElement());
  }
}

const loadMore = () => {
  infScrollObserver.disconnect();
  return getImages({
    page,
    query: searchQuery,
    per_page,
  })
    .then(({ hits }) => {
      const photoListParsed = parsePhoto(hits);
      galleryWrapper.insertAdjacentHTML('beforeEnd', photoListParsed);
      lightBox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      galleryWrapper.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      lightBox.refresh();
      infScrollObserver.observe(getLastElement());
    })
    .catch(err => {
      const message = err.message;
      Notify.failure(message, options);
      reject();
    });
};

// const debounced = debounce(async () => {
//   const currentScrollPosition =
//     Math.ceil(galleryWrapper.scrollTop) + galleryWrapper.clientHeight;
//   const maxScrollHeight = galleryWrapper.scrollHeight;
//   // early exit
//   if (
//     !(currentScrollPosition >= maxScrollHeight) ||
//     (page === 1 && page === totalPages)
//   ) {
//     // go next only if we are on the very bottom
//     //no sense to show something if its only one page
//     return;
//   }

//   // if we reach max results
//   if (page === totalPages) {
//     Notify.failure(
//       "We're sorry, but you've reached the end of search results.",
//       options
//     );
//     return;
//   }

//   {
//     page++;
//     const photoList = await getImages({
//       page,
//       query: searchQuery,
//       per_page,
//     })
//       .then(({hits}) => {
//         const photoListParsed = parsePhoto(hits);
//         galleryWrapper.insertAdjacentHTML('beforeEnd', photoListParsed);
//         lightBox.refresh();
//         const { height: cardHeight } = document
//           .querySelector('.gallery')
//           .firstElementChild.getBoundingClientRect();
//         galleryWrapper.scrollBy({
//           top: cardHeight * 2,
//           behavior: 'smooth',
//         });
//         return photoListParsed;
//       })
//       .catch(err => {
//         const message = err.message;
//         return Notify.failure(message, options);
//       });
//   }
// }, 300);
// galleryWrapper.addEventListener('scroll', debounced);
