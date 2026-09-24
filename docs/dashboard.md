---
hide:
  - toc
---

# Dashboard

<div id="ceh-dash" class="ceh">
  <div class="ceh-clock">
    <div id="ceh-time" class="ceh-time">--:--:--</div>
    <div id="ceh-date" class="ceh-date">Loading…</div>
  </div>

  <div id="ceh-timer" class="ceh-timer">
    <div class="ceh-tlabel" id="ceh-tstate">No session running</div>
    <div class="ceh-telapsed" id="ceh-telapsed">00:00:00</div>
    <div class="ceh-tbtns">
      <button id="ceh-start" class="md-button md-button--primary">Start session</button>
      <button id="ceh-pause" class="md-button" hidden>Pause</button>
      <button id="ceh-end" class="md-button md-button--primary" hidden>End session</button>
      <button id="ceh-discard" class="md-button ceh-danger" hidden>Discard</button>
    </div>
    <div id="ceh-logform" class="ceh-logform" hidden>
      <p class="ceh-tlabel">Session finished: <b id="ceh-ftotal"></b> min. Split the minutes, then open the GitHub form and press Submit. If your phone offers to open the GitHub app, choose the browser.</p>
      <label>Session <input id="ceh-fsession" maxlength="20"></label>
      <label>Domain <select id="ceh-fdomain"></select></label>
      <label>Topic <input id="ceh-ftopic" maxlength="120"></label>
      <div class="ceh-fsplit">
        <label>Theory <input id="ceh-fm-theory" type="number" min="0" max="600" inputmode="numeric"></label>
        <label>Lab <input id="ceh-fm-lab" type="number" min="0" max="600" inputmode="numeric"></label>
        <label>Troubleshooting <input id="ceh-fm-troubleshooting" type="number" min="0" max="600" inputmode="numeric"></label>
        <label>Project <input id="ceh-fm-project" type="number" min="0" max="600" inputmode="numeric"></label>
      </div>
      <p id="ceh-fsum" class="ceh-tlabel"></p>
      <label>Result (one line) <input id="ceh-fresult" maxlength="200"></label>
      <div class="ceh-tbtns">
        <button id="ceh-submit" class="md-button md-button--primary">Open GitHub form</button>
        <button id="ceh-clear" class="md-button">Logged — clear timer</button>
      </div>
    </div>
  </div>

  <div id="ceh-now" class="ceh-now"></div>

  <div class="ceh-cards">
    <div class="ceh-card"><div class="ceh-num" id="ceh-total">–</div><div class="ceh-lbl">Total hours</div></div>
    <div class="ceh-card"><div class="ceh-num" id="ceh-week">–</div><div class="ceh-lbl">This week</div></div>
    <div class="ceh-card"><div class="ceh-num" id="ceh-sessions">–</div><div class="ceh-lbl">Sessions</div></div>
    <div class="ceh-card"><div class="ceh-num" id="ceh-started">–</div><div class="ceh-lbl">Domains started</div></div>
  </div>

  <h2>Weekly hours</h2>
  <div id="ceh-weeks" class="ceh-weeks"></div>

  <h2>Time by activity</h2>
  <div id="ceh-cats" class="ceh-cats"></div>

  <h2>Domains</h2>
  <div class="ceh-scroll"><table id="ceh-domains" class="ceh-table"></table></div>

  <h2>Recent sessions</h2>
  <div id="ceh-recent"></div>

  <h2>Weak areas</h2>
  <div id="ceh-weak"></div>

  <p id="ceh-foot" class="ceh-foot"></p>
</div>
