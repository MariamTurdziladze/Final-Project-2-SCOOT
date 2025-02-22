(function () {
  function getQueryStringParams() {
    const params = {};
    const url = new URL(document.currentScript.src);
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  const allowedButtonColors = [
    "black",
    "blue",
    "green",
    "orange",
    "red",
    "violet",
    "white",
    "yellow",
  ];

  function validateButtonColor(color) {
    return allowedButtonColors.includes(color.toLowerCase()) ? color : "black";
  }
})();