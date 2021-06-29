const promenades = document.querySelector('.swiper-wrapper')

fetch('./config.json')
  .then((response) => {
    console.log('okay');
    return response.json()
  })
  .then((data) => {
    console.log('okay2');
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