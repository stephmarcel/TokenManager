App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  position: '',
  pwd:'',

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
    //  App.getFirstAccount();
      App.account = web3.eth.accounts[0];
      $("#loader").hide();
      $("#balanceInfo").hide();
      $("#formReceive").hide();
      $("#formSend").hide();
     //  App.listenForEvents();

    //  return App.render();
     });
  },

  // getFirstAccount: function(){
  //   web3.eth.getAccounts().then(function(accounts){
  //     App.account = accounts[0];
  //     console.log();
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

sendToken: function(){

  var pass = $("#passwordsnd").val();
  if (pass == App.pwd) {
    var to = $("#addressTo").val();
    var from = publicKey.value;
    var nbToken = $("#nbTokenS").val();
    web3.personal.unlockAccount(from, pass, 1600);
    App.contracts.AmaCoin.deployed().then(function(instance){
      return instance.transfer( to, parseInt(nbToken), { from: from });
    }).then(function(result){
      alert('Transfert de token effectuée avec succès vers ' + to);
      App.getInfoBalance();
    }).catch(function(err) {
      console.error(err);
    });
  }
else {
  alert('Password Invalid!!');
}
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
//  alert('Fonctionnalité en cours de paramétrage');
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
        $("#accountBalance").html("<h3  class='text-center'>  Balance  </h3><br/>  <h1  class='text-center'>"+ bal +" A$  </h1><br/>");
      }).catch(function(err) {
        console.error(err);
      });
      $("#formGenerateAccount").hide();
      $("#formReceive").hide();
      $("#formSend").hide();

      $("#accountAddress").html("Your ID: " + publicKey.value);
      $("#accountPosition").html("Your position: " + position);

      $("#loader").show();
      $("#balanceInfo").show();
},

receiveToken: function(){
  var from = App.account;
  var to = publicKey.value;
  //var nbToken = parseInt(document.getElementById('nbTokenR').value);
  App.contracts.AmaCoin.deployed().then(function(instance){
    return instance.transfer(to, 100,{ from: from });
  }).then(function(result){
    alert('Réception de token effectuée avec succès de ' + App.account);
    App.getInfoBalance();
  }).catch(function(err) {
    console.error(err);
  });
  //alert('Fonctionnalité en cours de paramétrage');
},

generateAccount: function(){

    var amacoinInstance;
    var addr;
    //var password = $("#passwordfield").val();
    var password = $("#passwordfield").val();
    var publicKey = document.getElementById('publicKey');
    App.pwd = password;
    if (password != null && password != '') {
      addr = web3.personal.newAccount(password);
      web3.personal.unlockAccount(addr, password, 1600);
        //Transfer 10 ether to the new generate account
        web3.eth.sendTransaction({
          from: App.account,
          to: addr,
          value: web3.toWei(10)
        },password);
      $("#btnSub").prop('disabled', false);
      publicKey.value = addr;
      alert('Your account has been successfuly created!');
    }
    else {
      alert('Please, enter your password!');
    }

    // web3.personal.newAccount(password, function(err, res) {
    //       if (err == null) {
    //         //App.account = res;
    //         console.log("error: "+err);
    //         console.log("res: "+res);
    //         //console.log("App.account: "+ App.account);
    //         console.log("from:"+ from);
    //




  //  var privateKey = document.getElementById('privateKey');
    // App.account = web3.eth.accounts[0];
    //var addr = web3.eth.accounts.create();
    //publicKey.value = addr.address;
    //privateKey.value = addr.privateKey;

  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
