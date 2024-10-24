console.log("dupa")

document.querySelector("html").ondragover = function (e) {
    console.log("dragover nad dokumentem html")
    e.preventDefault(); // usuwa domyślne zachowanie strony po wykonaniu zdarzenia, warto zakomentować i sprawdzić
    e.stopPropagation(); // zatrzymuje dalszą propagację zdarzenia, warto zakomentować i sprawdzić
}


document.querySelector("html").ondrop = function (e) {
    console.log("drop na dokumencie html")
    e.preventDefault();
    e.stopPropagation();
}


document.querySelector("#div").ondragenter = function (e) {
    console.log("drag enter na divie")
    e.stopPropagation();
    e.preventDefault();
}


document.querySelector("#div").ondragover = function (e) {
    console.log("drag over na divie")
    e.stopPropagation();
    e.preventDefault();
}

document.querySelector("#div").ondragleave = function (e) {
    console.log("dragleave na divie")
    e.stopPropagation();
    e.preventDefault();

}

document.querySelector("#div").ondrop = function (e) {

    div = document.getElementById("div")
    div.innerHTML = ""
    console.log("drop na divie")
    e.stopPropagation();
    e.preventDefault();

    const files = Array.from(event.dataTransfer.files)
    let fd = new FormData()
    files.forEach(file => {
        if (file.type == 'audio/mpeg') {
            div.innerHTML += `${file.name} <br>`
            fd.append('audio', file)
        }
        else if (file.type == 'image/png' || file.type == 'image/jpeg') {
            div.innerHTML += `${file.name} <br>`
            fd.append('cover', file)
        }
    });
    const body = fd

    fetch("http://localhost:3000/upload", { method: "post", body, })
        .then(response => response.json())
        .then(response => {

            console.log(response)
        }
        )


    // teraz utwórz obiekt FormData zastępujący formularz - patrz poprzednie lekcje z uploadem
    // oraz dodaj do niego po kolei wszystkie pliki z powyższej listy files
    // na koniec użyj dowolnej technologii do uploadu pliku/ów - patrz poprzednie lekcje

}