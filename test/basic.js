var bitcore = require('bitcore');
var assert = require('assert');

describe('Simple Payment Channel example from README', function() {

  describe('a simple consumer', function() {
    
    it('correctly gets created', function() {
      var consumer = getConsumer().consumer;
      assert(consumer.fundingKey.toString());
      // No assertions...? Just checking that no compile errors occur
    });

    it('processes an output', function() {
      var consumer = getFundedConsumer().consumer;
      assert(consumer.commitmentTx.amount === 1000000);
      assert(consumer.getRefundTxToSign());
    });

    it('validates a refund correctly', function() {
      var consumer = getFundedConsumer().consumer;
      consumer.getRefundTxToSign();
      consumer.refundTx.sign([providerWalletKey]);
      assert(consumer.validateRefund({
        refund: consumer.refundTx.serialize(),
        paymentAddress: serverAddress
      }));
    });

    it('has no false positive on refund validation', function() {
    });

    it('has no false negatives on refund validation', function() {
    });

    it('can increment a payment', function() {
    });
  });

  describe('a simple provider', function() {

    it('gets created correctly', function() {
    });

    it('signs a refund', function() {
    });

    it('validates a payment', function() {
    });

    it('outputs a transaction from the last payment transaction', function() {
    });
  });

  describe('interaction between provider and consumer', function() {

    it('works correctly in an integration test', function() {
    });

  });
});

var providerKey = new bitcore.Key();
providerKey.private = new Buffer('58e78db594be551a8f4c7070fd8695363992bd1eb37d01cd4a4da608f3dc5c2d', 'hex');
providerKey.regenerateSync();
var providerWalletKey = new bitcore.WalletKey({
  privKey: providerKey,
  network: bitcore.networks['testnet']
});

var serverAddress = providerWalletKey.storeObj().address;

var getConsumer = function() {
  var fundingKey = new bitcore.Key();
  fundingKey.private = new Buffer('79b0630419ad72397d211db4988c98ffcb5955b14f6ec5c5651eec5c98d7e557', 'hex');
  fundingKey.regenerateSync();
  var commitmentKey = new bitcore.Key();
  commitmentKey.private = new Buffer('17bc93ac93f4a26599d3af49e59206e8276259febba503434eacb871f9bbad75', 'hex');
  commitmentKey.regenerateSync();

  var Consumer = require('../').Consumer;
  var serverPublicKey = '027f10e67bea70f847b3ab92c18776c6a97a78f84def158afc31fd98513d42912e';
  var refundAddress = 'mzCXqcsLBerwyoRZzBFQELHaJ1ZtBSxxe6';

  var consumer = new Consumer({
    network: 'testnet',
    fundingKey: fundingKey,
    commitmentKey: commitmentKey,
    serverPublicKey: serverPublicKey,
    refundAddress: refundAddress
  });

  return {
    consumer: consumer,
    serverPublicKey: serverPublicKey,
    refundAddress: refundAddress
  };
};

var getFundedConsumer = function() {
  var result = getConsumer();
  result.consumer.processFunding({
    "address":"mq9uqc4W8phHXRPt3ZWUdRpoZ9rkR67Dw1",
    "txid":"c1003b5e2c9f5eca65bde73463035e5dffcfbd3c234e55e069cfeebb513293e4",
    "vout":0,
    "ts":1416196655,
    "scriptPubKey":"76a91469b678f36c91bf635ff6e9479edd3253a5dfd41a88ac",
    "amount":0.01,
    "confirmationsFromCache":false
  });
  return result;
};