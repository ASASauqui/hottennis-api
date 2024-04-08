const Address = require('../schemas/address.schema');


const getAddresses = async (req, res) => {
    const { user } = req;
    try {
        const addresses = await Address.find({ user: user._id });
        
        res.json(addresses);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting addresses'
        });
    }
}

const createAddress = async (req, res) => {
    const { user } = req;
    const { name, address, city, state, country, zip, phone } = req.body;

    if(!name || !address || !city || !state || !country || !zip || !phone) {
        return res.status(400).json({
            message: 'Missing required fields( name, address, city, state, country, zip, phone )'
        });
    }

    try {
        const new_address = new Address({
            name: name,
            address: address,
            city: city,
            state: state,
            country: country,
            zip: zip,
            phone: phone,
            user: user._id
        });

        await new_address.save();

        res.json(new_address);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error creating address'
        });
    }
}

const deleteAddress = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const address = await
        Address.findOneAndDelete({ _id: id, user: user._id });

        if(!address) {
            return res.status(404).json({
                message: 'Address not found'
            });
        }

        res.json(address);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error deleting address'
        });
    }
}

module.exports = {
    getAddresses,
    createAddress,
    deleteAddress
};