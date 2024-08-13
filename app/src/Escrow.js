import ABI from "./artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "ethers";
import { approve } from "./App";
import { useMutation } from "@tanstack/react-query";
import { updateContract } from "./queries";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  signer,
  status,
  _id,
}) {
  const updateContractMutation = useMutation(updateContract);

  const handleApprove = async () => {
    const escrowContract = new ethers.Contract(address, ABI.abi, signer);
    escrowContract.on("Approved", () => {
      document.getElementById(escrowContract.address).className = "complete";
      document.getElementById(escrowContract.address).innerText =
        "✓ It's been approved!";
    });

    await approve(escrowContract, signer);
    //update the status of the contract
    await updateContractMutation.mutateAsync(_id);
  };

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <div
          className={status ? "complete" : "button"}
          id={address}
          onClick={(e) => {
            e.preventDefault();
            if (status === false) {
              handleApprove();
            }
          }}
          style={{ cursor: status === true ? "not-allowed" : "pointer" }}
        >
          {status === true ? "✓ It's been approved!" : "Approve"}
        </div>
      </ul>
    </div>
  );
}
