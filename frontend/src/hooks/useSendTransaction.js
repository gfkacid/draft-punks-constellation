import { usePrepareSendUserOperation, useSendUserOperation } from "@zerodev/wagmi";
import { useWaitForTransaction } from "wagmi";
import { useState } from "react";

const useSendTransaction = () => {
    const [address, setAddress] = useState(null);
    const [functionData, setFunctionData] = useState(null);
    const [success,setSuccess] = useState(false);
    
    const { config } = usePrepareSendUserOperation({
        to: address,
        data: functionData,
        value: 0,
      });
      
      const { sendUserOperation, data } = useSendUserOperation(config);
      
      // Wait on the status of the tx
      useWaitForTransaction({
        hash: data?.hash,
        enabled: !!data,
        onSuccess(data) {
          console.log("Transaction was successful.")
          setSuccess(true);
        }
      })
      
      const sendTransaction = () => {
        sendUserOperation();
        return success;
      }
      

    return {setAddress,setFunctionData,sendTransaction}
}

export default useSendTransaction;