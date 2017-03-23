import express from "express";
import cors from "cors";
import _ from "lodash";
import * as utils from "./utils";
import config from "./config";
// import abi from "./abi";

// console.log(utils.web3.eth.getBlock('latest')); // 618568 web3.eth.getBlock('latest', (e,r)=>{console.log(e,r.number)})
// console.log(utils.web3.version.network);
// console.log(utils.web3.eth.getTransactionCount(config.accountAddress)); // nonce
// console.log(utils.web3.eth.getTransaction('0x197212f24f8542cddd87b6eb89488839f3645b914f6a312894572564a54915af')); // nonce
// console.log('0x'+Number(utils.web3.eth.getTransactionCount(config.accountAddress)).toString(16));
// utils.web3.eth.sendRawTransaction('0xf8aa2685174876e800830186a094d8215991997bf965ba4da769087a6cfd61c01e1680b8449dc29fac0000000000000000000000001c0cd50ae66352289181865cfa839c2bc8b7e9b3000000000000000000000000000000000000000000000000000000000000000577a09f7a3d59cd7a44cce184af305cc77246c7696cd5ff0bf6bd603f092b184cc69ba0190ea67c90c8851b0d0707d91d7876dd9768b01687b88fc33dff3789c0b09945', (e,r) => {console.log(e,r)});

// var complier = utils.web3.eth.contract(abi.Complier).at(config.complierAddress);
// var asd = complier.burn.getData('0x23e70c0462885766b150cdbf9402bff35dddeea7', 500, {from: config.accountAddress, gas: 100000});
// console.log(asd);

const app = express()

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send({
    num: utils.web3.eth.getBlock('latest')
  })
})

// http://localhost:3001/programms
app.get('/programms', (req, res) => {
  const programms = utils.getProgramms(config.daoAddress);
  res.status(200).send({
    programms
  })
})

// http://localhost:3001/tokens/0x9ee8b04a4a5e301eabdb791fb6ed4e7d815cf90d
app.get('/tokens/:core', (req, res) => {
  const tokens = utils.getTokens(req.params.core);
  res.status(200).send({
    tokens
  })
})

// http://localhost:3001/balance/0x1c0cd50ae66352289181865cfa839c2bc8b7e9b3/0xd8215991997bf965ba4da769087a6cfd61c01e16
app.get('/balance/:token/:complier', (req, res) => {
  const balance = utils.getBalance(req.params.token, req.params.complier);
  res.status(200);
  res.send({
    balance: _.toString(balance)
  })
})

// http://localhost:3001/burn/0x51b52d3a8eb9c2dad5b08ee66c2faa0ab38ad097/20
// app.get('/burn/:token/:amount', (req, res) => {
//   const tx = utils.burn(req.params.token, req.params.amount, config.complierAddress, config.accountAddress);
//   res.status(200);
//   res.send({
//     tx: 'https://kovan.etherscan.io/tx/' + tx
//   })
// })

// http://localhost:3000/count/0x7453C2418d6b3A475A750022cCd01f378d60Fa95
app.get('/count/:address', (req, res) => {
  const count = utils.getTransactionCount(req.params.address);
  res.status(200);
  res.send({
    count: count
  })
})

// http://localhost:3001/raw/asdasdasdasdasdasdasd
app.get('/raw/:code', (req, res) => {
  const tx = utils.raw(req.params.code);
  res.status(200);
  res.send({
    tx: 'https://kovan.etherscan.io/tx/' + tx
  })
})

app.listen(3000)
