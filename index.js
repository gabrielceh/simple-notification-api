const d = document;

const $form = d.getElementById('form-todo'),
  $title = d.getElementById('input-title'),
  $description = d.getElementById('input-description'),
  $date = d.getElementById('input-date'),
  $btnAdd = d.getElementById('btn-add'),
  $todoList = d.querySelector('.todos-list'),
  $todoTemplate = d.getElementById('todo-template').content,
  $fragment = d.createDocumentFragment();

let todoList = [];
let notificacionPermission = '';

const showTodo = (array = []) => {
  $todoList.innerHTML = '';
  array.forEach((item) => {
    const clone = $todoTemplate.cloneNode(true);
    clone.querySelector('.todo').dataset.id = item.id;
    clone.querySelector('.todo-title').textContent = item.title;
    clone.querySelector('.todo-description').textContent = item.description;
    clone.querySelector('.todo-date').textContent = item.date;
    clone.querySelector('.btn-delete').textContent = 'DELETE';
    clone.querySelector('.btn-delete').dataset.id = item.id;

    $fragment.append(clone);
  });

  $todoList.append($fragment);
};

const showNotificationAdd = (data) => {
  const notification = new Notification(`Task added`, {
    body: `You add "${data.title}" to your to do list`,
    icon: './assets/todo-list.webp',
  });

  setTimeout(() => {
    notification.close();
  }, 10000);

  notification.addEventListener('click', () => {
    console.log('abriste la notificacion de agregar');
  });
};

const showNotificationDelete = (data) => {
  const notification = new Notification(`Task deleted`, {
    body: `You deleted "${data.title}" from your to do list`,
    icon: './assets/todo-list.webp',
  });

  setTimeout(() => {
    notification.close();
  }, 10000);

  notification.addEventListener('click', () => {
    console.log('abriste la notificacion de borrar');
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  const data = {
    id: Date.now().toString(),
    title: $title.value,
    description: $description.value,
    date: $date.value,
    show: false,
  };
  todoList.unshift(data);
  showTodo(todoList);
  notificacionPermission === 'granted' && showNotificationAdd(data);
};

const dateNotification = (item) => {
  const date = new Date(item.date);
  const mils = date.getTime();
  console.log(mils);
  if (!item.date) {
    return;
  }
  if (mils <= Date.now() && !item.show) {
    const notification = new Notification(`Todo List`, {
      body: `Your task "${item.title}" is pending`,
      icon: './assets/todo-list.webp',
    });

    todoList = todoList.map((it) => {
      it.show = true;
      return it;
    });

    setTimeout(() => {
      notification.close();
    }, 10000);

    notification.addEventListener('click', () => {
      console.log('abriste la notificacion de pendientee');
    });
  }
};

d.addEventListener('DOMContentLoaded', async (e) => {
  console.log(todoList);
  notificacionPermission = await Notification.requestPermission();

  console.log(notificacionPermission);
});

$form.addEventListener('submit', (e) => {
  handleSubmit(e);
});

d.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete')) {
    console.log(e.target);
    const item = todoList.filter((item) => item.id === e.target.dataset.id);
    todoList = todoList.filter((item) => item.id !== e.target.dataset.id);
    showTodo(todoList);
    notificacionPermission === 'granted' && showNotificationDelete(item);
  }
});

(() => {
  setInterval(() => {
    if (todoList.length > 0) {
      todoList.forEach((item) => dateNotification(item));
    }
  }, 5000);
})();
