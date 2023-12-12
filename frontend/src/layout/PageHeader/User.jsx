import { useDispatch, useSelector } from "react-redux";
// AUTH
import {
    selectIsAuthenticated,
  } from "store/auth/selectors";
// import useWeb3Auth from "@hooks/useWeb3Auth";

// UI
import styles from './styles.module.scss';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { ZeroDevWeb3Auth } from '@zerodev/web3auth';
import { userAuth } from "@store/auth/actions";

const User = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const { isConnected, address } = useAccount();

    useEffect(() => {
        if (isConnected) {
            const zeroDevWeb3Auth = ZeroDevWeb3Auth.getInstance([process.env.REACT_APP_0DEV_PROJECT_ID])
            zeroDevWeb3Auth.getUserInfo().then((userInfo) => {
                console.log(userInfo)
                dispatch(userAuth({address: address, name: userInfo?.name, login_type: userInfo?.typeOfLogin, image: userInfo?.profileImage}));
            })
        }
    }, [isConnected])

    return (
        <ConnectButton label={"Sign In"} />
    );

}

export default User