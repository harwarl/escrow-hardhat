import axios from "axios";
import { queryClient } from ".";
import { refund } from "./App";
const api_url = "http://localhost:3000";

const axiosInstance = axios.create({
  baseUrl: api_url,
  timeout: 1000,
});

//Get all the contracts
export const getContracts = () => {
  return {
    queryKey: ["contracts"],
    queryFn: async () => {
      const response = await axiosInstance.get("/contracts");
      return response.data.contracts;
    },
  };
};

//Add a new contract to the database
export const postContract = () => {
  return {
    mutationFn: async (newContract) => {
      const contract = await axiosInstance.post("/contracts", newContract);
      return contract;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contracts"]);
    },
  };
};

//update the approval status of a project
export const updateContract = () => {
  return {
    mutationFn: async ({ contractId, status, refunded }) => {
      console.log({ status, refunded });
      let adjustObject = {};
      if (status) {
        adjustObject.status = true;
      }
      if (refunded) {
        adjustObject.refunded = true;
      }
      return await axiosInstance.patch(
        `/contracts/${contractId}`,
        adjustObject
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contracts"]);
    },
  };
};
