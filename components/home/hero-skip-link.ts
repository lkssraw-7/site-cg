/** Only explicit skip-link activation may seek the Hero.
 * Focusing <main> (e.g. clicking a canvas inside it) must never change scroll.
 */
export function bindHeroSkipLink(link: HTMLAnchorElement, reveal: () => void) {
  const activate = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    reveal();
  };
  link.addEventListener('click', activate);
  return () => link.removeEventListener('click', activate);
}
