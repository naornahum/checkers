// UTIL Function for all of our needs

/**
 * Checkes if a element is empty
 *
 * @param {HTMLElement} element
 * @returns
 */
function isEmpty(element) {
  return (
    !element.classList.contains(BLACK_PLAYER) &&
    !element.classList.contains(WHITE_PLAYER)
  );
}

/**
 * Removes all classes and inner html from element given
 *
 * @param {HTMLElement} element
 */
function emptyElement(element) {
  element.classList.remove(...element.classList);
  element.innerHTML = "";
}
