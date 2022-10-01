export const parsePhoto = list => {
  return list
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card" data-large="${largeImageURL}">
  <img src="${webformatURL.trim()}" alt="${tags}" class="photo">
	<div class="info">
		<div class="info-item">
			<b class= "info-item__title">Likes</b>
			<p class="info-item__value">${likes}</p>
		</div>
		<div class="info-item">
			<b "info-item__title">Views</b>
			<p class="info-item__value">${views} </p>
		</div>
		<div class="info-item">
			<b "info-item__title">Comments</b>
			<p class="info-item__value">${comments}</p>
		</div>
		<div class="info-item">
		  <b "info-item__title">Downloads</b>
			<p class="info-item__value">${downloads}</p>
		</div> </div>
</div>`;
      }
    )
    .join('');
};
