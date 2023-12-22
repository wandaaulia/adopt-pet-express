// ctrl + ` => memunculkan terminal

const express = require('express')
const app = express();
const port = 4200;

//import file book yang berisikan fungsi2 yang diexport
const pet = require('./model/pet')

// membuat express dapat menerima request body berupa JSON
app.use(express.json())

// curl -X GET http://localhost:3000/
app.get("/", (req, res) => {
    res.send("Hello World!");
});


// curl -X GET http://localhost:3000/books
// jika pakai postman gunakan http://localhost:3000/books saja
app.get("/pets", async (req, res) => {
    //mengambil query yang dikirim
    const { searchField, search } = req.query

    //mengambil data dengan fungsi fetchData
    const pets = await pet.fetchData(searchField, search);

    res.json(pets);
})

/** 
  Request Parameters
  ada 2 jenis:
  1. Path parameters ditandai dengan simbol :nama_param
  2. Query parameters ditandai dengan simbol ?nama_param=value
*/
// curl -X GET http://localhost:3000/books/1


app.get("/pets/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    const _pet = await pet.fetchOneData(id);

    //jika buku tidak ada
    if (_pet === null) {
        // HTTP Status bisa baca di https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        res.status(404)
        res.json('pet not found')
        return
    }

    res.json(_pet);
})

// curl -X POST http://localhost:3000/books --header "Content-Type: application/json" --data '{"title": "test", "author": "test"}'
app.post("/pets", async (req, res) => {
    /** 
      Request body bisa diakses dari req.body
      request body bisa bermacam2 jenis, bisa json, bisa form, bisa xml, bisa plain text.
      Di ekspress perlu menginisiasi support tambahan untuk masing-masing jenis request body, seperti diatas
    */
    try {
        const pets = req.body

        for (let i = 0; i < pets.length; i++) {
            const type = pets[i].type
            if (!type || type === "") {
                res.status(422).send("type must be filled!")
                return
            }
            const color = pets[i].color
            if (!color || color === "") {
                res.status(422).send("color must be filled!")
                return
            }
            const size = pets[i].size
            if (!size || size === "") {
                res.status(422).send("size must be filled!")
                return
            }
            const gender = pets[i].gender
            if (!gender || gender === "") {
                res.status(422).send("gender must be filled!")
                return
            }
        }



        const _pets = await pet.insertData(pets)

        res.status(201)
        res.json({status: "Created", data: _pets});
    } catch (error) {
        res.status(422)
        res.json(`buku dengan id tersebut sudah ada`)
    }
})

// Untuk mencoba melihat response api ketika memangngil route "/"
// curl -X PUT http://localhost:3000/books/1 --header "Content-Type: application/json" --data '{"title": "The book of lost things, again"}'
app.put("/pets/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const { type, status } = req.body
    try {

        //pengecekan tipe pet dan status adopsi 
        if (type === "") {
            res.status(422)
            res.json("type can't be empty if updated!")
            return
        }

        if (status === "") {
            res.status(422)
            res.json("status can't be empty if updated!")
            return
        }

        // mencari buku terlebih dahulu yang mau diupdate

        const thatPet = await pet.fetchOneData(id)

        //cek jika bukunya tidak ada, memakai array indeks pertama karena hasil fetch data berupa to array
        if (!thatPet) {
            res.status(404)
            res.json("Pet not found!")
            return
        }

        // di validasi dulu apakah author diberikan di req.body, kalau tidak, tidak perlu di update biar tidak null hasilnya
        if (type) {
            thatPet.type = type
        }

        // title di validasi dulu apakah title diberikan di req.body, kalau tidak, tidak perlu di update biar tidak null hasilnya
        if (status) {
            thatPet.status = status
        }

        await pet.updateData(thatPet)

        res.json(thatPet);
    } catch (error) {
        res.status(422)
        console.log('error', error)
        res.json('tidak dapat update pet')
    }

})

// Untuk mencoba melihat response api ketika memangngil route "/"
// curl -X DELETE http://localhost:3000/books/1
app.delete("/pets/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        // mencari pet terlebih dahulu yang mau diupdate
        const thatPet = await pet.fetchOneData(id)

        //cek jika petnya tidak ada, memakai array indeks pertama karena hasil fetch data berupa to array
        if (!thatPet) {
            res.status(404)
            res.json("Pet not found!")
            return
        }

        await pet.deleteData(id)
        res.json(pet);
    } catch (error) {
        res.status(422)
        res.json('tidak dapat delete Pet')
    }

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});