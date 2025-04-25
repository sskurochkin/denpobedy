window.addEventListener('load', function (event) {





})

window.reinit.fancyProduct = () => {	
    document.querySelectorAll('[data-fancy]').forEach((el) => {
        let gallery = []
        let source = el.getAttribute('data-fancy')
        source = JSON.parse(source)
        source.forEach((el) => {
            gallery.push({
                src: el.src,
                thumb: el.src,
            })
        })


        el.querySelectorAll('[data-fancy-click]').forEach((x, index) => {

            x.addEventListener('click', (ev) => {
		
                new Fancybox(gallery, {
                    dragToClose: false,
                    Toolbar: false,
                    startIndex: index,
                    closeButton: 'top',
                    Thumbs: {
                        type: 'classic',
                        Carousel: {
                            axis: 'x',
                            slidesPerPage: 1,
                            Navigation: true,
                            center: true,
                            fill: true,
                            dragFree: true,

                            breakpoints: {
                                '(min-width: 640px)': {
                                    axis: 'y',
                                },
                            },
                        },
                    },
                    // Thumbs:false,
                    Image: {
                        zoom: false,
                    },
                })
            })
        })
    })
}
