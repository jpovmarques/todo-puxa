// TODO: add new icon for time schedule with notification

const db = new PouchDB('todos');

function create(id, text) {
  const todo = {
    _id: id,
    title: text,
    completed: false
  };
  db.put(todo);
}

function update(todo, text) {
  const newTodo = {
    _id: todo._id,
    _rev: todo._rev,
    title: text,
    completed: false,
  };
  db.put(newTodo);
}

function addTodo(text) {
  create(uuidv4(), text);
}

function updateTodo(todo, text) {
  update(todo, text);
}

function deleteTodo(todo) {
  db.remove(todo);
}

function toggleTodo(todo) {
  console.log('toggle todo', todo);
}

function changeInputState(input, todo) {
  input.disabled = false;
  input.select();
}

function onFocusTodo(input, todo) {
  changeInputState(input, todo);
}

function onBlurTodo(input, todo) {
  updateTodo(todo, input.value);
  input.disabled = false;
}

function onSubmitTodo(event, input, todo) {
  const key = event.which || event.keyCode;
    if (key === 13) { 
      input.blur();
      input.disabled = false;
    }
}


const createTodoListItem = (todo) => {
  const li = document.createElement('LI');

  const input = document.createElement('input');
  input.addEventListener('focus', onFocusTodo.bind(this, input, todo));
  input.addEventListener('blur', onBlurTodo.bind(this, input, todo));
  input.addEventListener('keypress', (e) => { onSubmitTodo(e, input, todo) });
  input.classList.add('macos-grey');
  input.classList.add('macos-font-color');
  input.type = 'text';
  input.border = 'none';
  input.value = todo.title;

  const a = document.createElement('a');
  a.classList.add('small');
  a.classList.add('macos-font-color');

  const deleteSpan = document.createElement('SPAN');
  deleteSpan.id = todo._id;
  deleteSpan.addEventListener('click', deleteTodo.bind(this, todo));
  deleteSpan.classList.add('fa');
  deleteSpan.classList.add('fa-times');
  deleteSpan.classList.add('transparent');

  const addSpan = document.createElement('SPAN');
  addSpan.id = todo._id;
  addSpan.addEventListener('click', toggleTodo.bind(this, todo));
  addSpan.classList.add('fa');
  addSpan.classList.add('fa-check');

  a.appendChild(addSpan);
  a.appendChild(input);
  a.appendChild(deleteSpan);
  li.appendChild(a);

  return li;
}

const redrawTodosUI = (allTodos) => {
  const ul = document.getElementById('list');
  ul.innerHTML = '';
  allTodos.forEach((todo) => {
    ul.appendChild(createTodoListItem(todo.doc));
  });
}

const showAllTodos = () => {
  db.allDocs({include_docs: true, descending: true}, function(err, doc) {
    redrawTodosUI(doc.rows);
  });
}

db.changes({
  since: 'now',
  live: true
}).on('change', showAllTodos);

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById("list");
  showAllTodos();
});
