var AmaCoin = artifacts.require("./AmaCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(AmaCoin);
};
