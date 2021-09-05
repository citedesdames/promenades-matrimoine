const promenades = document.querySelector('.swiper-wrapper');
let swiper ;

    function loadNextStroll(data, strollList){
      if(strollList.length>0){
        let promenade = strollList.pop();
        Papa.parse(data[promenade], {
            download: true,
            header: true,
            complete: function (results) {
                setPromenades(convertToJson(results.data), promenade);
                console.log("OK for " + promenade);
                loadNextStroll(data, strollList);
            }
        });
      } else {
        //All strolls are loaded
        swiper = new Swiper('.swiper-container', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            slidesPerView: 'auto',
            centeredSlides: true,
            grabCursur: true,
            // autoHeight: true,
        });
      }
    }
    
fetch('./config.json')
  .then((response) => {
     return response.json()
  })
  .then((data) => {
    // Build a list of all strolls to load one after each other
    let strollList = [];
    for (const promenade in data) {
       strollList.push(promenade);
    }
    // Load the first stroll of the list
    loadNextStroll(data, strollList);

});