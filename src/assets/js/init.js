const uiInits = {
	init: function () {
		this.browserCheck();
		this.vendorLoader();
		this.fancy()
	},

	browserCheck: function () {
		// проверка браузера
		const userAgent = navigator.userAgent;
		if (userAgent.indexOf("Firefox") > -1) {
			// "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
			document.querySelector('body').classList.add('browser-mozzila');
		} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
			//"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
			document.querySelector('body').classList.add('browser-opera');
		} else if (userAgent.indexOf("Trident") > -1) {
			// "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
			document.querySelector('body').classList.add('browser-ie');
		} else if (userAgent.indexOf("Edge") > -1) {
			// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
			document.querySelector('body').classList.add('browser-edge');
		} else if (userAgent.indexOf("Chrome") > -1) {
			// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
			document.querySelector('body').classList.add('browser-chrome');
		} else if (userAgent.indexOf("Safari") > -1) {
			// "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
			document.querySelector('body').classList.add('browser-safari');
		}
		// проверка на МАС платформу
		if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
			document.querySelector('body').classList.add('platform-mac');
		}
	},
	vendorLoader: function () {

		const vendorloadStatus = {};

		window.vendorLoadStatus = vendorloadStatus;

		window.vendorLoader = function (args = {}) {
			if (!args.name) {
				console.warn('vendorLoader: You must pass the name!');
				return;
			}
			if (!args.path) {
				console.warn('vendorLoader: You must pass the path!');
				return;
			}

			!window.vendor && (window.vendor = {});
			!window.SITE_TEMPLATE_PATH && (window.SITE_TEMPLATE_PATH = '/');

			window.vendor[args.name] = {};
			window.vendor[args.name].load = {};
			window.vendor[args.name].load.timeout;
			/*if (!vendorloadStatus[args.name]) {
				vendorloadStatus[args.name] = {};
				vendorloadStatus[args.name].load = {};
				vendorloadStatus[args.name].load.timeout = {};
				vendorloadStatus[args.name].load.status = false
			}
			vendorloadStatus[args.name].load.loading = function () {
				if (!vendorloadStatus[args.name].load.status) {
					vendorloadStatus[args.name].load.status = true
					clearTimeout(vendorloadStatus[args.name].load.timeout);
					$(document).off('scroll.vendor-' + args.name);
					$(document).off('click.vendor-' + args.name);
					$(document).off('mouseover.vendor-' + args.name);
					$.getScript((!args.http ? window.SITE_TEMPLATE_PATH : '') + args.path, args.callback || function () { });
				}

			};

			if (args.event.scroll) {
				$(document).on('scroll.vendor-' + args.name, function () {
					vendorloadStatus[args.name].load.loading();
				});
			}

			if (args.event.click) {
				$(document).on('click.vendor-' + args.name, function () {
					vendorloadStatus[args.name].load.loading();
				});
			}

			if (args.event.mouseover) {
				$(document).on('mouseover.vendor-' + args.name, args.event.mouseover.trigger, function () {
					vendorloadStatus[args.name].load.loading();
				});
			}

			if (args.event.timeout) {
				vendorloadStatus[args.name].load.timeout = setTimeout(function () {
					vendorloadStatus[args.name].load.loading();
				}, args.timeout || 3000)
			}*/
		}
	},
	fancy: function (){
		window.addEventListener('alpine:init', function () {

			Alpine.data('videos', () => ({
				options: {
					rootMargin: '100px',
					threshold: 0,
				},
				ready: false,
				videos: [],
				fancybox: null,

				init() {
					this.videos = [...this.$root.querySelectorAll('[data-video-index]')]
					this.checkUrl()
					this.sliders()
				},

				sliders(){
					// const sliders = document.querySelectorAll('.js-splide-video')
					const sliders = document.querySelectorAll('.js-imgs')


					const config = {
						root: null, // Sets the framing element to the viewport
						rootMargin: "200px",
						threshold: 0.5
					}


					const sliderObserver = new IntersectionObserver((entries, observer) =>{
						entries.forEach(el=>{
							if(el.isIntersecting){
								if(el.target.classList.contains('inited')) {
									return
								}

								const slides = el.target.querySelectorAll('img');
								let currentSlide = 0;

								function nextSlide() {
									// Скрываем текущий слайд
									slides[currentSlide].classList.remove('active');

									// Переходим к следующему слайду
									currentSlide = (currentSlide + 1) % slides.length;

									// Показываем новый слайд
									slides[currentSlide].classList.add('active');
								}

								// Запускаем автоматическую смену слайдов каждые 4 секунды
								setInterval(nextSlide, 4000);

								el.target.classList.add('inited');

							}
						}, config)
					})


					sliders.forEach(el=>{
						sliderObserver.observe(el)
					})




				},

				playVideo(index){
					const video = this.videos[index]
					if(!video) return


					new Fancybox([
						{src: video.dataset.video}
					], {
						dragToClose: false,
						Toolbar: true,
						closeButton: 'top',

					})

				},


				checkUrl(){
					const params = new URLSearchParams(window.location.search)
					const index = params.get("video")
					if(index){
						this.$nextTick(()=>{
							this.playVideo(index-1)
							window.history.pushState({}, '', window.location.pathname)
						})

					}


				}


			}))

		})

	},

};

export default uiInits
