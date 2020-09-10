const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
        if (err) return console.log(err);

        const db = client.db('Waycool');
        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get trains
router.get('/get-trains', (req, res) => {
    console.log('request incoming.......')
    connection((db) => {
        db.collection('train')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Add Trains
router.post('/add-trains', (req, res) => {
    console.log('request incoming.......')
    const IData = req.body.data;
    connection((db) => {
        db.collection('train')
            .find({ 'from': IData.from, 'to': IData.to, 'tname': IData.tname, 'time': IData.time })
            .toArray()
            .then((cnt) => {
                if (cnt.length === 0) {
                    console.log(cnt)
                    db.collection('train')
                        .insertOne(IData)
                        .then((rs) => {
                            response.data = rs;
                            res.json(response);
                        })
                        .catch((err) => {
                            sendError(err, res);
                        });
                } else {
                    sendError('duplicate data entry', res);
                }
            }).catch((err) => {
                sendError(err, res);
            })

    });
});

// Add Trains
router.post('/add-trains', (req, res) => {
    console.log('request incoming.......')
    const IData = req.body.data;
    connection((db) => {
        db.collection('train')
            .update(
                { "from": IData.from, "to": IData.to, "tname": IData.tname },
                {
                    $set: {
                        'time': IData.time,
                        'fare': IData.fare,
                        'seats': IData.seats
                    }
                }
            )
            .toArray()
            .then((rs) => {
                response.data = rs;
                res.json(response);
            }).catch((err) => {
                sendError(err, res);
            })

    });
});

// Delete Trains
router.post('/del-trains', (req, res) => {
    console.log('request incoming.......')
    const IData = req.body.data;
    connection((db) => {
        db.collection('train')
            .findOne(IData)
            .toArray()
            .then((item) => {
                console.log(cnt)
                db.collection('train')
                    .remove({_id: item._id})
                    .then((rs) => {
                        response.data = rs;
                        res.json(response);
                    })
                    .catch((err) => {
                        sendError(err, res);
                    });

            }).catch((err) => {
                sendError(err, res);
            })

    });
});

// Get users
router.get('/get-users', (req, res) => {
    console.log('request incoming.......')
    connection((db) => {
        db.collection('user')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Add users
router.post('/add-users', (req, res) => {
    console.log('request incoming.......')
    const IData = req.body.data;
    connection((db) => {
        db.collection('user')
            .find(IData)
            .toArray()
            .then((cnt) => {
                if (cnt.length === 0) {
                    console.log(cnt)
                    db.collection('user')
                        .insertOne(IData)
                        .then((rs) => {
                            response.data = rs;
                            res.json(response);
                        })
                        .catch((err) => {
                            sendError(err, res);
                        });
                } else {
                    sendError('duplicate data entry', res);
                }
            }).catch((err) => {
                sendError(err, res);
            })

    });
});

module.exports = router;