import React, { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import { Types, AptosClient } from 'aptos';


// Create an AptosClient to interact with devnet.
const moveModule = '0xcb1ed5efa1b835e34bb041424cf4fb42bac2d7096b5595e199628e736122bb46'; 
const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

declare global {
  interface Window { aptos: any; }
}
function App() {
  // Retrieve aptos.account on initial render and store it.
  //const [address, setAddress] = React.useState<string | null>(null);
  const [expiry, setExpiryTime] = useState<any>(null)

  const [userAccount, setUserAccount]= useState('');



  const getAptosWallet = () => {
    if ('aptos' in window) {
      return window.aptos;
    } else {
      window.open('https://petra.app/', `_blank`);
    }
  };



const connectWallet=async ()=>{
  const wallet = getAptosWallet();
try {
  const response = await wallet.connect();
  console.log(response); // { address: string, address: string }
 
  const account = await wallet.account();
  console.log(account.address)
 setUserAccount(account.address); // { address: string, address: string }
} catch (error) {
  // { code: 4001, message: "User rejected the request."}
}
}

  // const [modules, setModules] = React.useState<Types.MoveModuleBytecode[]>([]);
  // React.useEffect(() => {
  //   if (!address) return;
  //   client.getAccountModules(address).then(setModules);
  // }, [address]);

  // React.useEffect(() => {
  //   window.aptos.account().then((data : {address: string}) => setAddress(data.address));
  // }, []);
  // const [account, setAccount] = React.useState<Types.AccountData | null>(null);
  // React.useEffect(() => {
  //   if (!address) return;
  //   client.getAccount(address).then(setAccount);
  // }, [address]);

  // const hasModule = modules.some((m) => m.abi?.name === 'message');
  // const publishInstructions = (
  //   <pre>
  //     Run this command to publish the module:
  //     <br />
  //     aptos move publish --package-dir /path/to/hello_blockchain/
  //     --named-addresses HelloBlockchain={address}
  //   </pre>
  // );

  // const [resources, setResources] = React.useState<Types.MoveResource[]>([]);
  // React.useEffect(() => {
  //   if (!address) return;
  //   client.getAccountResources(address).then(setResources);
  // }, [address]);
  // const resourceType = `${address}::message::MessageHolder`;
  // const resource = resources.find((r) => r.type === resourceType);
  // const data = resource?.data as {message: string} | undefined;
  // const message = data?.message;


  const getData=async () =>{
    const resources = await client.getAccountResources(moveModule);
    // const resourceType =  `${moveModule}::minting::ModuleData`;
    // const resource = resources.find((el)=>el.type === resourceType);
    console.log("Resource", resources[4].data)
    console.log(setExpiryTime(resources[4].data));
    
  }

  // const txn = async() => {
  //   const payload = {
  //     function: `${moveModule}::minting::ModuleData`,
  //     type_arguments: [],
  //     arguments: []
  //   };
    
  // }


const doTxn=async() => {
  const transaction = {
    arguments: [],
    function: '0xcb1ed5efa1b835e34bb041424cf4fb42bac2d7096b5595e199628e736122bb46::minting::mint_nft',
    type: 'entry_function_payload',
    type_arguments: ['0xcb1ed5efa1b835e34bb041424cf4fb42bac2d7096b5595e199628e736122bb46::minting::mint_nft'],
  };
  const pendingTransaction = await(window as any).aptos.signAndSubmitTransaction(transaction);
  const txn = await client.waitForTransactionWithResult(pendingTransaction.hash);
  console.log("TXN",txn);
}

 console.log("Data",expiry?.minting_enabled);
  return (
    <div className="App">
      {/* <p><code>{ address }</code></p> */}
      <button onClick={connectWallet}>Connect</button>
      <p>
        account: {userAccount}
      </p>
    
      {/* <p><code>{ address }</code></p> */}
      {/* <p><code>{ account?.sequence_number }</code></p> */}
     
      {/* {!hasModule && publishInstructions} */}
      <button onClick={getData}>Get</button>
      <button onClick={doTxn}>mint</button>
      <label>Expiry time</label><p>{expiry?.expiration_timestamp}</p>
      <label>fee receiver</label><p>{expiry?.fee_receiver_address}</p>
      <label>is enabled</label><p>{expiry?.minting_enabled?"true":"false"}</p>
      <label>Mint fee</label><p>{expiry?.mint_fee}</p>
      
      <label>Public key</label><p>{expiry?.public_key.bytes}</p>
      <label>Collection</label><p>{expiry?.token_data_id.collection}</p>
      <label>Name</label><p>{expiry?.token_data_id.name}</p>
      <label>Total Supply</label><p>{expiry?.token_minting_events.counter}</p>
    </div>
  );
}

export default App;
