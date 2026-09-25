---
hide:
  - toc
  - navigation
---

<div id="ceh-dash" class="ceh">

  <div class="ceh-top">
    <div>
      <h1 class="ceh-h1">Dashboard</h1>
      <p class="ceh-sub">Where the program stands, from logged sessions and evidence.</p>
    </div>
    <div class="ceh-clock">
      <span class="ceh-live" aria-hidden="true"></span>
      <span id="ceh-time" class="ceh-time">--:--</span>
      <span id="ceh-date" class="ceh-date"></span>
    </div>
  </div>

  <section class="ceh-panel ceh-route-panel" aria-label="Six-month route">
    <div class="ceh-panel-head">
      <h2>Route</h2>
      <span id="ceh-pos" class="ceh-pos"></span>
    </div>
    <ol id="ceh-route" class="ceh-route"></ol>
    <p id="ceh-next" class="ceh-next"></p>
  </section>

  <div id="ceh-kpis" class="ceh-kpis"></div>

  <section class="ceh-panel ceh-watch" id="ceh-timer" aria-label="Session stopwatch">
    <div class="ceh-watch-main">
      <div>
        <h2>Stopwatch</h2>
        <p class="ceh-muted" id="ceh-tstate">Not running</p>
      </div>
      <div class="ceh-telapsed" id="ceh-telapsed">00:00:00</div>
    </div>
    <div class="ceh-btns">
      <button id="ceh-start" class="ceh-btn ceh-btn-primary">Start</button>
      <button id="ceh-pause" class="ceh-btn" hidden>Pause</button>
      <button id="ceh-end" class="ceh-btn ceh-btn-primary" hidden>Finish</button>
      <button id="ceh-reset" class="ceh-btn ceh-btn-quiet" hidden>Reset</button>
    </div>
    <p id="ceh-tell" class="ceh-tell" hidden></p>
  </section>

  <section class="ceh-panel" aria-label="Study calendar">
    <div class="ceh-panel-head"><h2>Study calendar</h2><span class="ceh-muted ceh-small" id="ceh-heat-sum"></span></div>
    <div class="ceh-heat-scroll"><div id="ceh-heat" class="ceh-heat"></div></div>
    <div class="ceh-heat-key"><span>Less</span><i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i><span>More</span></div>
  </section>

  <section class="ceh-panel" aria-label="Topic coverage">
    <div class="ceh-panel-head">
      <h2>Topic coverage</h2>
      <div id="ceh-covmods" class="ceh-chips" role="group" aria-label="Module"></div>
    </div>
    <p id="ceh-covsum" class="ceh-covsum"></p>
    <div class="ceh-scroll"><table id="ceh-cov" class="ceh-cov"></table></div>
    <div class="ceh-key" id="ceh-covkey"></div>
  </section>

  <div class="ceh-two">
    <section class="ceh-panel" aria-label="Time by activity">
      <div class="ceh-panel-head"><h2>Time by activity</h2></div>
      <div class="ceh-rings-wrap">
        <svg id="ceh-rings" class="ceh-rings" viewBox="0 0 200 200" role="img" aria-label="Hours by activity"></svg>
        <ul id="ceh-legend" class="ceh-legend"></ul>
      </div>
    </section>

    <section class="ceh-panel" aria-label="Revision">
      <div class="ceh-panel-head"><h2>Revision due</h2></div>
      <div id="ceh-revise"></div>
      <div class="ceh-panel-head ceh-mt"><h2>Weak areas</h2></div>
      <div id="ceh-weak"></div>
    </section>
  </div>

  <section class="ceh-panel" aria-label="Domain health">
    <div class="ceh-panel-head">
      <h2>Domain health</h2>
      <div id="ceh-filters" class="ceh-chips" role="group" aria-label="Filter domains"></div>
    </div>
    <div id="ceh-domains" class="ceh-domains"></div>
    <div class="ceh-key" id="ceh-key"></div>
  </section>

  <section class="ceh-panel" aria-label="Recent sessions">
    <div class="ceh-panel-head"><h2>Recent sessions</h2><a class="ceh-link" href="../DAILY-LOG/">Daily log</a></div>
    <ol id="ceh-feed" class="ceh-feed"></ol>
  </section>

  <p id="ceh-foot" class="ceh-foot"></p>
</div>
