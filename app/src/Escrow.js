import ABI from "./artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "ethers";
import { approve, refund } from "./App";
import { useMutation } from "@tanstack/react-query";
import { updateContract } from "./queries";
import { useState } from "react";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  signer,
  status,
  refunded,
  _id,
}) {
  const [message, setMessage] = useState("");
  const [actionCompleted, setActionCompleted] = useState(false);
  const updateContractMutation = useMutation(updateContract);

  const handleApprove = async () => {
    try {
      const escrowContract = new ethers.Contract(address, ABI.abi, signer);
      escrowContract.on("Approved", () => {
        setMessage("✓ It's been approved!");
        setActionCompleted(true); // Mark action as completed
      });

      await approve(escrowContract, signer);
      await updateContractMutation.mutateAsync({
        contractId: _id,
        status: true,
      });
    } catch (error) {
      console.error("Error in handleApprove:", error);
    }
  };

  const handleRefund = async () => {
    try {
      const escrowContract = new ethers.Contract(address, ABI.abi, signer);
      escrowContract.on("Refunded", () => {
        setMessage("✓ It's been refunded!");
        setActionCompleted(true); // Mark action as completed
      });

      await refund(escrowContract, signer);
      await updateContractMutation.mutateAsync({
        contractId: _id,
        refunded: true,
      });
    } catch (error) {
      console.error("Error in handleRefund:", error);
    }
  };

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div>Arbiter</div>
          <div>{arbiter}</div>
        </li>
        <li>
          <div>Beneficiary</div>
          <div>{beneficiary}</div>
        </li>
        <li>
          <div>Value</div>
          <div>{value}</div>
        </li>
        <div>
          {!actionCompleted ? (
            <>
              {!refunded && !status && (
                <button
                  className="button"
                  id={address}
                  onClick={handleApprove}
                  disabled={status === true}
                >
                  Approve
                </button>
              )}
              {!status && !refunded && (
                <button
                  className="button"
                  id={address}
                  onClick={handleRefund}
                  disabled={refunded === true}
                  style={{ background: "#787838" }}
                >
                  Refund
                </button>
              )}
            </>
          ) : (
            <p className="complete">{message}</p>
          )}
        </div>
      </ul>
    </div>
  );
}
