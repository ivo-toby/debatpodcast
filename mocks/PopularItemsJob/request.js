/* eslint-disable */
const queryParams = {};
const body = {};
const path = {};

// Local development request object
const req = {
    schedule: { adjustForDST: true },
    scheduleStatus: {
        last: '0001-01-01T00:00:00',
        next: '2020-10-19T16:16:00+02:00',
        lastUpdated: '0001-01-01T00:00:00'
    },
    isPastDue: true
};

module.exports = req;
