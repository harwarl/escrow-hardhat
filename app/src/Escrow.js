import ABI from "./artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "ethers";
import { approve, refund } from "./App";
import { useMutation } from "@tanstack/react-query";
import { updateContract } from "./queries";
import { useState, useEffect } from "react";
import { convertDate } from "./convertDate";
import { toast } from "react-toastify";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  signer,
  status,
  refunded,
  createdAt,
  _id,
}) {
  const [message, setMessage] = useState("");
  const [actionCompleted, setActionCompleted] = useState(
    status || refunded || false
  ); // Initialize based on status or refunded
  const updateContractMutation = useMutation(updateContract());

  useEffect(() => {
    if (status) {
      setMessage("✓ It's been approved!");
    } else if (refunded) {
      setMessage("✓ It's been refunded!");
    }
  }, [status, refunded]);

  // handleApprove function with toast notifications
  const handleApprove = async () => {
    const escrowContract = new ethers.Contract(address, ABI.abi, signer);

    escrowContract.once("Approved", () => {
      setMessage("✓ It's been approved!");
      setActionCompleted(true); // Mark action as completed
    });

    await toast.promise(
      (async () => {
        await approve(escrowContract, signer);
        await updateContractMutation.mutateAsync({
          contractId: _id,
          status: true,
        });
      })(),
      {
        pending: "Approval in progress...",
        success: "Contract approved successfully!",
        error: "Approval failed. Please try again.",
      }
    );
  };

  const handleRefund = async () => {
    const escrowContract = new ethers.Contract(address, ABI.abi, signer);

    escrowContract.once("Refunded", () => {
      setMessage("✓ It's been refunded!");
      setActionCompleted(true); // Mark action as completed
    });

    await toast.promise(
      (async () => {
        await refund(escrowContract, signer);
        await updateContractMutation.mutateAsync({
          contractId: _id,
          refunded: true,
        });
      })(),
      {
        pending: "Refund in progress...",
        success: "Contract refunded successfully!",
        error: "Refund failed. Please try again.",
      }
    );
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
          <div>{ethers.utils.formatEther(value.toString())} ETH</div>
        </li>
        <li>
          <div>Created: </div>
          <div>{convertDate(createdAt)}</div>
        </li>
        <div>
          {!actionCompleted ? (
            <div className="complete">
              <button
                className="button"
                id={address}
                onClick={handleApprove}
                disabled={status === true}
              >
                Approve
              </button>
              <button
                className="button"
                id={address}
                onClick={handleRefund}
                disabled={refunded === true}
                style={{ background: "#787838" }}
              >
                Refund
              </button>
            </div>
          ) : (
            <p className="complete">{message}</p>
          )}
        </div>
      </ul>
    </div>
  );
}
