const mongo = require('../db');

//fungsi memasukkan data ke table pets
async function insertData(pets) {
    
    let dataPet; 

    try {
        const db = await mongo.connect();
        console.log("Inserting data...");

        //mengisi data pet ke table pets
        let dataP = await db.collection('pets').insertMany(pets);   
        dataPet = await db.collection('pets').findOne({_id: dataP.insertedIds[0]});  
        return dataPet  
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

//fungsi mengambil data dari table pets
async function fetchData( searchField, search ) {
    try {
        const db = await mongo.connect();
        
        if (searchField && search) {
            return await db
            .collection("pets")
            //penggunaan [] pada key di find, untuk mengekstrasi value dari variabel untuk dijadikan key
            .find( { [searchField]:  new RegExp(search, 'i')}, { projection: {} })
            .toArray();
        } else {
            return await db
            .collection("pets")
            .find({}, { projection: {} })
            .toArray();
        }
        //mengambil seluruh data pet dari table pets
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

//fungsi mengambil 1 data dari table pets
async function fetchOneData( id ) {
    try {
        const db = await mongo.connect();

        return await db
            .collection("pets")
            .findOne({id: id}, { projection: {} })
        
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

//fungsi mengupdate data di table books
async function updateData(pet) {

    try {
        const db = await mongo.connect();
        console.log("Update data...");

        await db.collection("pets").updateOne(
            { id: pet.id },
            {
                $set: {
                    type : pet.type,
                    status : pet.status
                }
            }
        )
        return "data updated"
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

async function deleteData(id) {

    try {
        const db = await mongo.connect();
        console.log("Delete data...");

        await db.collection("pets").deleteOne(
            { id: id }
        )
        return "data deleted"
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}
//mengekspor fungsi-fungsi agar dapat dipakai di file lain yang mengimport book
module.exports = { insertData, fetchData, updateData, fetchOneData, deleteData }