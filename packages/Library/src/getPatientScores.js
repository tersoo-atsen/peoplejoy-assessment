/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import path, { dirname } from 'path';
import geolib from 'geolib';
import binarySearchInsert from 'binary-search-insert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const lowDataCutOff = 5;
const lowDataReplyTimeCutOff = 300; // 5 minutes

const computeDistanceInMile = (location1, location2) => {
  const distanceInMeters = geolib.getDistance(location1, location2);
  return geolib.convertDistance(distanceInMeters, 'mi');
};

const computeAgeScore = (age) => {
  const n = 25;
  const m = 80;
  const range = (m + 1 - n) / 10;
  return Math.floor((age - n) / range) + 1;
};

const computeAcceptedOffersScore = (acceptedOffers) => {
  const n = 0;
  const m = 100;
  const range = (m + 1 - n) / 10;
  return Math.floor((acceptedOffers - n) / range) + 1;
};

const computeCanceledOffersScore = (canceledOffers) => {
  const n = 0;
  const m = 100;
  const range = (m + 1 - n) / 10;
  return 10 - Math.floor((canceledOffers - n) / range);
};

const computeAverageReplyTimeScore = (averageReplyTime) => {
  const n = 1;
  const m = 3600;
  const range = (m + 1 - n) / 10;
  return 10 - Math.floor((averageReplyTime - n) / range);
};

const computeDistanceScore = (distance) => {
  const n = 0;
  const m = 10;
  const range = (m + 1 - n) / 10;
  let score = Math.floor((distance - n) / range);
  if (score > 9) score = 9;
  return 10 - score;
};

const computePatientScore = (patient, facilityLocation) => {
  const distanceInMile = computeDistanceInMile(facilityLocation, patient.location);
  const ageScore = computeAgeScore(patient.age);
  const acceptedOffersScore = computeAcceptedOffersScore(patient.acceptedOffers);
  const cancelledOffersScore = computeCanceledOffersScore(patient.canceledOffers);
  const averageReplyTimeScore = computeAverageReplyTimeScore(patient.averageReplyTime);
  const distanceScore = computeDistanceScore(distanceInMile);
  // eslint-disable-next-line max-len
  const patientScore = (ageScore * 10 + distanceScore * 10 + acceptedOffersScore * 30 + cancelledOffersScore * 30 + averageReplyTimeScore * 20) / 100;

  return Math.floor(patientScore + 0.5);
};

const isLowDataPatient = (patient) => patient.acceptedOffers <= lowDataCutOff
  && patient.canceledOffers <= lowDataCutOff
  && patient.averageReplyTime <= lowDataReplyTimeCutOff;

// eslint-disable-next-line max-len
const comparator = (insertedPatient, patient) => computePatientScore(insertedPatient.patient, insertedPatient.facilityLocation)
  < computePatientScore(patient.patient, patient.facilityLocation);

const insertPatient = (sortedPatients, patient, facilityLocation) => binarySearchInsert(
  sortedPatients,
  comparator,
  {
    facilityLocation,
    patient,
  },
);

const filterPatients = (patients, facilityLocation) => {
  const sortedPatients = [];
  const lowDataPatients = [];

  patients.forEach((p) => {
    if (isLowDataPatient(p)) {
      insertPatient(lowDataPatients, p, facilityLocation);
    } else {
      insertPatient(sortedPatients, p, facilityLocation);
    }
  });

  return {
    sortedPatients: Array.from(sortedPatients, (p) => p.patient),
    lowDataPatients: Array.from(lowDataPatients, (p) => p.patient),
  };
};

// Read patients.json file
const readJsonFile = () => {
  const filePath = path.join(__dirname, 'patients.json');
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const getPatientScores = (facilityLocation) => {
  const lowData = 3;
  const limit = 10;
  const patients = readJsonFile();
  const patientCategories = filterPatients(patients, facilityLocation);
  const lowHistoricalDataPatients = patientCategories.lowDataPatients.slice(0, lowData);
  const topPatients = patientCategories.sortedPatients
    .slice(0, limit - lowHistoricalDataPatients.length);
  const result = lowHistoricalDataPatients.concat(topPatients);
  return result;
};

export default getPatientScores;
