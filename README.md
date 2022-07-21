# Luma Technical Interview

## Problem Definition

A busy hospital has a list of patients waiting to see a doctor. The waitlist is created sequentially (e.g. patients are added in a fifo order) from the time the patient calls.  Once there is an availability, the front desk calls each patient to offer the appointment in the order they were added to the waitlist. The staff member from the front desk has noticed that she wastes a lot of time trying to find a patient from the waitlist since they&#39;re often not available, don&#39;t pick up the phone, etc.  She would like to generate a better list that will increase her chances of finding a patient in the first few calls.

## Interview Task

Given patient demographics and behavioral data (see sample-data/patients.json), create an algorithm that will process a set of historical patient data and compute a score for each patient that (1 as the lowest, 10 as the highest) that represents the chance of a patient accepting the offer off the waitlist. Take in consideration that patients who have little behavior data should be randomly added to the top list as to give them a chance to be selected. Expose an api that takes a facility's location as input and returns an ordered list of 10 patients who will most likely accept the appointment offer.

## Weighting Categories

Demographic

- age  (weighted 10%)
- distance to practice (weighted 10%)

Behavior

- number of accepted offers (weighted 30%)
- number of cancelled offers (weighted 30%)
- reply time (how long it took for patients to reply) (weighted 20%)

## Patient Model

- ID
- Age (in years)
- location
  - Lat
  - long
- acceptedOffers (integer)
- canceledOffers (integer)
- averageReplyTime (integer, in seconds)

## Deliverables

The code should be written as a Node.js as a library that anyone can import and use. It should contain documentation and unit tests that show your understanding of the problem. Once you&#39;re finished, submit a PR to this repo.

## Solution
### Objective
Write an algorithm to process a set of historical patient data and produce a list of patients the have a high probability of accepting the offer off the waitlist.


### Project Structure
I have built out the solution in a monorepo using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces#running-commands-in-the-context-of-workspaces). There is an API package and an installable library package.

#### Usage:
Run the following commands while in the root directory.
```shell
$ npm install
$ npm start

> @patientscores/api@1.0.0 start
> node ./server.js

Server started on port 3000
```

### Library (folder `packages/Library`)
This is the heart of the solution. It is implemented as an npm library and can be published to the npm repository. All unit tests for the library are found in the file, `packages/Library/test/library.test.js`, then implementation code is in `packages/Library/getPatienScores.js`.

#### Run the unit tests:
Run the following command in the root directory. It will run tests for both packages.
```bash
npm test

> patientscores@1.0.0 test
> npm run test --workspaces

> @patientscores/api@1.0.0 test
> mocha ./test/**/*.test.js --exit

Server started on port 3000

  Patients
    GET /patients 
      ✔ should respond with 404 (43ms)
    POST /api/patients 
      ✔ should respond with 400
      ✔ should respond with 200 (101ms)


  3 passing (178ms)

> @patientscores/library@1.0.0 test
> mocha ./test/**/*.test.js

  Library
    ✔ should get patient scores (62ms)


  1 passing (68ms)
```

### API (folder `packages/API/`)
There is one endpoint at [http://localhost:3000/api/patients](http://localhost:3000/api/patients) that can be used to generate a list of patients who are more likely to accept a spot on the waitlist. Remember to submit facilityLocation object in the request body, it should have the following structure.

```shell
{ 
  "latitude": -73, 
  "longiude": 200 
}
```

### Enhancement Recommendations
#### 1. Setting configuration.
#### 2. CI/CD pipeline.
#### 3. Persistence layer.
***Patient data is read from a JSON file
