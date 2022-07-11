const express = require('express')
const bodyParser = require('body-parser')
const Web3 = require('web3');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// console.log(web3.providers);

// const web3 = new Web3("HTTP://127.0.0.1:7545");

const web3 = new Web3("https://ropsten.infura.io/v3/37ce477e00c14a8390548738542dd9aa");

web3.eth.getAccounts(function(err,accounts){
    console.log(accounts)
})

var account = "0x9C1640eDAd7Ae1E25cdd61Bf480C8B1aEF578C63"

// hidestream
var pkey = "4324ebfb862e57630ebb641e426f0f965ead51bdce7965e82b0b1e468fe5c591"

var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_word",
				"type": "string"
			}
		],
		"name": "setWord",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getWord",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

var contractAddress = "0x32c051edca15bc1c21b844d1411208740753ba41";

var myContract = new web3.eth.Contract(abi,contractAddress);

console.log(myContract.methods);

 
app.get('/', function (req, res) {
    console.log(__dirname);
//   res.send('Hello World')
res.sendFile(__dirname+'/public/index.html');
});

app.get('/getString',function (req,res){
    myContract.methods.getWord().call({from:account})
.then(function(result){
    console.log(result);
    res.send(result);
})

  
})

app.post('/newWord',function(req,res){

	// console.log("req: ", req)
    // console.log("req.body: ",req.body);
	console.log("input: ",  req.body.word ) ;
    console.log('inside post') ;
	var encodedData = myContract.methods.setWord(req.body.word).encodeABI();
	console.log(encodedData);

	var transactionObject = {
		gas : "470000",
		data : encodedData,
		from : account,
		to : contractAddress
	};


	web3.eth.accounts.signTransaction(transactionObject,pkey,function(error,trans){
		console.log(trans);
		web3.eth.sendSignedTransaction(trans.rawTransaction)
		.on("receipt",function(result){
			console.log(result);
			res.send(result);
		})
	})
})



app.listen(3000,() => {
	console.log("I am listinig at post 3000 !");
})




// myCon
