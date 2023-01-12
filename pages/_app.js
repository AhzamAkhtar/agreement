import { WalletConnectProvider } from "../components/WalletConnectProvider";
import "../styles/globals.css";
import '@solana/wallet-adapter-react-ui/styles.css'

function MyApp({ Component, pageProps }) {
  return (
    
    <div>

    <WalletConnectProvider>
      <Component {...pageProps} />
    </WalletConnectProvider>
    </div>
   
  );
}

export default MyApp;
