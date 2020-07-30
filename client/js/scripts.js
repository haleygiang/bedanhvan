function getPronunication(text) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/api',
        data: { data: text },
        success:  response => console.log(response),
        failure: response => console.log(response)
    })
}