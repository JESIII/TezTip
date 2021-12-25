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
  // const [newDonee, setNewDonee] = useState<string>("");
  // const [newMin_Donation, setNewMin_Donation] = useState<number>(0);
  const Change_Donee = async (e: any): Promise<void> => {
    setChange_Donee(true);
    try {
      let newDonee = e.target[0].value;
      console.log(newDonee);
      const op = await contract.methods.Change_Donee(newDonee).send();
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

  const Change_Min_Donation = async (e: any): Promise<void> => {
    setChange_Min_Donation(true);
    try {
      let newMinDonation = e.target[0].value;
      console.log(newMinDonation);
      const op = await contract.methods.Change_Min_Donation(newMinDonation).send();
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
    <div className="forms">
      <form id='doneeForm' onSubmit={Change_Donee}>
        <input type='text'/>
        <button className="button" disabled={loadingChange_Donee} type='submit'>
          {loadingChange_Donee ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i>&nbsp;Please wait
            </span>
          ) : (
            <span>
              <i className="fas"></i>&nbsp;Change donee
            </span>
          )}
        </button>
      </form>
      <form id='minDonationForm' onSubmit={Change_Min_Donation}>
        <input type='text'/>
        <button className="button" type='submit'>
          {loadingChange_Min_Donation ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i>&nbsp;Please wait
            </span>
          ) : (
            <span>
              <i className="fas"></i>&nbsp;Change min donation
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateContract;
