import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getContracts, postContract } from "./queries";
import { handleApprove } from "./approve";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  //Fetch
  const {
    isLoading: ContractsLoading,
    // isError,
    data: escrowContracts,
    // error: ContractsError,
  } = useQuery(getContracts());

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, []);

  const { mutate: createContract, IsPending: addContractPending } = useMutation(
    postContract()
  );

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.BigNumber.from(
      document.getElementById("ether").value * 1e18
    );
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    // const escrow = {
    //   address: escrowContract.address,
    //   arbiter,
    //   beneficiary,
    //   value: value.toString(),
    //   handleApprove: async () => {
    //     escrowContract.on("Approved", () => {
    //       document.getElementById(escrowContract.address).className =
    //         "complete";
    //       document.getElementById(escrowContract.address).innerText =
    //         "✓ It's been approved!";
    //     });

    //     await approve(escrowContract, signer);
    //   },
    // };
    // setEscrows([...escrows, escrow]);

    // setEscrows(escrows);
    createContract({
      arbiter,
      beneficiary,
      value: value.toString(),
      address: escrowContract.address,
    });

    const escrows = escrowContracts
      ? await Promise.all(
          escrowContracts.map(async (contract) => {
            console.log(contract);
            return {
              ...contract,
              handleApprove: await handleApprove(
                document,
                approve,
                escrowContract,
                signer
              ),
            };
          })
        )
      : [];

    setEscrows(escrows);
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

      {addContractPending ? <div>Adding contract...</div> : null}
      {/* {addContractError ? <div>Error Adding Contract...</div> : null} */}

      {ContractsLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="existing-contracts">
          {escrows.length <= 0 ? (
            <div>No Contracts Added</div>
          ) : (
            <div id="container">
              {escrows.map((escrow) => {
                return <Escrow key={escrow.address} {...escrow} />;
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
