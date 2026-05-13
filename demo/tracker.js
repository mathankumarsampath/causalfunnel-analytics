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

  // ─── EVENT INDEX MANAGEMENT ─────────────────────────
  function getNextEventIndex() {
    let currentIndex =
      parseInt(localStorage.getItem("cf_event_index")) || 0;

    currentIndex += 1;

    localStorage.setItem("cf_event_index", currentIndex);

    return currentIndex;
  }

  // ─── DETECT DEVICE TYPE ─────────────────────────────
  function getDeviceType() {
    const width = window.innerWidth;

    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";

    return "desktop";
  }

  // ─── GET ELEMENT DETAILS ────────────────────────────
  function getElementDetails(element) {
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

    if (!target) target = element;

    return {
      element_tag: target.tagName || null,

      element_text: target.innerText
        ? target.innerText.trim().substring(0, 100)
        : null,

      element_id: target.id || null,

      element_class:
        typeof target.className === "string"
          ? target.className
          : null,
    };
  }

  // ─── SEND EVENT TO BACKEND ──────────────────────────
  function sendEvent(eventType, extraData = {}) {
    const payload = {
      session_id: getSessionId(),
      event_index: getNextEventIndex(),

      event_type: eventType,

      page_url: window.location.href,
      page_title: document.title,

      timestamp: new Date().toISOString(),

      // Viewport tracking
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,

      // Screen tracking
      screen_width: window.screen.width,
      screen_height: window.screen.height,

      // Scroll tracking
      scroll_x: window.scrollX,
      scroll_y: window.scrollY,

      // Device/browser info
      device_type: getDeviceType(),
      language: navigator.language,
      user_agent: navigator.userAgent,


      ...extraData,
    };

    fetch(`${API_URL}/api/events`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        // Event successfully tracked
      })
      .catch((err) =>
        console.error("Tracking error:", err)
      );
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

})();