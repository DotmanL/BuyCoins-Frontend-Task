const menunav = document.querySelector('.menu')
const mobileTab = document.querySelector('.mobile-access-tab')
const deskTab = document.querySelector('.tab')
const tabImage = document.querySelector('.tab-image')

const toggler = () => {
	menunav.classList.toggle('active')
}

var mobileTabOffset = mobileTab.offsetTop

window.addEventListener('scroll', () => {
	if (window.pageYOffset >= mobileTabOffset) {
		mobileTab.classList.add('tabactive')
	} else {
		mobileTab.classList.remove('tabactive')
	}
})

var deskTabOffset = deskTab.offsetTop

window.addEventListener('scroll', () => {
	if (window.pageYOffset >= deskTabOffset) {
		deskTab.classList.add('deskTabactive')
		tabImage.classList.add('tab-image-active')
	} else {
		deskTab.classList.remove('deskTabactive')
		tabImage.classList.remove('tab-image-active')
	}
})
