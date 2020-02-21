console.log("HEllo")

$.getJSON("http://127.0.0.1:5000/", function(data){
    $('p').append(data.Happy);
    console.log( "Data Loaded: " + data );
});


