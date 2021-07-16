const promenades = document.querySelector('.swiper-wrapper');

fetch('./config.json')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    for (const promenade in data) {
        console.log(promenade);

        Papa.parse(data[promenade], {
            download: true,
            header: true,
            complete: function (results) {
                // console.log(convertToJson(results.data));
                setPromenades(convertToJson(results.data), promenade);
            }
        });
    }

    setTimeout(() => {
        const swiper = new Swiper('.swiper-container', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            slidesPerView: 'auto',
            centeredSlides: true,
            grabCursur: true,
            // autoHeight: true,
        });
    }, 1000)

});