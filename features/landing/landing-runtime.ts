export function mountLanding(options: { dashboardUrl?: string; navigate?: (url: string, replace: boolean) => void } = {}) {
  const root = document.getElementById('imi-landing');
  if (!root) return () => {};
  const storageKey = 'imi.workspace.v1';
  const dashboardUrl = options.dashboardUrl || '/dashboard';
  const navigate = options.navigate || ((url: string, replace: boolean) => {
    if (replace) window.location.replace(url);
    else window.location.assign(url);
  });
  const validBranches = ['all', 'pwt', 'pbg', 'clp', 'wns', 'tgl'];
  const cleanups: (() => void)[] = [];
  const listen = (el: EventTarget, event: string, fn: EventListener) => {
    el.addEventListener(event, fn);
    cleanups.push(() => el.removeEventListener(event, fn));
  };
  let previous: { version: number; branch: string } | null = null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    const value = raw ? JSON.parse(raw) : null;
    if (value && value.version === 1 && validBranches.includes(value.branch)) previous = value;
  } catch { /* Entry remains available when browser storage is disabled. */ }
  if (previous && new URLSearchParams(window.location.search).get('intro') !== '1') {
    root.dataset.returning = 'true';
    navigate(dashboardUrl, true);
    return () => {};
  }

  const dialog = root.querySelector<HTMLDialogElement>('[data-workspace-dialog]');
  const submit = root.querySelector<HTMLButtonElement>('[data-enter-workspace]');
  const remember = root.querySelector<HTMLInputElement>('[data-remember]');
  const choices = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-workspace-choice]'));
  let selectedBranch = previous?.branch || 'all';
  let opener: HTMLElement | null = null;
  const setBranch = (branch: string) => {
    selectedBranch = validBranches.includes(branch) ? branch : 'all';
    choices.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.workspaceChoice === selectedBranch)));
    const label = root.querySelector('[data-selected-label]');
    const selected = choices.find((choice) => choice.dataset.workspaceChoice === selectedBranch);
    if (label) label.textContent = selected?.dataset.label || 'Seluruh jaringan';
  };
  setBranch(selectedBranch);
  root.querySelectorAll<HTMLButtonElement>('[data-open-workspace]').forEach((button) => {
    listen(button, 'click', () => {
      if (!dialog) { navigate(dashboardUrl, false); return; }
      opener = button;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-close-workspace]').forEach((button) => {
    listen(button, 'click', () => dialog?.close());
  });
  choices.forEach((button) => listen(button, 'click', () => setBranch(button.dataset.workspaceChoice || 'all')));
  if (dialog) {
    listen(dialog, 'close', () => { document.body.style.overflow = ''; opener?.focus(); });
    listen(dialog, 'click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      const pointer = event as MouseEvent;
      if (pointer.clientX < bounds.left || pointer.clientX > bounds.right || pointer.clientY < bounds.top || pointer.clientY > bounds.bottom) dialog.close();
    });
  }
  if (submit) listen(submit, 'click', () => {
    try {
      if (remember?.checked) window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, branch: selectedBranch, createdAt: new Date().toISOString() }));
      else window.localStorage.removeItem(storageKey);
    } catch { /* Storage failure must not block navigation. */ }
    submit.disabled = true;
    submit.textContent = 'Membuka dashboard…';
    navigate(dashboardUrl, false);
  });

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-demo-tab]'));
  tabs.forEach((tab) => listen(tab, 'click', () => {
    const view = tab.dataset.demoTab;
    tabs.forEach((button) => {
      const active = button === tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    root.querySelectorAll<HTMLElement>('[data-demo-panel]').forEach((panel) => { panel.hidden = panel.dataset.demoPanel !== view; });
  }));
  tabs.forEach((tab, index) => listen(tab, 'keydown', (event) => {
    const key = (event as KeyboardEvent).key;
    let next = index;
    if (key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (key === 'Home') next = 0;
    else if (key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); tabs[next].focus(); tabs[next].click();
  }));

  const stage = root.querySelector<HTMLElement>('[data-stage]');
  const screen = root.querySelector<HTMLElement>('[data-screen]');
  const flat = root.querySelector<HTMLButtonElement>('[data-flat]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  let frame = 0;
  let flatMode = reducedMotion.matches;
  const setRotation = (x: number, y: number) => {
    screen?.style.setProperty('--rx', x + 'deg');
    screen?.style.setProperty('--ry', y + 'deg');
  };
  const reset = () => { cancelAnimationFrame(frame); setRotation(0, 0); };
  if (stage && screen) {
    listen(stage, 'pointermove', (event) => {
      if (flatMode || reducedMotion.matches || !finePointer.matches) return;
      const pointer = event as PointerEvent;
      const bounds = stage.getBoundingClientRect();
      const x = (pointer.clientX - bounds.left) / bounds.width - 0.5;
      const y = (pointer.clientY - bounds.top) / bounds.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setRotation(-y * 7, x * 9));
    });
    listen(stage, 'pointerleave', reset);
  }
  if (flat) listen(flat, 'click', () => {
    flatMode = !flatMode;
    flat.setAttribute('aria-pressed', String(flatMode));
    flat.textContent = flatMode ? 'Aktifkan tampilan 3D' : 'Tampilan datar';
    root.dataset.flat = String(flatMode); reset();
  });
  listen(reducedMotion, 'change', () => { if (reducedMotion.matches) { flatMode = true; root.dataset.flat = 'true'; reset(); } });
  if (flatMode) { root.dataset.flat = 'true'; if (flat) { flat.setAttribute('aria-pressed', 'true'); flat.textContent = 'Aktifkan tampilan 3D'; } }
  const status = root.querySelector('[data-entry-status]');
  if (status) status.textContent = 'Siap membuka workspace';
  cleanups.push(() => { reset(); if (dialog?.open) dialog.close(); document.body.style.overflow = ''; });
  return () => cleanups.forEach((cleanup) => cleanup());
}
