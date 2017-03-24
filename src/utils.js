import Web3 from "web3";
import _ from "lodash";
import abi from "./abi";

const PARITY = process.env.PARITY || 'http://parity:8545';
export const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(PARITY));

export const getProgramms = function(coreAddress) {
  return new Promise((resolve, reject) => {
    const programms = [];
    const core = web3.eth.contract(abi.Core).at(coreAddress);
    let next = core.first();
    if (next == '0x0000000000000000000000000000000000000000') {
      next = false;
    }
    while (next) {
      const type = core.abiOf(next);
      if (type == 'registry') {
        let name = core.getName(next);
        programms.push({
          address: next,
          name
        });
      }
      next = core.next(next);
      if (next == '0x0000000000000000000000000000000000000000') {
        next = false;
      }
    }
    resolve(programms);
  });
}

export const getTokens = function(coreAddress) {
  return new Promise((resolve, reject) => {
    const tokens = [];
    const core = web3.eth.contract(abi.Core).at(coreAddress);
    let next = core.first();
    if (next == '0x0000000000000000000000000000000000000000') {
      next = false;
    }
    while (next) {
      let name = core.getName(next);
      tokens.push({
        address: next,
        name
      });
      next = core.next(next);
      if (next == '0x0000000000000000000000000000000000000000') {
        next = false;
      }
    }
    resolve(tokens);
  });
}

export const getBalance = function(tokenAddress, complierAddress) {
  return new Promise((resolve, reject) => {
    const token = web3.eth.contract(abi.Token).at(tokenAddress);
      token.balanceOf(complierAddress, (e, r) => {
      if (e) {
        reject(e);
      }
      resolve(r);
    });
  });
}

export const getTransactionCount = function(address) {
  return new Promise((resolve, reject) => {
    web3.eth.getTransactionCount(address, (e, r) => {
      if (e) {
        reject(e);
      }
      resolve(r);
    });
  });
}

export const raw = function(code) {
  return new Promise((resolve, reject) => {
    web3.eth.sendRawTransaction('0x'+code.replace(/^0x/, ''), (e, r) => {
      if (e) {
        reject(e);
      }
      resolve(r);
    });
  });
}
