// set date values on footer

var URL
// handle case where no index.html is specified in url
if (document.URL.split("/").slice(-2)[0] =='derbyshire' &
    document.URL.split("/").slice(-1)[0] == '') {
    URL = "index.html"
}
else {
    URL = document.URL.split("/").slice(-1)[0]
}




