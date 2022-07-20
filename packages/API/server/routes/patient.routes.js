import express from 'express';
import patientScores from '../controller/patient.controller.js';

const router = express.Router();

router.route('/patients').post(patientScores);

export default router;
