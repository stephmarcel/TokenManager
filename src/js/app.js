App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  position: '',

  init: function() {
    $("#loader").hide();
    $("#balanceInfo").hide();
    $("#formReceive").hide();
    $("#formSendToken").hide();
    return App.initWeb3();

  },

  initWeb3: function() {
    // if (typeof web3 !== 'undefined') {
    //   // If a web3 instance is already provided by Meta Mask.
    //   App.web3Provider = web3.currentProvider;
    //   web3 = new Web3(web3.currentProvider);
    // } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
  //  }

    return App.initContract();
  },

  initContract: function() {
     $.getJSON("AmaCoin.json", function(amacoin) {
       // Instantiate a new truffle contract from the artifact
       App.contracts.AmaCoin = TruffleContract(amacoin);
      // Connect provider to interact with contract
      App.contracts.AmaCoin.setProvider(App.web3Provider);
    //  var cpt = web3.eth.getAccounts();
      App.getFirstAccount();
      //App.account = web3.eth.accounts[0];
      $("#loader").hide();
      $("#balanceInfo").hide();
      $("#formReceive").hide();
      $("#formSend").hide();
     //  App.listenForEvents();

    //  return App.render();
     });
  },

  getFirstAccount: function(){
    web3.eth.getAccounts().then(function(accounts){
      App.account = accounts[0];
      console.log();
    });
  },



  listenForEvents: function() {
  App.contracts.AmaCoin.deployed().then(function(instance) {
    instance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch(function(error, event) {
      console.log("event triggered", event);
      // Reload when a new vote is recorded
      App.render();
    });
  });
},

sendToken: function(){
  // var from =
  // var to =
  // var nbToken =
  // App.contracts.AmaCoin.deployed().then(function(instance){
  //   return instance.transferFrom(from, to, nbToken);
  // }).then(function(result){
  //   alert('Envoi de token effectué avec succès');
  // }).catch(function(err) {
  //   console.error(err);
  // });
  alert('Fonctionnalité en cours de paramétrage');
},

openformReceive: function(){
  $("#loader").hide();
  $("#balanceInfo").hide();
  $("#formSend").hide();
  var addFrom = document.getElementById('addressFrom');
  addFrom.value = publicKey.value;
  $("#formReceive").show();
},

openformSend: function(){
  $("#formGenerateAccount").hide();

  // $("#accountAddress").html("Your ID: " + publicKey.value);
  // $("#accountPosition").html("Your position: " + App.position);
  // $("#accountBalance").html("<h3  class='text-center'>  Balance  </h3><br/>  <h1  class='text-center'> 10 A$  </h1>");
  $("#loader").hide();
  $("#balanceInfo").hide();
  $("#formReceive").hide();
  $("#formSend").show();
},

getInfoBalance: function(){
      var position = $('#positionSelect').val();
      App.position = position;
      var bal;

      var publicKey = document.getElementById('publicKey');
      var privateKey = document.getElementById('privateKey');
      //publicKey.value = addr.address;
      //privateKey.value = addr.privateKey;
      App.contracts.AmaCoin.deployed().then(function(instance){
        return instance.balanceOf(publicKey.value);
      }).then(function(balance){
        bal = parseInt(balance);
      }).catch(function(err) {
        console.error(err);
      });
      $("#formGenerateAccount").hide();

      $("#accountAddress").html("Your ID: " + publicKey.value);
      $("#accountPosition").html("Your position: " + position);
      $("#accountBalance").html("<h3  class='text-center'>  Balance  </h3><br/>  <h1  class='text-center'>"+ bal +" A$  </h1>");
      $("#loader").show();
      $("#balanceInfo").show();
},

receiveToken: function(){
  //var from = document.getElementById('addressFrom').value;
  var to = document.getElementById('addressFrom').value;  //publicKey.value;
  var nbToken = parseInt(document.getElementById('nbTokenR').value);
  App.contracts.AmaCoin.deployed().then(function(instance){
    return instance.transfer(to, nbToken);
  }).then(function(result){
    alert('Réception de token effectuée avec succès');
  }).catch(function(err) {
    console.error(err);
  });
  //alert('Fonctionnalité en cours de paramétrage');
},

generateAccount: function(){

    var amacoinInstance;
    //var password = $("#passwordfield").val();
    var publicKey = document.getElementById('publicKey');
    var privateKey = document.getElementById('privateKey');
    App.account = web3.eth.accounts[0];
    var addr = web3.eth.accounts.create();
    publicKey.value = addr.address;
    privateKey.value = addr.privateKey;

  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
