const express = require("express");
const res = require("express/lib/response");
const { Cars } = require('./models');
const multer = require("multer");
const path = require("path");
const { json } = require("express/lib/response");
const PUBLIC_DIRECTORY = path.join(__dirname, "public/uploud")
const port = process.env.PORT || 8019;
const app = express();
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//multer
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "./public/uploud"));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});

//EKSEKUSI
app.get("/cars", async (req, res) => {
    const mobil1 = await Cars.findAll();
    const car = []
    const n = mobil1.length
    for (let i = 0; i < n; i++) {
        car.push(mobil1[i].dataValues);
    }
    res.render("index", {
        car
    });
});

app.get("/cars/add", (req, res) => {
    res.render("addcar");
});
app.post('/cars/add',
    multer({ storage: diskStorage }).single("photo"),
    (req, res) => {
        // const file = req.file.path;
        Cars.create({
            name: req.body.name,
            size: req.body.size,
            rentPerDay: req.body.rentPerDay,
            // photo: req.file.filename 
            photo: req.file.filename
        })
            .then(() => {
                res.redirect(`http://localhost:${port}/cars`)
            })
        // res.redirect(200, "/add");
        // res.sendFile(file)
    })
app.post('/cars/add1',
    multer({ storage: diskStorage }).single("photo"),
    (req, res) => {
        // const file = req.file.path;
        Cars.create({
            name: req.body.name,
            size: req.body.size,
            rentPerDay: req.body.rentPerDay,
            // photo: req.file.filename 
            photo: req.file.filename
        })
            .then((car) => {
                res.json(car)
            })
        // res.redirect(200, "/add");
        // res.sendFile(file)
    })

app.get("/", async (req, res) => {
    const mobil = await Cars.findAll();
    const n = mobil.length
    for (let i = 0; i < n; i++) {
        console.log(mobil[i].dataValues);
    }
    // console.log(Cars.findAll().length);
    // console.log(mobil[1].length);
    res.json(mobil)
})
//UPDATE
app.get('/cars/update/:id', (req, res) => {
    Cars.findOne({
        where: { id: req.params.id }
    })
        .then(cars => {
            res.render("update", { cars })
        })
})

app.post('/cars/update/:id', multer({ storage: diskStorage }).single("photo"),
    (req, res) => {
        Cars.update({
            name: req.body.name,
            size: req.body.size,
            rentPerDay: req.body.rentPerDay,
            photo: req.file.filename
        }, {
            where: { id: req.params.id }
        })
            .then(() => {

                res.redirect((`http://localhost:${port}/cars`))

                // res.send(alert("Berhasil"))
            })
    })
app.put('/cars/update1/:id', multer({ storage: diskStorage }).single("photo"),
    (req, res) => {
        let array = []
        Cars.update({
            name: req.body.name,
            size: req.body.size,
            rentPerDay: req.body.rentPerDay,
            photo: req.file.filename
        }, {
            where: { id: req.params.id }
        })
            .then(() => {
                Cars.findOne({
                    where: { id: req.params.id }
                })
                    .then(cars => {
                        res.json(cars)
                    })
                // res.send(alert("Berhasil"))
            })
    })
//HAPUS
app.get("/cars/delete/:id", (req, res) => {
    Cars.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect(`http://localhost:${port}/cars`)
    })
})
app.get("/gas", (req, res) => {
    res.render("gas")
})

//Nampilin css,image dll
app.use(express.static(PUBLIC_DIRECTORY))
app.use(express.static(path.join(__dirname, "public")))
app.use("/public", express.static(__dirname + "/public"))
// app.use('/public/css', express.static(__dirname + '/public/css'))
// app.use('/public/image', express.static(__dirname + '/public/image'))
app.listen(port, () => console.log(`Listening on http://localhost:${port}/cars`));