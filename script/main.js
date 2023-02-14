
//header
let header__burger = document.querySelector('.header__burger');
let header_menu = document.querySelector('.header__menu');
let back = document.querySelector('body');
const headerLinks = document.querySelectorAll('.header__link')
let header__list = document.querySelector('.header__list');
const newNode = document.querySelector('.collection')
const catalogNode = document.getElementById('header')
const magazineNode = document.querySelector('.info__footer')
const zakazNode = document.querySelector('.video')
const scrollTocatalogLinks = document.querySelectorAll('.scroll__tocatalog')


header__burger.onclick = openHeaderMenu
header__list.onclick = closeHeaderMenu
function openHeaderMenu() {
	header__burger.classList.toggle('active');
    header_menu.classList.toggle('active');
    back.classList.toggle('lock');
}
function closeHeaderMenu() {
	header__list.classList.remove('active');
    back.classList.toggle('lock');
}

if(headerLinks.length > 0) {
	for (let i = 0; i < headerLinks.length; i++) {
		const link = headerLinks[i];
		link.onclick = function (e) {
			e.preventDefault()
			headerLinks.forEach(l => l.classList.remove('active'))
			link.classList.add('active')
			if(window.innerWidth < 767) {
				header__burger.classList.remove('active');
				header_menu.classList.remove('active');
				back.classList.remove('lock');
			}
			if(link.dataset.scroll === 'new') {
				scrollToBlock(newNode)
			} else if (link.dataset.scroll === 'catalog') {
				scrollToBlock(catalogNode)
			} else if(link.dataset.scroll === 'zakaz') {
				scrollToBlock(zakazNode)
			} else {
				scrollToBlock(magazineNode)
			}
		}
	}
}
const scrollToBlock = (block) => block.scrollIntoView({block: "start",inline: "nearest",behavior: "smooth"})
if(scrollTocatalogLinks.length > 0) {
	scrollTocatalogLinks.forEach(l => {
		l.addEventListener('click', (e) => {
			e.preventDefault()
			catalogNode.scrollIntoView({block: "start",inline: "nearest",behavior: "smooth"})
		})
	})
}









//перемещение блока из одного места в другое
function dynamicAdapt(type) {
	this.type = type;
}
dynamicAdapt.prototype.init = function () {
	const _this = this;
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	this.nodes = document.querySelectorAll("[data-da]");
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}
	this.arraySort(this.оbjects);
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

dynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};
dynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}
dynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}
dynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};
dynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}
				if (a.place === "first" || b.place === "last") {
					return -1;
				}
				if (a.place === "last" || b.place === "first") {
					return 1;
				}
				return a.place - b.place;
			}
			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}
				if (a.place === "first" || b.place === "last") {
					return 1;
				}
				if (a.place === "last" || b.place === "first") {
					return -1;
				}
				return b.place - a.place;
			}
			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};
const da = new DynamicAdapt("max");
da.init();








//modal
const popupLinks = document.querySelectorAll('.popup__link')
const body = document.querySelector('body')
const lockPadding = document.querySelectorAll('.lock-padding')
const popusCloseIcon = document.querySelectorAll('.close-popup')

let unlock = true;
const timeout = 800;
if(popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener('click', function(e) {
			let link = getLinkImagePopup(popupLink.childNodes)
            const popupName = popupLink.getAttribute('href').replace('#', '') 
            const currentPopup = document.getElementById(popupName)
            popupOpen(currentPopup, link)
            e.preventDefault()
        })
    }
}
if (popusCloseIcon.length > 0 ) {
    for (let index = 0; index < popusCloseIcon.length; index++) {
        const el = popusCloseIcon[index]
        el.addEventListener('click', function(e) {
            popupClose(el.closest('.popup'));
            e.preventDefault()
        })
    }
}
function popupOpen(currentPopup, link) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open')
        if(popupActive) popupClose(popupActive, false) 
		const popupImage = document.querySelector('.popup__image img')
		popupImage.setAttribute('src', link)
        currentPopup.classList.add('open')
        currentPopup.addEventListener('click', function(e) {
            if(!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'))
            }
        })
     }
}
function popupClose(popupActive) {
    if(unlock) popupActive.classList.remove('open'); 
}
document.addEventListener('keydown', function(e) {
   if (e.which === 27) {
       const popupActive = document.querySelector('.popup.open')
       popupClose(popupActive)
   }
})
const getLinkImagePopup = (childNodes) => Array.from(childNodes)[0].getAttribute('src')








