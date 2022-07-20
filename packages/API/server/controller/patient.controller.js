import getPatientScores from '@patientscores/library/src/getPatientScores.js';

/**
 * Get patient list.
 * @property {number} req.body.latitude - Latitude for facility.
 * @property {number} req.body.longitude - Longitude for facility..
 * @returns {Patient[]}
 */
const patientScores = (req, res) => {
  const {
    latitude, longitude, lowData, limit,
  } = req.body;

  if (latitude && longitude) {
    const facilityLocation = {
      latitude,
      longitude,
    };
    const result = getPatientScores(facilityLocation, lowData, limit);
    return res.status(200).json(result);
  }
  return res.status(400).send('Please provide facility location!');
};

export default patientScores;
