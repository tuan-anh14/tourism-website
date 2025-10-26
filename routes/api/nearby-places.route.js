const express = require('express');
const router = express.Router();

// Import models
const Entertainment = require('../../model/Entertainment');
const Attraction = require('../../model/Attraction');
const Accommodation = require('../../model/Accommodation');
const CuisinePlace = require('../../model/CuisinePlace');

// Helper function to get model by type
function getModelByType(type) {
  switch (type) {
    case 'entertainment':
      return Entertainment;
    case 'attraction':
      return Attraction;
    case 'accommodation':
      return Accommodation;
    case 'cuisine':
      return CuisinePlace;
    default:
      throw new Error('Invalid type');
  }
}

// GET /api/nearby-places/:currentType/:currentId/cuisine
router.get('/:currentType/:currentId/cuisine', async (req, res) => {
  try {
    const { currentType, currentId } = req.params;
    const { radius = 5, limit = 6 } = req.query;
    
    const currentModel = getModelByType(currentType);
    const nearbyPlaces = await currentModel.findNearbyCuisinePlaces(
      currentId, 
      parseFloat(radius), 
      parseInt(limit)
    );
    
    res.json(nearbyPlaces);
  } catch (error) {
    console.error('Error fetching nearby cuisine places:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nearby-places/:currentType/:currentId/accommodation
router.get('/:currentType/:currentId/accommodation', async (req, res) => {
  try {
    const { currentType, currentId } = req.params;
    const { radius = 5, limit = 6 } = req.query;
    
    const currentModel = getModelByType(currentType);
    const nearbyPlaces = await currentModel.findNearbyAccommodations(
      currentId, 
      parseFloat(radius), 
      parseInt(limit)
    );
    
    res.json(nearbyPlaces);
  } catch (error) {
    console.error('Error fetching nearby accommodations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nearby-places/:currentType/:currentId/attraction
router.get('/:currentType/:currentId/attraction', async (req, res) => {
  try {
    const { currentType, currentId } = req.params;
    const { radius = 5, limit = 6 } = req.query;
    
    const currentModel = getModelByType(currentType);
    const nearbyPlaces = await currentModel.findNearbyAttractions(
      currentId, 
      parseFloat(radius), 
      parseInt(limit)
    );
    
    res.json(nearbyPlaces);
  } catch (error) {
    console.error('Error fetching nearby attractions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nearby-places/:currentType/:currentId/entertainment
router.get('/:currentType/:currentId/entertainment', async (req, res) => {
  try {
    const { currentType, currentId } = req.params;
    const { radius = 5, limit = 6 } = req.query;
    
    const currentModel = getModelByType(currentType);
    const nearbyPlaces = await currentModel.findNearbyEntertainments(
      currentId, 
      parseFloat(radius), 
      parseInt(limit)
    );
    
    res.json(nearbyPlaces);
  } catch (error) {
    console.error('Error fetching nearby entertainments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
