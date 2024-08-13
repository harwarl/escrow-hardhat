import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getContracts, postContract } from "./queries";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function refund(escrowContract, signer) {
  const refundTxn = await escrowContract.connect(signer).refund();
  await refundTxn.wait();
}

function App() {
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  //Fetch
  const getAllContractsQuery = useQuery(getContracts());
  const addNewContractMutation = useMutation(postContract());

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, []);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.BigNumber.from(
      document.getElementById("ether").value * 1e18
    );

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    addNewContractMutation.mutateAsync({
      arbiter,
      beneficiary,
      value: value.toString(),
      address: escrowContract.address,
    });
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      {addNewContractMutation.isPending ? <div>Adding contract...</div> : null}

      {getAllContractsQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="existing-contracts">
          {getAllContractsQuery.data.length <= 0 ? (
            <div>No Contracts Added</div>
          ) : (
            <div id="container">
              <h1>Existing Contracts</h1>
              {getAllContractsQuery.data.map((escrow) => {
                return (
                  <Escrow key={escrow.address} {...escrow} signer={signer} />
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
    </>
  );
}

export default App;
