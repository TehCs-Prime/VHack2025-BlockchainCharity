// src/hooks/useCharityContract.ts
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contract";

export const getCharityContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  return contract;
};
