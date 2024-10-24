let http = require('http');
let fs = require('fs');
let qs = require('querystring');
let path = require('path');
let Datastore = require('nedb')
let formidable = require('formidable')
let collection = new Datastore({
    filename: 'db.db',
    autoload: true
})

let server = http.createServer(function (req, res) {

    if (req.url.includes(".mp3")) {
        console.log("mp3")
        console.log(req.url)
        let pathh = decodeURI(req.url);
        let stats = fs.statSync(path.join(__dirname, pathh))
        fs.readFile(path.join(__dirname, pathh), function (error, data) {
            res.writeHead(200, {
                "Content-Type": "audio/mpeg",
                "Content-Length": stats.size,
                "Accept-Ranges": "bytes"
            });
            res.write(data);
            res.end();
        })
    } //stack overflow + SPEC oszczędzają czas XD

    if (req.url.includes(".jpg") || req.url.includes(".png")) {
        console.log("zdj")
        let pathh = decodeURI(req.url);
        fs.readFile(path.join(__dirname, pathh), (err, data) => {
            res.writeHead(200, { 'content-type': 'image/jpeg' })
            res.write(data)
            res.end()
        })


    } //stack overflow + SPEC oszczędzają czas XD
    switch (req.method) {


        case 'GET':

            if (req.url == "/admin") {
                fs.readFile("./admin.html", function (err, data) {

                    res.writeHead(200, { 'content-type': 'text/html' })
                    res.write(data)
                    res.end()
                })
            }
            if (req.url == "/admin.js") {
                fs.readFile("./admin.js", function (err, data) {
                    console.log("js")
                    res.writeHead(200, { 'content-type': 'application/javascript' })
                    res.write(data)
                    res.end()
                })
            }


            break;

        case 'POST':
            // let allData = "";
            // req.on("data", function (data) {
            //     console.log("data: " + data);
            //     allData += data;
            // })

            if (req.url == "/upload") {

                // sprawdza czy katalog istnieje
                dir = Math.random() * 100000
                if (!fs.existsSync(`./static/mp3/${dir}`)) {
                    fs.mkdirSync(`./static/mp3/${dir}`)
                }
                // tworzy katalog 
                let form = formidable({
                    keepExtensions: true,
                    multiples: true,
                    // ścieżka, w której zapiszesz
                    uploadDir: `./static/mp3/${dir}`
                })

                form.parse(req, (err, fields, files) => {
                    console.log(files);

                    if (files.cover) {
                        console.log("powinien sie wczytać zuploadowany")

                        fs.rename(files.cover.path, `./static/mp3/${dir}/cover.jpg`, function (err) {
                            if (err) console.log(err)
                            console.log("rename ok")
                        });

                    }
                    else {
                        fs.copyFileSync(`./default.jpg`, `./static/mp3/${dir}/cover.jpg`)
                    }

                    for (file of files.audio) {
                        fs.rename(file.path, `./static/mp3/${dir}/${file.name}`, function (err) {
                            if (err) console.log(err)
                            console.log("rename ok")
                        });

                    }

                    // fs.rename("old_file_path.txt", "new_file_path.txt", function (err) {
                    //     if(err) console.log(err)
                    //     console.log("rename ok")
                    //  });

                });

                res.setHeader("Access-Control-Allow-Origin", "*")
                res.writeHead(200, { 'content-type': 'application/json' })
                res.end(JSON.stringify({ siema: "siema" }))


            }



            if (req.url == "/first") {
                fs.readdir(path.join(__dirname, "/static/mp3"), (error, paths) => {
                    let plateFiles = []
                    let plateNames = []
                    for (directory of paths) {
                        plateNames.push([directory, `http://localhost:3000/static/mp3/${directory}/cover.jpg`])
                        console.log(directory)
                    }
                    fs.readdir(path.join(__dirname, `/static/mp3/${plateNames[0][0]}`), (error, files) => {
                        console.log(files)
                        for (plates of files) {
                            let stats = fs.statSync(path.join(__dirname, `/static/mp3/${plateNames[0][0]}`, plates))
                            if (plates.includes(".mp3")) {
                                plateFiles.push({ file: plates, size: stats.size, album: plateNames[0][0], src: `localhost:3000/static/mp3/${plateNames[0][0]}/${plates}` })
                            }

                        }
                        res.setHeader("Access-Control-Allow-Origin", "*")
                        res.writeHead(200, { "content-type": "application/json" }) // z
                        res.end(JSON.stringify({ albums: plateNames, files: plateFiles, }));
                    })

                });

            }
            if (req.url == "/next") {


                let allData = "";
                req.on("data", function (data) {
                    allData += data;
                })

                req.on("end", function (data) {
                    if (allData == "playlist") {

                        let toSend = []

                        collection.find({}, function (err, docs) {


                            //console.log(doc)

                            for (doc of docs) {
                                toSend.push(JSON.parse(doc.contains))
                            }
                            console.log(toSend)
                            res.setHeader("Access-Control-Allow-Origin", "*")
                            res.writeHead(200, { "content-type": "application/json" })
                            res.end(JSON.stringify({ files: toSend, }))
                        });


                    }
                    else {


                        console.log(allData)
                        let plate = allData
                        let platePath = path.join(__dirname, `/static/mp3/${plate}`)
                        fs.readdir(platePath, (error, files) => {
                            let plateFiles = []

                            for (file of files) {

                                let stats = fs.statSync(path.join(__dirname, `/static/mp3/${plate}`, file))

                                if (file.includes(".mp3")) {
                                    plateFiles.push({ file: file, size: stats.size, album: plate, src: `localhost:3000/static/mp3/${plate}/${file}` })
                                }
                            }
                            console.log(plateFiles)
                            res.setHeader("Access-Control-Allow-Origin", "*")
                            res.writeHead(200, { "content-type": "application/json" })// z

                            res.end(JSON.stringify({ files: plateFiles, })
                            );
                        });
                    }
                })


            }
            if (req.url == "/addNdb") {

                let allData = "";
                req.on("data", function (data) {
                    allData += data;
                })
                req.on("end", function (data) {
                    let jstoobj = {
                        contains: allData
                    }
                    collection.insert(jstoobj)
                })

            }


            break;
    }
});

server.listen(3000);
