document.addEventListener('DOMContentLoaded', () => {
    for(let i = 0; i < 1000; i++) {
        setTimeout(() => {
            Array.from(document.all).forEach(element => {
                if(['textarea', 'input'].includes(element.tagName.toLowerCase())) element.setAttribute('disabled', 'disabled');
            });
        }, 10 * i);
    }
});