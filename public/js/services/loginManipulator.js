(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('LoginManipulator', LoginManipulator);

    function LoginManipulator($rootScope, LocalStorage, bcrypt, UsersFactory){

        function assignCurrentUser (user) {
            $rootScope.currentUser = user;
            LocalStorage.setUserFromLS(user);
            return user;
        }

        return {
            signup: function(username, email, password, cb){
                var user;
                var SALT_WORK_FACTOR = 10;

                return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                    if (err) return err;
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) return err;

                        UsersFactory.find({c: true, q: {"username": username}}).$promise.then(function(data) {
                            if(data > 0){
                                return cb("This username is already in use", false);
                            } else {
                                user = {username: username, email: email, password: hash};
                                UsersFactory.save(user);
                                assignCurrentUser(user);

                                return cb("", true);
                            }
                        });
                    });
                });
            },
            login: function(username, password, cb){
                var user = {
                    fo: true,
                    q: {"username": username}
                };

                UsersFactory.find(user).$promise.then(function(data) {

                    if (data !== null) {
                        var match = bcrypt.compareSync(password, data.password);
                        if (match) {
                            assignCurrentUser(data);

                            return cb("", true);
                        } else {
                            return cb("Password is incorrect", false);
                        }
                    } else {
                        return cb("Username is incorrect or doesn't exist", false);
                    }
                });
            }
        };
    }
})();