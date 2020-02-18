const button = document.querySelector('header button');
const form = document.querySelector('.form');
button.addEventListener("click", e => {
    form.classList.toggle('hide');
})
