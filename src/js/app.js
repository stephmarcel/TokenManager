App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    $("#loader").hide();
    $("#balanceInfo").hide();
    $("#formReceiveToken").hide();
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
      $("#loader").hide();
      $("#balanceInfo").hide();
      $("#formReceiveToken").hide();
      $("#formSendToken").hide();
     //  App.listenForEvents();

    //  return App.render();
     });
  },

  render: function() {
    var amacoinInstance;

    var loader = $("#loader");
    var balanceInfo = $("#balanceInfo");

    loader.hide();
    balanceInfo.hide();

    // Load account data
    if (App.account == '0x0') {
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });
  }

    // Load contract data
    App.contracts.AmaCoin.deployed().then(function(instance) {
      amacoinInstance = instance;
      return amacoinInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();


      return amacoinInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to voted
      if (hasVoted) {
        //$('form').hide();
        $("#formVote").hide();
        }
    else {
      $("#formVote").show();
        }
      loader.hide();
      content.show();
        $("#NbTotalVote").html("Total Vote: " + totalVote);
    }).catch(function(error) {
      console.warn(error);
    });
  },

  // castVote: function() {
  //   var candidateId = $('#candidatesSelect').val();
  //   App.contracts.AmaCoin.deployed().then(function(instance) {
  //     return instance.vote(candidateId, { from: App.account });
  //   }).then(function(result) {
  //     // Wait for votes to update
  //     $("#content").hide();
  //     $("#loader").show();
  //   }).catch(function(err) {
  //     console.error(err);
  //   });
  // },


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

castVote: function() {
  // var candidateId = $('#candidatesSelect').val();
  // App.contracts.AmaCoin.deployed().then(function(instance) {
  //   return instance.vote(candidateId, { from: App.account });
  // }).then(function(result) {
  //   // Wait for votes to update
  //   $("#content").hide();
  //   $("#loader").show();
  // }).catch(function(err) {
  //   console.error(err);
  // });

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
reloadForm: function(){
  window.location.reload();
},
receiveToken: function(){
  // var from =
  // var to =
  // var nbToken =
  // App.contracts.AmaCoin.deployed().then(function(instance){
  //   return instance.transferFrom(from, to, nbToken);
  // }).then(function(result){
  //   alert('Réception de token effectuée avec succès');
  // }).catch(function(err) {
  //   console.error(err);
  // });
  alert('Fonctionnalité en cours de paramétrage');
},

generateAccount: function(){

    var amacoinInstance;
    //var password = $("#passwordfield").val();
    var publicKey = document.getElementById('publicKey');
    var privateKey = document.getElementById('privateKey');
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
