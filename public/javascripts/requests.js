let requestManager = {
  defaultUrl: "http://localhost:3000/",
  get: function(url, callback){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if(this.readyState = 4 && this.status == 200){
        callback(this.responseText);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  },

  post: function(data, url, callback){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if(this.readyState = 4 && this.status == 200){
        callback(this.responseText);
      }
    };
    xhttp.open("POST", url, true);
    xhttp.send();
  }
}
