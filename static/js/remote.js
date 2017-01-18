IndicatorRemote = function(sessionid) {
  this.pollingTime = 5000;
  this.sessionID = sessionid;
  this.indicator = document.querySelector('[role="remote-indicator"]');
  this.init();
}

IndicatorRemote.prototype = new ApiObj();

IndicatorRemote.prototype.init = function() {
  var self = this;
  if (!this.sessionID) return;
  self.resizeDisplay();
  self.getState();
  setInterval(function() {
    self.getState();
  }, this.pollingTime);

  window.onresize = function() {
    self.resizeDisplay();
  }
}


IndicatorRemote.prototype.getState = function() {
  var self = this;
  if (this.sessionID === null) return;
  this.apiCall("/api/" + this.sessionID + "/state", "GET", true, function(resp) {
    var result = JSON.parse(resp);
    console.log("GETTING STATE");
    console.log(result);
    self.updateDisplay(result.state===true);
  });
}

IndicatorRemote.prototype.updateDisplay = function(state) {
  this.indicator.classList.toggle("remote-indicator-on", state);
}

IndicatorRemote.prototype.resizeDisplay = function() {
  var dim = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;
  var size = parseInt(dim/2) + "px";
  this.indicator.style.fontSize = size;
  this.indicator.style.borderRadius = size;
  this.indicator.style.width = size;
}
