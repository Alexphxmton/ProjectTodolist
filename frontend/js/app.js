
const API = 'http://localhost:4000/api/todos';

const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-button');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const markAllButton = document.getElementById('container__button');
const buttonFinish = document.getElementById('button-finish');
const buttonClear = document.getElementById('button-clear');
const buttonExport = document.getElementById('button-export');
const buttonInProgress = document.getElementById('button-in-progress');
const buttonAll = document.getElementById('button-all');
const counter = document.getElementById('counter-text');
const modal = document.getElementById('background-modal');
const confirmButtonMark = document.getElementById('confirm-button-mark');
const confirmButtonFinish = document.getElementById('confirm-button-finish');
const confirmButtonClear = document.getElementById('confirm-button-clear');
const cancelButton = document.getElementById('cancel-button');
const buttonCompleted = document.getElementById('button-completed');
let editandoActual = null;

async function cargar() {
    const res = await fetch(API);
    const json = await res.json();
    render(json.data);
    
}


async function crearNote() {
    const title = input.value.trim();
    if (!title)return;
    await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title}),
    });
    input.value = '';
    cargar();
    
}
async function editarNote(id, title) {
    await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title}),

    });
    cargar();
}
async function ToggleEvent(id, completed) {
  await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed }),
  });

  cargar();
}

async function eliminar(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  cargar();
}
async function marcarTodos() {
    await fetch(`${API}/mark-all`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({completed: true}),
    });
    cargar();
}
async function enProceso() {
  const res = await fetch(`${API}/in-progress`);
  const json = await res.json();
  render(json.data);
}
async function completado() {
  const res = await fetch(`${API}/completed`);
  const json = await res.json();
  render(json.data);
}

async function clearAll() {
  await fetch(`${API}/clear-all`,{
    method: 'DELETE',

  });
  cargar();
  
}
function contador(notes){
  if(!notes.length){
    counter.textContent = '';
    return;
  }
  const restantes = notes. filter(t => !t.completed).length;

  if(restantes === 0){
    counter.textContent =  'All completed, good job!';

  }else if(restantes === 1){
    counter.textContent = '1 task remaining';

  }else{
    counter.textContent = `${restantes} tasks remaining`;
  }

}



function activarEdicion(container, todo) {
      if (editandoActual && editandoActual !== container) {
    editandoActual = null;
    cargar().then(() => {
      const nuevos = document.querySelectorAll('.element__todo');
      nuevos.forEach(div => {
        const texto = div.querySelector('span')?.textContent;
        if (texto === todo.title) {
          activarEdicion(div, todo);
        }
      });
    });
    return;
  }

 

  editandoActual = container;
    container.classList.add('editing');
  container.innerHTML = `
   <div class="edit-top">
        <label class="mi-checkbox-personalizado">
            <input type="checkbox" class="checkbox-oculto" ${todo.completed ? 'checked' : ''}>
            <div class="icono-checkbox__container">
                <img class="icono-checkbox" src="img/icono-checkbox.png" alt="Icono">
            </div>
        </label>

        <span class="todo-text">${todo.title}</span>

        <img src="img/delete.svg" class="btn-eliminar">
    </div>

    <div class="edit-bottom">
        <input class="edit-input" value="${todo.title}">
        <img src="img/flecha.svg" class="btn-guardar">
    </div>
  `;

  const inputEdit = container.querySelector('.edit-input');
  const btnGuardar = container.querySelector('.btn-guardar');

  inputEdit.focus();


  btnGuardar.addEventListener('click', async () => {
    const nuevoTitulo = inputEdit.value.trim();
    if (!nuevoTitulo) return;

    await editarNote(todo.id, nuevoTitulo);
  });


  inputEdit.addEventListener('keypress', async e => {
    if (e.key === 'Enter') {
      const nuevoTitulo = inputEdit.value.trim();
      if (!nuevoTitulo) return;

      await editarNote(todo.id, nuevoTitulo);
    }
  });
}
function mostrarModal(btnAMostrar) {
    modal.style.display = 'flex';
    confirmButtonMark.style.display = 'none';
    confirmButtonFinish.style.display = 'none';
    confirmButtonClear.style.display = 'none';
    btnAMostrar.style.display = 'flex';
}
function cerrarModal() {
    modal.style.display = 'none';
}



function render(notes) {
    list.innerHTML=''; 
   
    
    if (!notes.length){
        emptyState.style.display = 'block';
        counter.textContent = '';
        
        markAllButton.style.display = 'none';
        buttonFinish.style.display ='none';
        buttonClear.style.display ='none';
        buttonExport.style.display ='none';
        return;
    }
    
    emptyState.style.display = 'none';
    contador(notes);
   const inProgressNotes = notes.some(t => !t.completed);
   const completedNotes = notes.some(t => t.completed);
    markAllButton.style.display = 'flex';
    buttonFinish.style.display ='flex';
    buttonClear.style.display ='flex';
    buttonExport.style.display ='flex';
    buttonInProgress.style.display = inProgressNotes ? 'flex' : 'none';    
    buttonCompleted.style.display = completedNotes ? 'flex' : 'none';



    notes.forEach(t =>{
        const div = document.createElement('div');
        div.className = 'element__todo-list'; 

        
        div.innerHTML = `
            <label class="mi-checkbox-personalizado">
                <input type="checkbox" class="checkbox-oculto" ${t.completed ? 'checked' : ''}>
                <div class="icono-checkbox__container">
                    <img class="icono-checkbox" src="img/icono-checkbox.png" alt="Icono">
                </div>
            </label>
            
            <span>${t.title}</span>
            
            <img src="img/delete.svg" alt="Icono para eliminar nota" style="cursor: pointer;" class="btn-eliminar">
        `;
        
     
        div.querySelector('.checkbox-oculto')
            .addEventListener('change', () => ToggleEvent(t.id, t.completed));

        
        div.querySelector('.btn-eliminar')
            .addEventListener('click', () => eliminar(t.id));

            div.addEventListener('dblclick', () => activarEdicion(div, t));

        list.appendChild(div);
    });
}

markAllButton.addEventListener('click', () => mostrarModal(confirmButtonMark));
buttonFinish.addEventListener('click', () => mostrarModal(confirmButtonFinish));
buttonClear.addEventListener('click', () => mostrarModal(confirmButtonClear));
confirmButtonClear.addEventListener('click', async () => {
    await clearAll();
    cerrarModal();
});

confirmButtonFinish.addEventListener('click', async () => {
    await marcarTodos();
    cerrarModal();
});

confirmButtonMark.addEventListener('click', async () => {
    await marcarTodos();
    cerrarModal();
});


buttonAll.addEventListener('click', cargar);
buttonInProgress.addEventListener('click', enProceso);
buttonCompleted.addEventListener('click', completado);
cancelButton.addEventListener('click', () => {
  cerrarModal()});
addBtn.addEventListener('click', crearNote);
input.addEventListener('keypress', e => {
  if (e.key === 'Enter') crearNote();
});


cargar();