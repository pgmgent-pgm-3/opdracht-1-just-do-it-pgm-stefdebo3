/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const dragAndDrop = {
  init() {
    this.cacheDOMElements();
    this.initDragAndDrop();
  },
  cacheDOMElements() {
    this.$tasks = document.querySelectorAll('.task_container');
    this.$categories = document.querySelectorAll('.category_drop_zone');
  },
  initDragAndDrop() {
    this.$tasks.forEach((task) => {
      task.draggable = true;
      task.ondragstart = (ev) => {
        task.classList.add('dragging');
        ev.dataTransfer.effectAllowed = 'link';
        ev.dataTransfer.setData('text/plain', `${task.dataset.id}`);
      };
      task.ondragend = (ev) => {
        task.classList.remove('dragging');
      };
    });
    this.$categories.forEach((category) => {
      category.ondragover = (ev) => {
        ev.preventDefault();
      };
      category.ondrop = async (ev) => {
        const categoryName = category.dataset.id;
        const taskId = ev.dataTransfer.getData('text/plain');
        await fetch('http://localhost:3000/api/Task', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: taskId,
            categoryId: categoryName,
          }),
        }).then(() => {
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        });
      };
    });
  },
};
dragAndDrop.init();
