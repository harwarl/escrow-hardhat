export const handleApprove = async (
  document,
  approve,
  escrowContract,
  signer
) => {
  escrowContract.on("Approved", () => {
    document.getElementById(escrowContract.address).className = "complete";
    document.getElementById(escrowContract.address).innerText =
      "✓ It's been approved!";
  });

  await approve(escrowContract, signer);
};
