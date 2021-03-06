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

// http://localhost:3000/programms
app.get('/programms', (req, res) => {
  utils.getProgramms(DAO)
    .then((programms) => {
      res.status(200).send({
        programms
      })
    })
    .catch((e) => {
      res.status(500).send({
        error: e.toString()
      })
    });
})

// http://localhost:3000/tokens/0x9ee8b04a4a5e301eabdb791fb6ed4e7d815cf90d
app.get('/tokens/:core', (req, res) => {
  utils.getTokens(req.params.core)
    .then((tokens) => {
      res.status(200).send({
        tokens
      })
    })
    .catch((e) => {
      res.status(500).send({
        error: e.toString()
      })
    });
})

// http://localhost:3000/balance/0x1c0cd50ae66352289181865cfa839c2bc8b7e9b3/0xd8215991997bf965ba4da769087a6cfd61c01e16
app.get('/balance/:token/:complier', (req, res) => {
  utils.getBalance(req.params.token, req.params.complier)
    .then((balance) => {
      res.status(200).send({
        balance: _.toString(balance)
      })
    })
    .catch((e) => {
      res.status(500).send({
        error: e.toString()
      })
    });
})

// http://localhost:3000/count/0x7453C2418d6b3A475A750022cCd01f378d60Fa95
app.get('/count/:address', (req, res) => {
  utils.getTransactionCount(req.params.address)
    .then((count) => {
      res.status(200).send({
        count: count
      })
    })
    .catch((e) => {
      res.status(500).send({
        error: e.toString()
      })
    });
})

// http://localhost:3000/check/0x7453C2418d6b3A475A750022cCd01f378d60Fa95
app.get('/check/:hash', (req, res) => {
  utils.isTransactionComplete(req.params.hash)
    .then((result) => {
      res.status(200).send({
        result: result
      })
    })
    .catch((e) => {
      res.status(500).send({
        error: e.toString()
      })
    });
})

// http://localhost:3000/period/0x7453C2418d6b3A475A750022cCd01f378d60Fa95
app.get('/period/:token', (req, res) => {
  utils.getTimestamp(req.params.token)
    .then((result) => {
      result = _.toNumber(result);
      const current = Math.round(new Date().getTime()/1000);
      if (result > 0 && result <= current) {
        res.status(200).send({
          error: 'End period',
          result: result
        })
      } else {
        res.status(200).send({
          result: result
        })
      }
    })
    .catch((e) => {
      res.status(500).send({
        error: e.toString()
      })
    });
})

// http://localhost:3000/valid/0x1c0cd50ae66352289181865cfa839c2bc8b7e9b3/0xd8215991997bf965ba4da769087a6cfd61c01e16/10
app.get('/valid/:token/:complier/:amount', (req, res) => {
  utils.getBalance(req.params.token, req.params.complier)
    .then((balance) => {
      balance = _.toNumber(balance)
      if (balance < req.params.amount) {
        res.status(500).send({
          error: 'Amount deficiency'
        })
        return false;
      } else {
        return utils.getTimestamp(req.params.token)
      }
    })
    .then((result) => {
      if (result !== false) {
        result = _.toNumber(result);
        const current = Math.round(new Date().getTime()/1000);
        if (result > 0 && result <= current) {
          res.status(200).send({
            error: 'End period',
          })
        } else {
          res.status(200).send({
            result: 'ok'
          })
        }
      }
    })
    .catch((e) => {
      res.status(500).send({
        error: e.toString()
      })
    });
})

// http://localhost:3000/raw/asdasdasdasdasdasdasd
app.get('/raw/:code', (req, res) => {
  utils.raw(req.params.code)
    .then((tx) => {
      res.status(200).send({
        tx: tx
      })
    })
  .catch((e) => {
    res.status(500).send({
      error: e.toString()
    })
  });
})

app.listen(3000)
