/*
 * FlightKiosk embed loader — drop one line on any website:
 *
 *   <script src="https://YOUR-APP/embed.js" data-ref="your-shop" async></script>
 *
 * It injects a responsive <iframe> of the flight-search widget, tracked by the
 * `data-ref` shop. Optional `data-target="#css-selector"` mounts it into a
 * specific element instead of right after the script tag.
 */
(function () {
  var script = document.currentScript;
  if (!script) return;

  var origin;
  try {
    origin = new URL(script.src).origin;
  } catch (e) {
    return;
  }

  var ref = script.getAttribute("data-ref") || "";
  var qs = ref ? "?ref=" + encodeURIComponent(ref) : "";

  var iframe = document.createElement("iframe");
  iframe.src = origin + "/embed" + qs;
  iframe.title = "Flight search";
  iframe.loading = "lazy";
  iframe.setAttribute("scrolling", "no");
  iframe.style.cssText =
    "width:100%;border:0;overflow:hidden;display:block;height:260px;max-width:960px;margin:0 auto;";

  var targetSel = script.getAttribute("data-target");
  var mount = targetSel ? document.querySelector(targetSel) : null;
  if (mount) mount.appendChild(iframe);
  else if (script.parentNode)
    script.parentNode.insertBefore(iframe, script.nextSibling);

  // Auto-resize from the widget's height messages (same-origin only).
  window.addEventListener("message", function (e) {
    if (e.origin !== origin) return;
    var d = e.data || {};
    if (d.type === "flightkiosk:height" && typeof d.height === "number") {
      iframe.style.height = Math.max(200, d.height) + "px";
    }
  });
})();
