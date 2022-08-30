// Alertas en el logeo de usuario


export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) {
        el.parentElement.removeChild(el);
    }

}

export const showAlert = (msg) => {
    hideAlert();
    const markup = `<div class="alert">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 3000);
}