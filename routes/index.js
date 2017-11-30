var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/worldmap', { useMongoClient: true });

var CandidateSchema = mongoose.Schema({ //Defines the Schema for this database
    upvotes: Number,
    title: String
});

var Candidate = mongoose.model('Candidate', CandidateSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});


router.post('/candidates', function (req,res,next) {
    console.log("in post route")
    var newCandidate = new Candidate(req.body);
    console.log(newCandidate);

    newCandidate.save(function(err, post) { //[4]
        if (err) return console.error(err);
        console.log(post);

        Candidate.find(function(err,CandidateList) {
            if (err) return console.error(err);
            else {
                console.log(CandidateList);


            }
            res.json(post);
        })

    });
})


router.delete('/candidates/:id', function (req,res,next) {
    console.log("in delete route")
    console.log(req.params.id);
    Candidate.find(function (err, CandidateList) {
        if(err) return console.error(err);
        else {
            for(var i = 0; i < CandidateList.length; i++){
                if(CandidateList[i]._id == req.params.id) {
                    CandidateList[i].remove();
                }
            }
        }

    })
    res.end();
})

router.get('/getCandidates', function (req,res,next) {
    console.log("in get route");

    Candidate.find(function(err,candidateList) {
        if (err) return console.error(err);
        else {
            console.log(candidateList);
        }
        res.json(candidateList);
    })
})

/* GET home page. */
router.put('/submitVotes', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
