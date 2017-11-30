angular.module('candidate', [])
    .controller('MainCtrl', [
        '$scope','$http',
        function($scope,$http){
            $scope.test = 'Hello world!';
            $scope.candidates = [
                {title:'candidate 1', upvotes:5},
                {title:'candidate 2', upvotes:6},
                {title:'candidate 3', upvotes:1},
                {title:'candidate 4', upvotes:4},
                {title:'candidate 5', upvotes:3}
            ];

            $scope.submittedcandidates = [];

            // $http.get('/getCandidates').success(function (data) {
            //     $scope.candidates = data;
            // })


            for(var i = 0; i < $scope.candidates.length; i++){
                $scope.candidates[i].selected = false;
            }


            $scope.submit = function () {
                $scope.submittedcandidates = [];
                for (var i = 0; i < $scope.candidates.length; i++){
                    if($scope.candidates[i].selected){
                        var newVote = $scope.candidates[i];
                        newVote.upvotes += 1;
                        // $scope.submittedcandidates.push($scope.candidates[i]);
                        $scope.submittedcandidates.push(newVote);
                    }
                }

                $http.put('/submitVotes', $scope.submittedcandidates)
                    .success(function (data) {
                        console.log("success");
                    })
            }

            $scope.addcandidate = function() {
                if($scope.formContent === '') { return; }
                console.log("In addcandidate with "+$scope.formContent);
                $scope.create({
                    title: $scope.formContent,
                    upvotes: 0,
                });
                $scope.formContent = '';
            };

            $scope.incrementUpvotes = function(candidate) {
                $scope.upvote(candidate);
            };

            $scope.getAll = function() {
                return $http.get('/getCandidates').success(function(data){
                    angular.copy(data, $scope.candidates);
                });
            };
            $scope.getAll();

            $scope.create = function(candidate) {
                return $http.post('/candidates', candidate).success(function(data){
                    $scope.candidates.push(data);
                });
            };

            $scope.upvote = function(candidate) {
                return $http.put('/candidates/' + candidate._id + '/upvote')
                    .success(function(data){
                        console.log("upvote worked");
                        candidate.upvotes += 1;
                    });
            };

            $scope.delete = function(candidate) {
                $http.delete('/candidates/' + candidate._id )
                    .success(function(data){
                        console.log("delete worked");
                    });
                $scope.getAll();
            };

        }
    ]);