var fnProgress = function(file, bytes) {
    var percentage = (bytesLoaded / file.size) * 100;

    // Update DOM
    $('.progress').css({ 'width': percentage + '%' });
    $('.progressText').html(Math.round(percentage + "%");
}