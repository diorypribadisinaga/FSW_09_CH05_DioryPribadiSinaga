const express = require("express");
const res = require("express/lib/response");
const { Cars } = require('./models');
const { Size } = require('./models');
const multer = require("multer");
const path = require("path");

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
    Cars.findAll({
        order: ["createdAt"]
    }).then((cars) => {
        res.render("index", {
            cars
        });
    })

});

app.get("/cars/small", async (req, res) => {
    Cars.findAll({
        where: { size: "small" }
    }).then((cars) => {
        res.render('index', { cars })
    })
});

app.get("/cars/small1", async (req, res) => {
    Cars.findAll({
        where: { size: "small" }
    }).then((cars) => {
        res.json(cars)
    })
});

app.get("/cars/medium", async (req, res) => {
    Cars.findAll({
        where: { size: "medium" }
    }).then((cars) => {
        res.render('index', { cars })
    })
});
app.get("/cars/large", async (req, res) => {
    Cars.findAll({
        where: { size: "large" }
    }).then((cars) => {
        res.render('index', { cars })
    })
});

app.get("/cars/add", (req, res) => {
    res.render("addcar1");
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
            .then((car) => {
                let id_mobil = car.dataValues.id
                Size.create({
                    id_mobil: id_mobil,
                    size: req.body.size
                })
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
                let id_mobil = car.dataValues.id
                Size.create({
                    id_mobil: id_mobil,
                    size: req.body.size
                })
                res.json(car)
            })
        // res.redirect(200, "/add");
        // res.sendFile(file)
    })

app.get("/", async (req, res) => {
    Cars.findAll({

    }).then((cars) => {
        res.json(cars)
    })
})
//UPDATE
app.get('/cars/update/:id', async (req, res) => {
    Cars.findOne({
        where: { id: req.params.id }
    })
        .then(cars => {
            res.render("edit", { cars })
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
                Size.update({
                    size: req.body.size
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                res.redirect((`http://localhost:${port}/cars`))
                // res.send(alert("Berhasil"))
            })
    })
app.put('/cars/update1/:id', multer({ storage: diskStorage }).single("photo"),
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
        // id_mobil = req.params.id
        // console.log(id_mobil);
        Size.destroy({
            where: {
                id_mobil: req.params.id
            }
        })
        res.redirect(`http://localhost:${port}/cars`)
    })
})
// app.get("/contoh", (req, res) => {
//     res.render("contoh")
// })

//Nampilin css,image dll
app.use(express.static(PUBLIC_DIRECTORY))
app.use(express.static(path.join(__dirname, "public")))
app.use("/public", express.static(__dirname + "/public"))
app.use("/public/uploud", express.static(__dirname + "/public/uploud"))
// app.use('/public/css', express.static(__dirname + '/public/css'))
// app.use('/public/image', express.static(__dirname + '/public/image'))
app.listen(port, () => console.log(`Listening on http://localhost:${port}/cars`));