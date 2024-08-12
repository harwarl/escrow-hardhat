import ABI from "./artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "ethers";
import { approve } from "./App";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  signer,
}) {
  const handleApprove = async () => {
    const escrowContract = new ethers.Contract(address, ABI.abi, signer);
    escrowContract.on("Approved", () => {
      document.getElementById(escrowContract.address).className = "complete";
      document.getElementById(escrowContract.address).innerText =
        "✓ It's been approved!";
    });

    await approve(escrowContract, signer);
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
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
