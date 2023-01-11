import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useAgreement } from "../hooks/agreement";

const Home = () => {
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
        </>
      ) : (
        <>
        <h1>Not Initialized</h1>
        <input value={name} onChange = {nameHandleChange} type="text" placeholder="Enter The Name" autoComplete="off"></input>
        <button onClick={()=> initializeUser()} disabled={transactionPending}>INIT</button>
        </>
      )}
      <WalletMultiButton/>
    </div>
  </>;
};

export default Home;
