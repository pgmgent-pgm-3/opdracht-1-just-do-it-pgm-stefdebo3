import { themes } from './themes.js';
import { getArray, SaveArray } from './storage.js';

const themeSwitcher = {
  init() {
    this.cacheElements();
    this.registerListeners();
    this.activateCurrentTheme(this.currentTheme);
  },
  cacheElements() {
    try {
    this.$themeButton = document.querySelector('.theme_switcher_circle');
    } catch (e) {
      console.log(e);
    }
    this.currentTheme = themes.find((e) => e.slug === getArray('theme')[0]);
    if (this.currentTheme === undefined) {
      SaveArray('theme', ['dark-mode']);
      this.currentTheme = themes.find((e) => e.slug === getArray('theme')[0]);
    }
  },
  activateCurrentTheme(theme) {
    try {
      this.$themeButton.parentNode.classList.add(theme.slug);
      SaveArray('theme', [theme.slug]);
    } catch (e) {
      console.log(e);
    }
    theme.colors.forEach((color) => {
      document
        .querySelector(':root')
        .style.setProperty(color.name, color.color);
    });
  },
  registerListeners() {
    if (this.$themeButton) {
      this.$themeButton.addEventListener('click', async (ev) => {
        // class switcher
        if (ev.target.parentNode.classList.contains('light-mode')) {
          ev.target.parentNode.classList.remove('light-mode');
          ev.target.parentNode.classList.add('dark-mode');
          SaveArray('theme', ['dark-mode']);
        } else if (ev.target.parentNode.classList.contains('dark-mode')) {
          ev.target.parentNode.classList.remove('dark-mode');
          ev.target.parentNode.classList.add('light-mode');
          SaveArray('theme', ['light-mode']);
        }
        // theme switcher
        const currentTheme = themes.find((e) => e.slug === getArray('theme')[0]);
        this.activateCurrentTheme(currentTheme);
      });
    }
    // this.$themeButton.addEventListener('click', async (ev) => {
    //   // class switcher
    //   if (ev.target.parentNode.classList.contains('light-mode')) {
    //     ev.target.parentNode.classList.remove('light-mode');
    //     ev.target.parentNode.classList.add('dark-mode');
    //     SaveArray('theme', ['dark-mode']);
    //   } else if (ev.target.parentNode.classList.contains('dark-mode')) {
    //     ev.target.parentNode.classList.remove('dark-mode');
    //     ev.target.parentNode.classList.add('light-mode');
    //     SaveArray('theme', ['light-mode']);
    //   }
    //   // theme switcher
    //   const currentTheme = themes.find((e) => e.slug === getArray('theme')[0]);
    //   this.activateCurrentTheme(currentTheme);
    // });
  },
};

themeSwitcher.init();
