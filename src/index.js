import express from "express";
import cors from "cors";
import _ from "lodash";
import * as utils from "./utils";

const DAO = process.env.DAO || false;

const app = express()

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send({
    num: utils.web3.eth.getBlock('latest')
  })
})

// http://localhost:3001/programms
app.get('/programms', (req, res) => {
  const programms = utils.getProgramms(DAO);
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
    tx: tx
  })
})

app.listen(3000)
