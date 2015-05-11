"use strict";
/**
 * Dependencies
 */

describe("User", function () {

  it("index all user", function (done) {

    request.get("/rest/user/")
    .expect(200)
    .end(function (error, res) {
      console.log("res.body.users", res.body.users);

      res.body.users.should.be.Array;
      res.body.users[0].id.should.greaterThan(0);

      done(error);
    });

  });

  it("create user", function (done) {

    let picture = {
      "large":"http://api.randomuser.me/portraits/women/72.jpg",
      "medium":"http://api.randomuser.me/portraits/med/women/72.jpg",
      "thumbnail":"http://api.randomuser.me/portraits/thumb/women/72.jpg"
    }

    let newUserParams = {
      "username":"testuser",
      "password":"testuser",
      "gender":"male",
      "email":"testuser@testuser.com",
      "phone":"(951)-385-6121",
      "cell":"(657)-919-3511",
      "picture":JSON.stringify(picture)
    }


    request.post("/rest/user/create/")
    .send(newUserParams)
    .expect(200)
    .end(function (error, res) {
      console.log("res.body.user", res.body.user);

      res.body.user.should.be.Object;
      res.body.user.id.should.greaterThan(0);
      res.body.user.username.should.equal(newUserParams.username);

      done(error);
    });

  });



});