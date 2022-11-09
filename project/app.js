// note classNote
class Note {
    constructor(id, title, content, color) {
        this.title = title,
        this.content = content,
        this.id = id,
        this.color = color
    }
}

// Kullanici arayüzü sinifi
class UI {
    static refreshNotes() {
        document.querySelector('#note-list').innerHTML = '';
        const notes = Store.getNotes();
        let i = notes.length;
        while(i--) UI.addNoteToList(notes[i]);
        UI.updateId();
    }

    static addNoteToList(note) {
        const list = document.querySelector('#note-list');
        let card = document.createElement('div');
        card.classList = 'card text-white bg-primary mb-3';

        card.innerHTML = `
            <div class="card-header">
                <span>${note.title}</span>
                <i class="fas fa-trash" noteid="${note.id}"></i>
                <i class="fas fa-pencil-alt mr-3" noteid="${note.id}"></i>
            </div>
            <div class="card-body ${note.color} ${note.color=='bg-white'?'text-dark':''}">
                <p class="card-text">${note.content}</p>
            </div>
        `;
        list.appendChild(card);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#note-form');
        container.insertBefore(div, form);
        // 3 saniyede yok ol
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#content').value = '';
        UI.updateId();
    }

    static updateId() {
        document.querySelector('#noteid').value = (Store.getLastNote()==undefined)? 1: Store.getLastNote().id+1;
    }

    static removeColorPicker() {
        let swatches = document.querySelector('.swatches').children;
        let i = swatches.length;
        while(i--) swatches[i].classList.remove('active');
    }

   

    

}

// Depolama sinifi
class Store {

    static getNotes() {
        let notes;
        if(localStorage.getItem('notes') == null) {
            notes = [];
        }
        else {
            notes = JSON.parse(localStorage.getItem('notes'));
        }
        return notes;
    }

    static getNote(id) {
        return Store.getNotes().find(val => val.id == id);
    }

    static getLastNote() {
        let notes = Store.getNotes();
        return notes[notes.length-1];
    }

    static addNote(note) {
        if(Store.getNote(note.id) !== undefined)  {
            Store.removeNote(note.id); // varsa ilk önce notu kaldır
        }
        const notes = Store.getNotes();
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    static removeNote(id) {
        const notes = Store.getNotes();
        notes.forEach((note, index) => {
            if(note.id == id) {
                notes.splice(index, 1)
            }
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}


// Events: Görüntülemek
document.addEventListener('DOMContentLoaded', UI.refreshNotes());

// Event: not ekle
document.querySelector('#note-form').addEventListener('submit', e => {
    e.preventDefault();
    // form degerlerini al(get)
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    const id = parseInt(document.querySelector('#noteid').value);
    const color = document.querySelector('.swatches').querySelector('.active').classList[0];
    

    // dogrulamak
    if(title == '' || content == '') {
        UI.showAlert("Lütfen bütün boşlukları doldurun", 'danger');
    }
    else {
        // Ornek Not
        const note = new Note(id, title, content, color);
        
        // Not Ekleme
        UI.addNoteToList(note); 
        Store.addNote(note);
        UI.showAlert("Not Eklendi ", 'success');
        UI.clearFields();
        UI.refreshNotes();
    }

})

// Event: notu kaldir/guncelle
document.querySelector('#note-list').addEventListener('click', e => {
    UI.refreshNotes(); // kullanıcı arayüzünden
    if(e.target.classList.contains('fa-trash')) {
        Store.removeNote(e.target.getAttribute('noteid')); // depodan
        UI.showAlert("Not Kaldirildi ", 'success');
        UI.refreshNotes();
    }
    if(e.target.classList.contains('fa-pencil-alt')) {
        // formu secili notla güncelle
        document.querySelector('#title').value = e.target.parentElement.firstElementChild.innerText.trim();
        document.querySelector('#content').value = e.target.parentElement.parentElement.querySelector('.card-body').innerText.trim();
        document.querySelector('#noteid').value = e.target.getAttribute('noteid');
        // formda secilen rengi degistir
        UI.removeColorPicker();
        document.querySelector('.'+e.target.parentElement.parentElement.querySelector('.card-body').classList[1]).classList.add('active');
        
    }
        
      
})


// renk sec
document.querySelector('.swatches').addEventListener('click', e => {
    if(e.target.classList.contains('swatch')) {
        UI.removeColorPicker();
        e.target.classList.add('active');
    }
    
})

//notun üstünü cizme
/*
let addButton = document.getElementById('#noteid');
let displayData = document.getElementById('#note-list'');
let data = document.getElementById('#note-form');

addButton.addEventListener('click', () => {
  let para = document.createElement('p');

  para.innerHTML = data.value;
  para.classList.add('pStyle');

  displayData.appendChild(para);
  data.value = '';
  
  para.addEventListener('click', () => {
   para.style.textDecoration = 'line-through';
  });
  para.addEventListener('dblclick', () => {
    displayData.removeChild(para);
  });
});
*/