//slider на мобилах
let slider = document.querySelector('.new__content')
let mySlider;
function mobileSlider() {
    if(window.innerWidth <= 767 && slider.dataset.mobile == 'false') {
       mySlider =  new Swiper(slider, {
        slidesPerView: 1.2,  
        watchOverflow: true,
        spaceBetween: 10,   
        loop: true,   
		autoplay: {    
			delay: 2000,   
			stopOnLastSlide: false, 
			disableOnInteraction: false
		},
        slideClass: 'card',
    })
        slider.dataset.mobile = 'true'
    }
    if(window.innerWidth > 767) {
        slider.dataset.mobile = 'false';
        if (slider.classList.contains('swiper-initialized')) {
            mySlider.destroy()
        }
     }
}
mobileSlider()
window.addEventListener('resize', () => mobileSlider())







const emailForm = document.querySelector('.info__email_form')
const headerSearchIcon = document.querySelector('.header__search a')
const searchBlock = document.querySelector('.search')
const closeSearchBodyIcon = document.querySelector('.search__body button')
const inputSearch = document.getElementById('search')
const searchResult = document.querySelector('.search__result')


let placeholder;
emailForm.email.addEventListener('focus', (e) => handlefocusInput(e, emailForm.email))
emailForm.email.addEventListener('blur', (e) => handleblurInput(e, emailForm.email))
emailForm.addEventListener('submit', submitForm)




function submitForm(event) {
	event.preventDefault()
	//дальнейшная логика отправки (в php)
	emailForm.reset()
}	
headerSearchIcon.addEventListener('click', activeSearchBlock)
closeSearchBodyIcon.addEventListener('click', closeSearchBlock)
inputSearch.addEventListener('input', handleChangeInput)
inputSearch.addEventListener('blur', (e) => handleblurInput(e, inputSearch))
inputSearch.addEventListener('focus', (e) => handlefocusInput(e, inputSearch))



function handlefocusInput(event, input) {
	placeholder = input.getAttribute('placeholder')
	input.setAttribute('placeholder', '')
}
function handleblurInput(event, input) {
	input.setAttribute('placeholder', placeholder)
}
function activeSearchBlock(event) {
	event.preventDefault()
	searchBlock.classList.add('active')
	document.body.style.overflow = 'hidden'
}
function closeSearchBlock(event) {
	event.preventDefault()
	document.body.style.overflow = 'auto'
	searchBlock.classList.remove('active')
}
function handleChangeInput(event) {
	const searchElements = document.querySelectorAll('.s')
	searchResult.innerHTML = '';
	let result = []
	for (let index = 0; index < searchElements.length; index++) {
		const brand = searchElements[index];
		if(brand.textContent.toLowerCase().includes(event.target.value.toLowerCase())) {
			result.push(brand.textContent)
		}
	}
	if(!event.target.value.length) return searchResult.append('Ничего не найдено')


	result.forEach(text => {
		let li = document.createElement('li')
		li.textContent = text
		li.addEventListener('click', goToCatalog)
		searchResult.append(li)
	})


	function goToCatalog(e) {
		inputSearch.value = ''
		searchResult.innerHTML = 'Ничего не найдено'
		closeSearchBlock(e)
		scrollToBlock(catalogNode)
	}
}



//показ всех карточек
const newBottomCards = document.querySelector('.new__bottom__cards')
const btnOpenNewBottomCards = document.querySelector('.cards_btn a')
btnOpenNewBottomCards.addEventListener('click', showAndHideCards)
function showAndHideCards(event) {
	event.preventDefault()
	if(btnOpenNewBottomCards.textContent === 'Посмотреть все') {
		btnOpenNewBottomCards.textContent = 'Cкрыть';
	} else {
		btnOpenNewBottomCards.textContent = 'Посмотреть все';
	}
	newBottomCards.classList.toggle('open')
}



//анимация при скролле
const animItems = document.querySelectorAll('.anim__items');
if(animItems.length>0) {
    window.addEventListener('scroll', animOnScroll)
    function animOnScroll () {
        for(let i = 0; i < animItems.length; i++) {
            const animItem = animItems[i];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offSet(animItem).top;
            const animStart = 4;
            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;  
            }
            if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)){
                animItem.classList.add('anim') ;
            } else {
                if (!animItem.classList.contains('anim-no-hide')) {
                    animItem.classList.remove('anim') 
                }
            }
        }
    }
    function offSet(el) {
        const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {  top: rect.top + scrollTop, left: rect.left + scrollLeft}
    }
    setTimeout(()=> {
        animOnScroll ()
    }, 1000)
}



//логика при клике по стрелкам
const arrowTop = document.querySelector('.arrow.top')
const arrowBottom = document.querySelector('.arrow.bottom')
arrowTop.addEventListener('click', () => scrollToBlock(catalogNode))
arrowBottom.addEventListener('click', () => scrollToBlock(magazineNode))