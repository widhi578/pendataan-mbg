const scriptURL = 'https://script.google.com/macros/s/AKfycbzEZ0TuYr1edE3c3mU6ALkftkOyD5HN4mulKBrQ1gou_ixuIVfh0Z76F9Vn2hZ7yIdU/exec';

const form = document.forms['submit-to-google-sheet'];
const btnSubmit = document.getElementById('btnSubmit');
const buttonText = btnSubmit.querySelector('.button-text');
const pesanRespon = document.getElementById('pesanRespon');
const todayLabel = document.getElementById('todayLabel');

let messageTimer;

todayLabel.textContent = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
}).format(new Date());

function setLoading(isLoading) {
    btnSubmit.disabled = isLoading;
    btnSubmit.classList.toggle('is-loading', isLoading);
    buttonText.textContent = isLoading ? 'Mengirim...' : 'Kirim data';
}

function showMessage(type, text) {
    clearTimeout(messageTimer);

    pesanRespon.textContent = text;
    pesanRespon.classList.remove('is-success', 'is-error');

    if (type) {
        pesanRespon.classList.add(`is-${type}`);
    }

    if (type === 'success') {
        messageTimer = setTimeout(() => {
            pesanRespon.textContent = '';
            pesanRespon.classList.remove('is-success');
        }, 4200);
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.reportValidity()) {
        showMessage('error', 'Lengkapi nomor absen dan nama siswa terlebih dahulu.');
        return;
    }

    setLoading(true);
    showMessage('', '');

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }

            showMessage('success', 'Berhasil. Data siswa sudah masuk ke sistem admin.');
            form.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            showMessage('error', 'Gagal mengirim data. Periksa koneksi internet lalu coba lagi.');
        })
        .finally(() => {
            setLoading(false);
        });
});
