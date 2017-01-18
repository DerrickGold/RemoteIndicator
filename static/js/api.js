var ApiObj = function() {}

ApiObj.prototype.apiCall = function(route, method, async, successCb, errorCb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200)
      if (successCb) successCb(xhttp.responseText);
    else if (xhttp.readyState == 4)
      if (errorCb) errorCb(xhttp.responseText);
  }
  xhttp.open(method, route, async);
  xhttp.send();
}
