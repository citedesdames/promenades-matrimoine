const promenades = document.querySelector('.swiper-wrapper')

fetch('./config-save.json')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
      console.log(data)
    setPromenades(data);

    const swiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        grabCursur: true,
        // autoHeight: true,
    });
});