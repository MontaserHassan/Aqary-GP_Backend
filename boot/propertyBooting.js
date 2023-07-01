const Property = require('../models/propertyModel');

const deletePropertiesWithCurrentEndTime = async () => {
    const currentTime = new Date();
    // console.log(`Current Time: ${currentTime}`);
    try {
        const deletedProperties = await Property.deleteMany({ endTime: { $lte: currentTime } });
        console.log(`${deletedProperties.deletedCount} properties deleted.`);
    } catch (error) {
        console.log(`Error deleting properties: ${error}`);
    }
};

deletePropertiesWithCurrentEndTime();