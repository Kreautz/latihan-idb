/* *
* Indexed DB
* */
createDatabase();
function createDatabase() {
    if (!('indexedDB' in window)){
        console.log('Web Browser tidak mendukung Indexed DB');
        return;
    }
    var request = window.indexedDB.open('latihan-idb',1);
    request.onerror = errorHandle;
    request.onupgradeneeded = (e)=>{
        var db = e.target.result;
        db.onerror = errorHandle;
        var objectStore = db.createObjectStore('mahasiswa',
            {keyPath: 'nim'});
        console.log('Object store mahasiswa berhasil dibuat');
    }
    request.onsuccess = (e) => {
        db = e.target.result;
        db.error = errorHandle;
        console.log('Berhasil melakukan koneksi ke database lokal');
        // welp...
        bacaDariDB();
    }
}

function errorHandle(e) {
    console.log('Error DB : '+e.target.errorCode);
}

var nim = document.getElementById('nim');
    nama = document.getElementById('nama');
    gender = document.getElementById('gender');
    form = document.getElementById('form-tambah');
    table = document.getElementById('tabel-mahasiswa');

// tambah data
form.addEventListener('submit', tambahBaris);
tabel.addEventListener('click',hapusBaris);

function tambahBaris(e){
    // cek keberadaan nim
    if(table.rows.namedItem(nim.value)){
        alert('Error : NIM sudah terdaftar');
        e.preventDefault();
        return;
    }
    // tambah ke dalam db
    tambahKeDB({
        nim     : nim.value,
        nama    : nama.value,
        gender  : gender.value
    });

    //nambahin baris
    var baris = table.insertRow();
    baris.insertCell().appendChild(document.createTextNode(nim.value));
    baris.insertCell().appendChild(document.createTextNode(nama.value));
    baris.insertCell().appendChild(document.createTextNode(gender.value));

    //tambah tombol hapus
    var tombolHapus = document.createElement('input');
    tombolHapus.type = 'button';
    tombolHapus.value = 'Hapus';
    tombolHapus.className = 'btn btn-sm btn-danger';
    tombolHapus.id = nim.value;
    baris.insertCell().appendChild(tombolHapus);
    e.preventDefault();
}

function tambahKeDB(mahasiswa){
    var objectStore = buatTransaksi().objectStore('mahasiswa');
    var request = objectStore.add(mahasiswa);
    request.onerror = errorHandle;
    request.onsuccess = console.log('Mahasiswa ['+mahasiswa.nim+'] ditambahkan');
}

function buatTransaksi(){
    var transaction = db.transaction(['mahasiswa'], 'readwrite');
    transaction.error = errorHandle;
    transaction.oncomplete = console.log('transaksi baru done');

    return transaction;
}

function bacaDariDB(){
    var objectStore = buatTransaksi().objectStore('mahasiswa');
    objectStore.openCursor().onsuccess = function(e) {
        var result = e.target.result;
        if(result){
            console.log('Membaca mahasiswa [' + result.value.nim + '] dari database.');
            var baris = table.insertRow();
            baris.id = result.value.nim;
            baris.insertCell().appendChild(document.createTextNode(nim.value));
            baris.insertCell().appendChild(document.createTextNode(nama.value));
            baris.insertCell().appendChild(document.createTextNode(gender.value));

            var tombolHapus = document.createElement('input');
            tombolHapus.type = 'button';
            tombolHapus.value = 'Hapus';
            tombolHapus.className = 'btn btn-sm btn-danger';
            tombolHapus.id = result.nim.value;
            baris.insertCell().appendChild(tombolHapus);
            result.continue();
        }
    }
}

function hapusBaris(e){
    if(e.target.type === 'button'){
        var hapus = confirm('Apakah anda yakin akan menghapus mahasiswa dengan nim : '+e.target.nim+' ?');
        if(hapus){
            table.deleteRow(table.rows.namedItem(e.target.id).sectionRowIndex);
            hapusDariDB(e.target.id);
        }
    }
}

function hapusDariDB(){
    var objectStore = buatTransaksi().objectStore('mahasiswa');
    var request = objectStore.delete(nim);
    request.onerror = errorHandle;
    request.onsuccess = console.log('Mahasiswa ['+nim+'] terhapus');
}