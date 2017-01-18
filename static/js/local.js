IndicatorLocal = function() {
  this.sessionID = null;
  this.indicatorBtn = document.querySelector('[role="indicate-btn"]');
  this.remoteUrl = document.querySelector('[role="remote-link"]');
  this.init();
}

IndicatorLocal.prototype = new ApiObj();

IndicatorLocal.prototype.init = function() {  
  var self = this;
  this.apiCall("/api/new", "GET", true, function(resp) {
    var result = JSON.parse(resp);
    if (result.status == 200) {
      self.sessionID = result.id;
      self.getState();
      self.remoteUrl.innerHTML = window.location.href + "remote?s=" + self.sessionID;
    }
    else {
      console.log("Critical! Failed to create a new session.");
    }
  });

  this.indicatorBtn.onclick = function(evt) {
    self.toggleState();
  }
}

IndicatorLocal.prototype.getState = function() {
  var self = this;
  if (this.sessionID === null) return;
  this.apiCall("/api/" + this.sessionID + "/state", "GET", true, function(resp) {
    var result = JSON.parse(resp);
    console.log("GETTING STATE");
    console.log(result);
    self.setButton(result.state===true);
  });
}

IndicatorLocal.prototype.toggleState = function() {
  var self = this;
  if (this.sessionID === null) return;
  this.apiCall("/api/" + this.sessionID + "/toggle", "GET", true, function(resp) {
    var result = JSON.parse(resp);
    console.log("TOGGLE STATE");
    console.log(result);
    self.setButton(result.newstate===true);
  });
}

IndicatorLocal.prototype.setButton = function(state) {
  this.indicatorBtn.classList.toggle("indicator-btn-on", state);
}
