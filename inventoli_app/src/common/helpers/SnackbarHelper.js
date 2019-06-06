let toggleSnackbar

function setToggleSnackbar (toggleSnackbarParam) {
  toggleSnackbar = toggleSnackbarParam
}

function toggle (message, snackbarDuration, snackbarButtonText, snackbarFunction, snackbarButtonColor) {
  if (toggleSnackbar) toggleSnackbar(message, snackbarDuration, snackbarButtonText, snackbarFunction, snackbarButtonColor)
}

module.exports = {
  setToggleSnackbar: setToggleSnackbar,
  toggle: toggle,
}
