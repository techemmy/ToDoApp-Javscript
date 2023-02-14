const addTodoBtn = document.getElementById('addItemBtn');
const todoInputBox = document.getElementById('todoInput');
const itemsTodoContainer = document.getElementById('todoItemsContainer');
const todoItems = document.querySelectorAll('#todoItemsContainer article');

// local Storage shape --> [[todoItem, state]]
// todoItem: tells the name of the task
// state: indicates if the todoItem is completed or not. 0: uncompleted, 1: completed
let todoItemsStorage = JSON.parse(localStorage.getItem('todoItems')) || [];

todoItemsStorage.forEach(todo => {
    addTodoItem(todo[0], todo[1])
})

addTodoBtn.addEventListener('click', () => {
    addTodoItem(todoInputBox.value, 0, true);
    todoInputBox.value = '';
    todoInputBox.focus();
    updateLocalStorage();
});

todoInputBox.addEventListener('keyup', e => {
    if (e.code === "Enter") {
        addTodoItem(todoInputBox.value, 0, true);
        todoInputBox.value = '';
        todoInputBox.focus();
        updateLocalStorage();
    }
})

function addTodoItem(todo, state=0, isNew=false) {
    if (Boolean(todo.trim()) == false) return;

    const todoItem = createTodoHTMLItem(todo, state);
    itemsTodoContainer.append(todoItem);

    if (isNew) {
        todoItemsStorage.push([todo, state]);
        console.log(todoItemsStorage)
    }

    addActionBtnListeners(todoItem, todoItem.querySelector('.markDone'), todoItem.querySelector('.deleteTodo'));
}

function addActionBtnListeners(todo, completeTodoBtn, deleteTodoBtn) {
    const todoText = todo.querySelector('.todoText').innerText;

    completeTodoBtn.addEventListener('click', () => {
        const itemState = todo.classList.toString().includes("completed") ? 1: 0
        markTodoAsComplete(todo, todoText, itemState);
        updateLocalStorage();
    })

    deleteTodoBtn.addEventListener('click', () => {
        const itemState = todo.classList.toString().includes("completed") ? 1: 0
        deleteTodo(todoText, itemState);
        todo.remove();
        updateLocalStorage();
    })
}

function createTodoHTMLItem(todoText, state) {
    const todoContainer = document.createElement('article');
    // 0 means the todo is uncompleted, 1 means it's completed
    if (state === 1) todoContainer.className = "completed";

    const todoContentContainer = document.createElement('div');
    todoContentContainer.className = 'todoText';

    const todoContent = document.createElement('p');
    todoContent.innerText = todoText;


    const actionBtn = document.createElement('div');
    actionBtn.className = 'actionBtn';

    const markCompleteBtn = document.createElement('p');
    markCompleteBtn.className = 'markDone';
    markCompleteBtn.innerText = '✓';
    const deleteTodo = document.createElement('p');
    deleteTodo.className = 'deleteTodo';
    deleteTodo.innerText = '✗';

    todoContentContainer.append(todoContent);

    actionBtn.append(markCompleteBtn);
    actionBtn.append(deleteTodo);

    todoContainer.append(todoContentContainer);
    todoContainer.append(actionBtn);

    return todoContainer;
}

function markTodoAsComplete(todoHTML, todoItem, state) {
    const todoNewState = state ? 0: 1;
    let updated = false;
    console.log(todoNewState);
    todoItemsStorage.map(todo => {
        if (todo[0] == todoItem && todo[1] == state && !updated) {
            todo[1] = todoNewState;
            updated = true
        }
    })
    todoHTML.classList.toggle("completed");
}

function deleteTodo(todoItem, state) {
    const itemToDelete = JSON.stringify([todoItem, state])
    const todoItemsStorageInString = todoItemsStorage.map(todo => JSON.stringify(todo));

    const itemToDeleteIndex = todoItemsStorageInString.indexOf(itemToDelete);
    todoItemsStorageInString.splice(itemToDeleteIndex, 1);

    todoItemsStorage =  todoItemsStorageInString.map(todo => JSON.parse(todo))
}

function updateLocalStorage() {
    localStorage.setItem('todoItems', JSON.stringify(todoItemsStorage));
}