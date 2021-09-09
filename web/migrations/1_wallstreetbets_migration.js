const WallStreetBets = artifacts.require("WallStreetBets");

module.exports = function (deployer) {
  deployer.deploy(WallStreetBets);
};
