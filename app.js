var Web3 = require('web3');
var web3 = new Web3();
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require("truffle-contract");
var HelloWorld = contract({
    "contract_name": "HelloWorld",
    "abi": [
        {
            "constant": true,
            "inputs": [],
            "name": "balance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "deposit",
            "outputs": [
                {
                    "name": "_newValue",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "type": "constructor"
        }
    ],
    "unlinked_binary": "0x606060405234610000575b6103e86000555b5b60a7806100206000396000f300606060405263ffffffff60e060020a600035041663b69ef8a88114602c578063b6b55f25146048575b6000565b3460005760366067565b60408051918252519081900360200190f35b346000576036600435606d565b60408051918252519081900360200190f35b60005481565b60008054820181555b9190505600a165627a7a72305820eb25c9331cb0852114785963b191e66f8d04999dc7acc0c176ed843da18efc750029",
    "networks": {
        "1489194527941": {
            "events": {},
            "links": {},
            "address": "0x5745b95fabae6dacfb887ddba9b29c7d116aee67",
            "updated_at": 1489194617815
        }
    },
    "schema_version": "0.0.5",
    "updated_at": 1489194617815

})
HelloWorld.setProvider(provider);
var deployed;
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3001, host: 'localhost',  routes: {
    cors: true
} });

HelloWorld.deployed().then(function(instance) {
     deployed = instance;

}).then(function(result) {

});
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        deployed.balance.call().then(function (resutl) {
            reply({balance:resutl});
        })

    }
});

server.route({
    method: 'GET',
    path: '/deposit/{balance}',
    handler: function (request, reply) {
        console.log(request.params.balance)
        deployed.deposit(request.params.balance,{from : web3.eth.accounts[0]}).then(function (result) {

            deployed.balance.call().then(function (bal) {
                reply({tx:result.tx,balance:bal})
            })

        })



    }
});

server.start();
console.log("Started")