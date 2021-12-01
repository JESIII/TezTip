import React, { useState, Dispatch, SetStateAction } from "react";
import { TezosToolkit, WalletContract } from "@taquito/taquito";

interface UpdateContractProps {
  contract: WalletContract | any;
  setUserBalance: Dispatch<SetStateAction<any>>;
  Tezos: TezosToolkit;
  userAddress: string;
  setStorage: Dispatch<SetStateAction<string>>;
}

const UpdateContract = ({ contract, setUserBalance, Tezos, userAddress, setStorage }: UpdateContractProps) => {
  const [loadingChange_Donee, setChange_Donee] = useState<boolean>(false);
  const [loadingChange_Min_Donation, setChange_Min_Donation] = useState<boolean>(false);

  const Change_Donee = async (): Promise<void> => {
    setChange_Donee(true);
    try {
      const op = await contract.methods.Change_Donee('tz1i1obBJZNmMjQXHocSQwxezcSAuWYyp9cp').send();
      await op.confirmation();
      const newStorage: any = await contract.storage();
      if (newStorage) setStorage(JSON.stringify(newStorage));
      setUserBalance(await Tezos.tz.getBalance(userAddress));
    } catch (error) {
      console.log(error);
    } finally {
      setChange_Donee(false);
    }
  };

  const Change_Min_Donation = async (): Promise<void> => {
    setChange_Min_Donation(true);
    try {
      const op = await contract.methods.Change_Min_Donation(10).send();
      await op.confirmation();
      const newStorage: any = await contract.storage();
      if (newStorage) setStorage(newStorage.toNumber());
      setUserBalance(await Tezos.tz.getBalance(userAddress));
    } catch (error) {
      console.log(error);
    } finally {
      setChange_Min_Donation(false);
    }
  };

  if (!contract && !userAddress) return <div>&nbsp;</div>;
  return (
    <div className="buttons">
      <button className="button" disabled={loadingChange_Donee} onClick={Change_Donee}>
        {loadingChange_Donee ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="fas fa-plus"></i>&nbsp; Change donee
          </span>
        )}
      </button>
      <button className="button" onClick={Change_Min_Donation}>
        {loadingChange_Min_Donation ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="fas fa-minus"></i>&nbsp; Change min donation
          </span>
        )}
      </button>
    </div>
  );
};

export default UpdateContract;
