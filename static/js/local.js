function CopyToClipboard(obj) {
  if (document.selection) { 
    var range = document.body.createTextRange();
    range.moveToElementText(obj);
    range.select().createTextRange();
    document.execCommand("Copy"); 
    
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(obj);
    window.getSelection().addRange(range);
    document.execCommand("Copy");
    
  }
  alert("Copied URL to clipboard.");
}

IndicatorLocal = function() {
  this.sessionID = null;
  this.indicatorBtn = document.querySelector('[role="indicate-btn"]');
  this.remoteUrl = document.querySelector('[role="remote-link"]');
  this.init();
}

IndicatorLocal.prototype = new ApiObj();

IndicatorLocal.prototype.init = function() {  
  var self = this;
  self.resizeDisplay();
  
  this.apiCall("/api/new", "GET", true, function(resp) {
    var result = JSON.parse(resp);
    if (result.status == 200) {
      self.sessionID = result.id;
      self.getState();

      var url = window.location.href + "remote?s=" + self.sessionID;
      self.remoteUrl.innerHTML = url;
    }
    else {
      console.log("Critical! Failed to create a new session.");
    }
  });

  self.indicatorBtn.onclick = function(evt) { self.toggleState(); }
  window.onresize = function() { self.resizeDisplay(); }

  self.remoteUrl.onclick = function(e) {
    e.preventDefault();
    CopyToClipboard(self.remoteUrl);
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

IndicatorLocal.prototype.resizeDisplay = function() {
  var dim = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;
  var size = parseInt(dim/2) + "px";
  this.indicatorBtn.style.fontSize = size;
  this.indicatorBtn.style.borderRadius = size;
  this.indicatorBtn.style.width = size;
}
