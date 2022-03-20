export default {
  bold(text) {
    return `<strong>${text}</strong>`;
  },
  link(url, options) {
    return `<a href="${url}">${options.fn(this)}</a>`;
  },
  list_item(classes, id, options) {
    return `<li class="${classes}" data-id="${id}">${options.fn(this)}</li>`;
  },
  button(classes, type, options) {
    return `
    <button type="${type}" class="${classes}">
      ${options.fn(this)}
    </button>
    `;
  },
  append(string, parameter) {
    return string + parameter;
  },
};
