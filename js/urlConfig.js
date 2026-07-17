function buildSortUrl() {
  const href = window.location.href;
  const dir = href.substring(0, href.lastIndexOf("/") + 1);
  return dir + "sort.html";
}

// btoa/atob only handle Latin1, so route through encodeURIComponent/decodeURIComponent
// to safely support card/category labels with non-ASCII characters (accents, em dashes, etc).
function encodeConfigToUrl(config) {
  const json = JSON.stringify(config);
  const utf8Bytes = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, function (_, hex) {
    return String.fromCharCode(parseInt(hex, 16));
  });
  const base64 = btoa(utf8Bytes);
  return buildSortUrl() + "#c=" + base64;
}

function decodeConfigFromUrl() {
  const match = window.location.hash.match(/#c=(.+)/);
  if (!match) return null;

  try {
    const utf8Bytes = atob(match[1]);
    const json = decodeURIComponent(Array.prototype.map.call(utf8Bytes, function (char) {
      return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}
