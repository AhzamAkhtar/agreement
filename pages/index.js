import dynamic from 'next/dynamic';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useAgreement } from "../hooks/agreement";

const Home = () => {
  const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
  const {
    initializeUser,
    createContract,
    nameHandleChange,
    personOneAddyHandler,
    personTwoAddyHandler,
    contentHandler,
    contractTypeHandler,
    expTimeHandler,
    name,
    index,
    indexHandler,
    person_one_contract_addy,
    person_two_contract_addy,
    content,
    contract_type,
    exp_time,
    initialized,
    transactionPending,
  } = useAgreement();
  return <>

    <div>
      {initialized ? (
        <>
        <h1>Initialized</h1>

        <input value={index} placeholder="Enter the index" onChange={indexHandler} type="text"></input>

        <input value={person_one_contract_addy} placeholder="Enter person 1" onChange={personOneAddyHandler} type="text"></input>

        <input value={person_two_contract_addy} placeholder="Enter person 2" onChange={personTwoAddyHandler} type="text"></input>

        <input value={content} placeholder="content" onChange={contentHandler} type="text"></input>

        <input value={contract_type} placeholder="enter content type" onChange={contractTypeHandler} type="text"></input>

        <input value={exp_time} placeholder="Enter exp time" onChange={expTimeHandler} type="text"></input>

        <button onClick={() => createContract()}>
          AddContract
        </button>

        </>
      ) : (
        <>
        <h1>Not Initialized</h1>
        <input value={name} onChange = {nameHandleChange} type="text" placeholder="Enter The Name" autoComplete="off"></input>
        <button onClick={()=> initializeUser()} disabled={transactionPending}>INIT</button>
        </>
      )}
      <WalletMultiButtonDynamic/>
    </div>
  </>;
};

export default Home;
