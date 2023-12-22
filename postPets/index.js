const mongo = require('../db');

// untuk menambahkan data atau seeding
async function postPets() {
    try {
        const db = await mongo.connect();
        console.log("Inserting data...");

        //fill data
        await db
            .collection("pets")
            .insertMany([
                {
                    id: 1,
                    type : "Cat",
                    color : "Gray",
                    size : "Small",
                    gender : "Male",
                    status : "available"
                },
                {
                    id: 2,
                    type : "Rabbit",
                    color : "White",
                    size : "Small",
                    gender : "Female",
                    status : "available"
                },
                {
                    id: 3,
                    type : "Dog",
                    color : "Black",
                    size : "Big",
                    gender : "Male",
                    status : "available"
                },
            ]);
       

        //close koneksi db 
        await mongo.disconnect()
    } catch (error) {
        console.log(error);
    }
}

postPets()