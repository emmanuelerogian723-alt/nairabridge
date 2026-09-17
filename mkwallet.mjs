import { Horizon, Asset, TransactionBuilder, Networks, Operation, Keypair, BASE_FEE } from '@stellar/stellar-sdk';
import fs from 'fs';
const SECRET = fs.readFileSync('/app/conversations/6a56e5c1c2ba4e8b61788703/keys/treasury.txt','utf8').split('\n').find(l=>l.startsWith('SECRET=')).slice(7).trim();
const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const treasury = Keypair.fromSecret(SECRET);
const user = Keypair.random();
const tAcct = await server.loadAccount(treasury.publicKey());
const USDC = new Asset('USDC','GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');
// create account + its own trustline in one sponsored sequence
const tx = new TransactionBuilder(tAcct,{fee:BASE_FEE,networkPassphrase:Networks.TESTNET})
  .addOperation(Operation.createAccount({destination:user.publicKey(),startingBalance:'4'}))
  .setTimeout(60).build();
tx.sign(treasury);
await server.submitTransaction(tx);
const uAcct = await server.loadAccount(user.publicKey());
const tx2 = new TransactionBuilder(uAcct,{fee:BASE_FEE,networkPassphrase:Networks.TESTNET})
  .addOperation(Operation.changeTrust({asset:USDC,limit:'100'}))
  .setTimeout(60).build();
tx2.sign(user);
await server.submitTransaction(tx2);
console.log('READY_WALLET=' + user.publicKey());
