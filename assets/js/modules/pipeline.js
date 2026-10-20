import { $, $$, prefersReducedMotion } from './utils.js';

/**
 * Fintech "test run" visual: payment steps pass one by one while the spec log prints.
 * Plays when scrolled into view; "Run again" replays it.
 */
export function initPipeline() {
  const root = $('#pipeline');
  if (!root) return;
  const steps = $$('.pipeline__step', root);
  const lines = $$('.pipeline__line', root);
  const runBtn = $('#pipeline-run', root);
  let timers = [];

  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    steps.forEach((s) => s.classList.remove('is-running', 'is-passed'));
    lines.forEach((l) => l.classList.remove('is-shown'));
    root.classList.remove('is-done');
  };

  const showAll = () => {
    steps.forEach((s) => s.classList.add('is-passed'));
    lines.forEach((l) => l.classList.add('is-shown'));
    root.classList.add('is-done');
  };

  const play = () => {
    reset();
    if (prefersReducedMotion()) { showAll(); return; }
    const STEP = 650;
    steps.forEach((step, i) => {
      timers.push(setTimeout(() => step.classList.add('is-running'), i * STEP));
      timers.push(setTimeout(() => {
        step.classList.remove('is-running');
        step.classList.add('is-passed');
        lines[i]?.classList.add('is-shown');
      }, i * STEP + STEP * 0.8));
    });
    timers.push(setTimeout(() => {
      lines[lines.length - 1]?.classList.add('is-shown');
      root.classList.add('is-done');
    }, steps.length * STEP + 200));
  };

  runBtn?.addEventListener('click', play);

  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      play();
      io.disconnect();
    }
  }, { threshold: 0.4 });
  io.observe(root);
}
