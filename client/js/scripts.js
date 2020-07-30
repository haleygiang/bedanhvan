function getPronunication(id, text) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/api',
        data: { data: text },
        success:  response => {
            console.log(response.async);
            $("#" + id).html(`<audio controls class="d-none">
                                <source src="${response.async}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>`)
        },
        failure: response => console.log(response)
    })
}

function toggleAudio(id) {
    if ($("#" + id).find("audio").hasClass("d-none")) {
        $("#" + id).find("audio").removeClass("d-none");
    } else {
        $("#" + id).find("audio").addClass("d-none");
    }
}

getPronunication('audio-1', 'Cờ on con Gờ a ga huyền gà');
getPronunication('audio-2', 'Cờ on con Bờ o bo huyền bò');