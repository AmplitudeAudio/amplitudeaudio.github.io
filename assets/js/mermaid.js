import mermaid from 'mermaid';

const config = {
  startOnLoad: true,
  theme: 'dark',
  fontFamily: '"Jost", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";',
};

document.addEventListener('DOMContentLoaded', () => {
  mermaid.initialize(config);
  mermaid.init({
    theme: 'base',
    themeVariables: {
      primaryColor: '#ffffff',
      secondaryColor: '#74D0F1',
    },
  }, '.mermaid');
});
