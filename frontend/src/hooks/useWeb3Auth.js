import { useCallback, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import {
  OpenloginAdapter,
  OPENLOGIN_NETWORK,
} from "@web3auth/openlogin-adapter";
// import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { useDispatch, useSelector } from "react-redux";

import {
  selectAuthIsInitialized,
  selectAuthModalIsOpen,
  selectIsAuthenticated,
} from "store/auth/selectors";
import {
  initiliazeAuthProvider,
  toogleAuthModal,
  logoutUser,
  setAuthIsPending
} from "store/auth/slice";

import { ethers } from "ethers";


function useWeb3Auth() {
  const [web3auth, setWeb3auth] = useState(null);
  const [web3AuthProvider, setWeb3AuthProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const authModalIsOpen = useSelector(selectAuthModalIsOpen);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authIsInitialized = useSelector(selectAuthIsInitialized);

  const dispatch = useDispatch();

  const connectedHandler = useCallback(
    (data) => {
      dispatch(setAuthIsPending(true));
    },
    [dispatch]
  );

  const disconnectedHandler = useCallback(
    (data) => {
      dispatch(setAuthIsPending(false));
    },
    [dispatch]
  );

  const logoutCleanup = useCallback(() => {
    if (isAuthenticated && !web3AuthProvider) {
      dispatch(logoutUser());
    }
  }, [dispatch, isAuthenticated, web3AuthProvider]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId: process.env.WEB3AUTH_CLIENT_ID,
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0xA869",
            rpcTarget: process.env.RPC_URL,
            displayName: "Avalanche Fuji Testnet",
            blockExplorer: "https://subnets-test.avax.network/c-chain",
            ticker: "AVAX",
            tickerName: "AVAX"
          },
          web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "optional",
          },
          adapterSettings: {
            uxMode: "popup",
            whiteLabel: {
              logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              defaultLanguage: "en",
              mode: "dark",
            },
          },
        });
        web3authInstance.configureAdapter(openloginAdapter);

        // adding torus wallet connector plugin
        // const torusPlugin = new TorusWalletConnectorPlugin({
        //   torusWalletOpts: {},
        //   walletInitOptions: {
        //     whiteLabel: {
        //       theme: { isDark: true, colors: { primary: "#FDCA40" } },
        //       logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        //       logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        //     },
        //     useWalletConnect: true,
        //     enableLogging: true,
        //   },
        // });
        // await web3authInstance.addPlugin(torusPlugin);

        
        await web3authInstance.initModal();
        console.log('initiated')
        if (web3authInstance.connected) {
          setLoggedIn(true);
          setWeb3auth(web3authInstance);
          setWeb3AuthProvider(web3authInstance.provider);
        } else if (isAuthenticated) {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error(error);
      }
    };
    console.log('pre-init')
    init();
  }, [dispatch, isAuthenticated, setWeb3AuthProvider]);

  const showLoginPopup = useCallback(async () => {
    dispatch(toogleAuthModal(false));
    if (!web3auth) return;

    const web3authProviderInstance = await web3auth.connect();
    const provider = new ethers.providers.Web3Provider(web3authProviderInstance);
    setWeb3AuthProvider(provider);
  }, [dispatch, web3auth]);

  const logout = useCallback(async () => {
    if (web3auth) await web3auth.logout();

    setWeb3AuthProvider(null);
    setLoggedIn(false);
    dispatch(logoutUser());
  }, [dispatch, web3auth]);

  
  useEffect(() => {
    // dispatch authModalIsOpen on button onclick
    if (authModalIsOpen && web3auth && web3AuthProvider)
      showLoginPopup();
  }, [
    authModalIsOpen,
    web3auth,
    web3AuthProvider,
    showLoginPopup,
  ]);

  useEffect(() => {
    dispatch(initiliazeAuthProvider());
  }, [dispatch]);


  return {
    logout,
  };
}

export default useWeb3Auth;