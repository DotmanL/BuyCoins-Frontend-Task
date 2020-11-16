const menunav = document.querySelector('.menu')
const mobileTab = document.querySelector('.mobile-access-tab')

const toggler = () => {
	menunav.classList.toggle('active')
}

var ok = mobileTab.offsetTop

window.addEventListener('scroll', () => {
	if (window.pageYOffset >= ok) {
		mobileTab.classList.add('tabactive')
	} else {
		mobileTab.classList.remove('tabactive')
	}
})
