/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */

const app = {
  init() {
    this.cacheElements();
    this.registerListeners();
    // this.activateCurrentTheme(this.currentTheme);
  },
  cacheElements() {
    this.$completeButtons = document.querySelectorAll('.to_do_complete');
    this.$deleteButtons = document.querySelectorAll('.to_do_delete');
    this.$editButtons = document.querySelectorAll('.to_do_edit');
    this.$categoryNav = document.querySelectorAll('.category__list_item');
    this.$to_doList = document.querySelector('.to_do_list');
    this.$doneList = document.querySelector('.to_do_done');
    this.$taskFields = document.querySelectorAll('.task span');
    this.$userId = document.querySelector('.userId');
    // this.$themeButton = document.querySelector('.theme_switcher_circle');
    // this.currentTheme = themes.find((e) => e.slug === getArray('theme')[0]);
    // if (this.currentTheme === undefined) {
    //   SaveArray('theme', ['dark-mode']);
    //   this.currentTheme = themes.find((e) => e.slug === getArray('theme')[0]);
    // }
    this.$categoryDeleteButton = document.querySelector(
      '.delete_category_button'
    );
  },
  // activateCurrentTheme(theme) {
  //   if (!this.$themeButton.parentNode.classList.contains(theme.slug)) {
  //     this.$themeButton.parentNode.classList.remove('dark-mode');
  //     this.$themeButton.parentNode.classList.add(theme.slug);
  //     SaveArray('theme', [theme.slug]);
  //   }
  //   theme.colors.forEach((color) => {
  //     document
  //       .querySelector(':root')
  //       .style.setProperty(color.name, color.color);
  //   });
  // },
  registerListeners() {
    this.$categoryDeleteButton.addEventListener('click', async () => {
      const categorySelect = document.querySelector('.category_delete_select');
      const id =
        categorySelect.options[categorySelect.selectedIndex].classList[0];
      await fetch(`http://localhost:3000/api/Category/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(() => {
        location.reload();
      });
    });

    this.$completeButtons.forEach((element) => {
      element.addEventListener('click', async (ev) => {
        this.userId = this.$userId.value;
        const taskId =
          ev.target.dataset.id ||
          ev.target.parentNode.dataset.id ||
          ev.target.parentNode.parentNode.dataset.id ||
          ev.target.parentNode.parentNode.parentNode.dataset.id;
        const requestItem = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: taskId, status: 'done' }),
        };
        await fetch('http://localhost:3000/api/Task', requestItem).then(() => {
          location.reload();
        });
      });
    });

    this.$deleteButtons.forEach((element) => {
      element.addEventListener('click', async (ev) => {
        const id =
          ev.target.dataset.id ||
          ev.target.parentNode.dataset.id ||
          ev.target.parentNode.parentNode.dataset.id ||
          ev.target.parentNode.parentNode.parentNode.dataset.id;
        await fetch(`http://localhost:3000/api/Task/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }).then(() => {
          location.reload();
        });
      });
    });

    this.$categoryNav.forEach((element) => {
      element.addEventListener('click', (ev) => {
        const categoryName =
          ev.target.dataset.id ||
          ev.target.parentNode.dataset.id ||
          ev.target.parentNode.parentNode.dataset.id ||
          ev.target.parentNode.parentNode.parentNode.dataset.id;
        // active category switchen
        document.querySelector('.active').classList.toggle('active');
        ev.target.classList.toggle('active');

        // list items verbergen en onthullen.
        this.taskCreateContainer = document.querySelector(
          '.task_container--create'
        );
        this.categoryItems = document.querySelectorAll(`.${categoryName}`);
        this.allItems = document.querySelectorAll('.task_container');
        this.allItems.forEach((e) => {
          if (!e.classList.contains('hidden')) {
            e.classList.add('hidden');
          }
        });
        this.categoryItems.forEach((e) => {
          e.classList.remove('hidden');
        });
        this.taskCreateContainer.classList.remove('hidden');

        // default alles laten tonen
        if (categoryName === 'All') {
          this.allItems.forEach((e) => {
            if (e.classList.contains('hidden')) {
              e.classList.remove('hidden');
            }
          });
        }

        // taskField veranderen naar input voor edit-functie
      });
    });
    this.$taskFields.forEach((e) => {
      e.addEventListener('click', (ev) => {
        ev.target.classList.add('preventDefault');
        const taskValue = ev.target.innerHTML;
        if (document.querySelector('.taskInput') === null) {
          e.parentNode.innerHTML = `<input class="taskInput" value="${taskValue}">`;
        } else {
          return new Error('Already defining a new variable');
        }
      });
    });
    this.$editButtons.forEach((e) => {
      e.addEventListener('click', async (ev) => {
        this.inputField = null;
        this.taskField = null;
        if (ev.target.childNodes.length === 0) {
          this.taskField = ev.target.parentNode.parentNode;
          this.inputField =
            ev.target.parentNode.parentNode.querySelector('.taskInput');
        } else {
          this.taskField = ev.target.parentNode;
          this.inputField = ev.target.parentNode.querySelector('.taskInput');
        }
        if (this.inputField === null) {
          return new Error('Please edit the name first');
        }
        await fetch('http://localhost:3000/api/Task', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.taskField.dataset.id,
            name: `${this.inputField.value}`,
          }),
        }).then(() => {
          location.reload();
        });
      });
    });
    //   this.$themeButton.addEventListener('click', async (ev) => {
    //     // class switcher
    //     if (ev.target.parentNode.classList.contains('light-mode')) {
    //       ev.target.parentNode.classList.remove('light-mode');
    //       ev.target.parentNode.classList.add('dark-mode');
    //       SaveArray('theme', ['dark-mode']);
    //     } else if (ev.target.parentNode.classList.contains('dark-mode')) {
    //       ev.target.parentNode.classList.remove('dark-mode');
    //       ev.target.parentNode.classList.add('light-mode');
    //       SaveArray('theme', ['light-mode']);
    //     }
    //     // theme switcher
    //     const currentTheme = themes.find((e) => e.slug === getArray('theme')[0]);
    //     this.activateCurrentTheme(currentTheme);
    //   });
  },
};

app.init();
