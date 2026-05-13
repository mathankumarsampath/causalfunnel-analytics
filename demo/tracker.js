(function () {
  // ─── CONFIG ─────────────────────────────────────────
  const API_URL = "http://localhost:5000";

  // ─── SESSION MANAGEMENT ─────────────────────────────
  function getSessionId() {
    let sessionId = localStorage.getItem("cf_session_id");
    if (!sessionId) {
      sessionId =
        "sess_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substr(2, 9);
      localStorage.setItem("cf_session_id", sessionId);
    }
    return sessionId;
  }

  // ─── GET ELEMENT DETAILS ────────────────────────────
  // Captures useful info about what was clicked
  function getElementDetails(element) {
    // Walk up the DOM tree to find meaningful element
    // Example: if user clicks text inside a button
    // we want the button details not the text span
    let target = element;
    let depth = 0;

    while (target && depth < 5) {
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.getAttribute("role") === "button" ||
        target.onclick
      ) {
        break;
      }
      target = target.parentElement;
      depth++;
    }

    // Fall back to original element if nothing found
    if (!target) target = element;

    return {
      element_tag: target.tagName || null,
      element_text: target.innerText
        ? target.innerText.trim().substring(0, 100)
        : null,
      element_id: target.id || null,
      element_class: target.className || null,
    };
  }

  // ─── SEND EVENT TO BACKEND ──────────────────────────
  function sendEvent(eventType, extraData = {}) {
    const payload = {
      session_id: getSessionId(),
      event_type: eventType,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      ...extraData,
    };

    fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) =>
        console.log("Event tracked:", eventType, extraData, data)
      )
      .catch((err) => console.error("Tracking error:", err));
  }

  // ─── TRACK PAGE VIEW ────────────────────────────────
  sendEvent("page_view", {
    x: null,
    y: null,
    element_tag: null,
    element_text: null,
    element_id: null,
    element_class: null,
  });

  // ─── TRACK CLICKS ───────────────────────────────────
  document.addEventListener("click", function (event) {
    const x = Math.round(event.pageX);
    const y = Math.round(event.pageY);
    const elementDetails = getElementDetails(event.target);

    sendEvent("click", {
      x,
      y,
      ...elementDetails,
    });
  });

  console.log("CausalFunnel tracker loaded ✅");
})();