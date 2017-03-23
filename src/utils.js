import Web3 from "web3";
import _ from "lodash";
import abi from "./abi";

export const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://parity:8545'));

export const getProgramms = function(coreAddress) {
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
  return programms;
}

export const getTokens = function(coreAddress) {
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
  return tokens;
}

export const getBalance = function(tokenAddress, complierAddress) {
  const token = web3.eth.contract(abi.Token).at(tokenAddress);
  let balance = token.balanceOf(complierAddress);
  return _.toNumber(balance);
}

export const getTransactionCount = function(address) {
  return web3.eth.getTransactionCount(address);
}

export const raw = function(code) {
  return web3.eth.sendRawTransaction('0x'+code.replace(/^0x/, ''));
}
