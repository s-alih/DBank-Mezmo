var express = require('express');
var app = express();

var Web3 = require('web3')
const multer = require('multer')

const Token = require('./abis/Token.json')
const Provider = require('@truffle/hdwallet-provider');

require('dotenv').config();


const upload = multer();
const cors=require("cors");
const e = require('express');
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 
const privateKey = process.env.PRIVATE_KEY
const infuraApiKey = process.env.INFURA_API_KEY

const distributeTokens = async (userAccount, accounts) => {

   const provider = new Provider(privateKey, `https://ropsten.infura.io/v3/${infuraApiKey}`); 
   
   // creating instence of web3
   const web3 = new Web3(provider);
   
   // finding network id
   const networkId = await web3.eth.net.getId();
   
   // creating token instences
   const token = new web3.eth.Contract(
      Token.abi,
      Token.networks[networkId].address
    );
    // fetching token balance
    const tokenBalance = await token.methods.balanceOf(userAccount).call()

    if(tokenBalance == 0){
       console.log(tokenBalance)
       throw Error('No Token Balance ');
    }
    
    // validating address
    const filterdAddresses = accounts.filter((e)=>web3.utils.isAddress(e))

    if(filterdAddresses.length == 0){
       throw Error("No valid address found")
    }
    
    // finding amount to be distributed
    const tokenDistribute = tokenBalance * 0.05 / filterdAddresses.length
    
    // coin distribution
    for(i=0;i< filterdAddresses.length;i++){
       if(filterdAddresses !== "undefined"){
         await token.methods.transfer(filterdAddresses[i],tokenDistribute.toLocaleString('fullwide', {useGrouping:false}),).send({from:userAccount})
       }
     
    }
    
   return {"accounts":filterdAddresses,"distAmount":tokenDistribute}
 }

   // returning list of accounts
   setArray = (data) =>{
      const lines = data.toString('UTF8').split('\n');
      return lines
   }
 


// This is the root of the app
app.get('/',  async (req, res)=> {
   console.log("root");
   res.send('Token API\'s ');
})


// distributing tokens
app.post('/distribute',upload.single('file'), async (req, res) => {
   try{
      console.log("Distributing funds to accounts");
      var userAccount = req.query.userAccount
      accounts = setArray(req.file.buffer)
      var data = await distributeTokens( userAccount,accounts)
      res.send(data);
   }catch(e){
      res.status(400).send(e.message)
   }
   
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})