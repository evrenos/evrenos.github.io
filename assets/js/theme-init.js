/* Runs synchronously in <head> before first paint:
   - resolves the colour theme (stored choice → OS preference)
   - flags JS support so reveal animations can start hidden
   - decides whether to show the one-per-session boot sequence */
(function () {
  var root = document.documentElement;
  var theme = null;
  try { theme = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', theme);
  root.classList.add('js');

  var booted = false;
  try { booted = sessionStorage.getItem('booted') === '1'; } catch (e) { booted = true; }
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!booted && !reduced) root.classList.add('is-booting');
})();
