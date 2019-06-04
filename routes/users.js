var express = require("express");
var router = express.Router();

router

  .get("/", function(req, res) {
    var count = c_instance.getUsersCount().toNumber();
    var users = [];
    //initWeb3();

    for (var i = 0; i < count; i++) {
      var usr = c_instance.users(c_instance.arrayUsers(i));

      var organizations = c_instance.getUserOrganizations(
        c_instance.arrayUsers(i)
      );

      var orgsUser = [];
      for (var i = 0; i < organizations.length; i++) {
        var org = c_instance.organizations(organizations[i].toNumber());
        orgsUser.push({
          id: organizations[i],
          name: org[3],
          business_area: org[5]
        });
      }

      var user_type;

      switch (usr[1].toNumber()) {
        case 0:
          user_type = "Admin";
          break;
        case 1:
          user_type = "Organization Admin";
          break;
        case 2:
          user_type = "User";
          break;
        default:
          break;
      }
      users.push({
        address: usr[0],
        type: user_type,
        status: usr[2],
        organizations: orgsUser
      });
    }

    if (users.length == 0) {
      res.status(200).json({ message: "0 users found" });
    } else {
      res.status(200).json(users);
    }
  })

  .get("/:address", function(req, res) {
    if (req.params.address == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var user = c_instance.users(req.params.address);
      var organizations = c_instance.getUserOrganizations(req.params.address);

      var orgsUser = [];
      for (var i = 0; i < organizations.length; i++) {
        var org = c_instance.organizations(organizations[i].toNumber());
        orgsUser.push({
          id: organizations[i],
          name: org[3],
          business_area: org[5]
        });
      }

      if (!c_instance.isNull(user[0])) {
        var user_type;

        switch (user[1].toNumber()) {
          case 0:
            user_type = "Admin";
            break;
          case 1:
            user_type = "Organization Admin";
            break;
          case 2:
            user_type = "User";
            break;
          default:
            break;
        }
        res.status(200).json({
          address: user[0],
          type: user_type,
          status: user[2],
          organizations: orgsUser
        });
      } else {
        res.status(200).json({ message: "User not found" });
      }
    }
  })

  .post("/", function(req, res) {
    if (
      req.body.address == null ||
      req.body.type == null ||
      req.body.organization == null
    ) {
      res.status(400).send({ message: "Error, invalid request" });
    }

    try {
      c_instance.addUser(
        req.headers.address,
        req.body.address,
        req.body.type,
        req.body.organization,
        { from: req.headers.address, gas: 3000000 }
      );
      res.status(201).send({ message: "User created" });
    } catch (error) {
      res.status(403).send({ message: error.message });
    }
  })

  .put("/block", function(req, res) {
    try {
      c_instance.blockUser(req.headers.address, req.body.address, {
        from: req.headers.address,
        gas: 3000000
      });
      res.status(200).send({ message: "User blocked" });
    } catch (error) {
      var errorMessage = error.message
        .toString()
        .substring(
          "VM Exception while processing transaction: revert".length + 1
        );
      res.status(403).send({ message: errorMessage });
    }
  })

  .put("/unblock", function(req, res) {
    try {
      c_instance.unblockUser(req.headers.address, req.body.address, {
        from: req.headers.address,
        gas: 3000000
      });
      res.status(200).send({ message: "User unblocked" });
    } catch (error) {
      var errorMessage = error.message
        .toString()
        .substring(
          "VM Exception while processing transaction: revert".length + 1
        );
      res.status(403).send({ message: errorMessage });
    }
  });

module.exports = router;