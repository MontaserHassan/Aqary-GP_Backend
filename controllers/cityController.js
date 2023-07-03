const mongoose = require('../config/database');
const City = require('../models/cityModel');

const insertCities = async (req, res) => {
    try {
        const cities = [
            // Add your list of cities here
            { "name": "Cairo" },
            { "name": "Alexandria" },
            { "name": "Giza" },
            { "name": "Shubra El-Kheima" },
            { "name": "Port Said" },
            { "name": "Suez" },
            { "name": "Luxor" },
            { "name": "Asyut" },
            { "name": "Ismailia" },
            { "name": "Fayoum" },
            { "name": "Zagazig" },
            { "name": "Aswan" },
            { "name": "Damietta" },
            { "name": "Damanhur" },
            { "name": "Minya" },
            { "name": "Beni Suef" },
            { "name": "Hurghada" },
            { "name": "Qena" },
            { "name": "Sohag" },
            { "name": "Shibin El Kom" },
            { "name": "Banha" },
            { "name": "Arish" },
            { "name": "Mallawi" },
            { "name": "10th of Ramadan City" },
            { "name": "Kafr El Sheikh" },
            { "name": "Dekernes" },
            { "name": "Jirja" },
            { "name": "Marsa Matruh" },
            { "name": "Desouk" },
            { "name": "Qalyub" },
            { "name": "Abu Kabir" },
            { "name": "Kafr El Dawwar" },
            { "name": "Girga" },
            { "name": "Akhmim" },
            { "name": "Bilbais" },
            { "name": "Manfalut" },
            { "name": "Damietta" },
            { "name": "Qift" },
            { "name": "Al Kharijah" },
            { "name": "New Cairo" },
            { "name": "Safaga" },
            { "name": "Al-Minya" },
            { "name": "El Tor" },
            { "name": "Samalut" },
            { "name": "Sharm El Sheikh" },
            { "name": "Bani Mazar" },
            { "name": "El Faiyum" },
            { "name": "Beni Mazar" },
            { "name": "Dahab" },
            { "name": "Mansoura" },
            { "name": "Kom Ombo" },
            { "name": "Isna" },
            { "name": "Port Fuad" },
            { "name": "Al Fayyum" },
            { "name": "Kafr Saad" },
            { "name": "Rafah" },
            { "name": "Tala" },
            { "name": "Edfu" },
            { "name": "Siwa Oasis" },
            { "name": "Al Khankah" },
            { "name": "Edko" },
            { "name": "Mandara" },
            { "name": "Isna" },
            { "name": "Al Matariyah" },
            { "name": "Al Qanayat" },
            { "name": "Al Saff" },
            { "name": "Badr" }

        ];

        const city = await City.insertMany(cities);
        res.json(city);
        console.log('Cities inserted successfully');
    } catch (error) {
        console.error('Error inserting cities:', error);
    } finally {
        mongoose.connection.close(); // Close the database connection
        console.log('Database connection closed');
    }
}


const getCities = async (req, res) => {
    try {
        const cities = await City.find();
        res.status(200).json(cities);
    } catch (error) {
        console.error('Error retrieving cities:', error);
        res.status(500).json({ error: 'An error occurred while retrieving cities' });
    }
};

module.exports = {
    insertCities,
    getCities,
};
