import { utils } from "ethers";

export function formatEIP712Data(
  message: { message: string },
  chainId: number
) {
  return {
    domain: {
      chainId,
      name: "Collab.Land Connect",
      // verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      version: "1",
    },
    primaryType: "Verify",
    message,
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        // { name: 'verifyingContract', type: 'address' },
      ],
      Verify: [{ name: "message", type: "string" }],
    },
  };
}

export function formatEIP712DataForVerification(
  message: { message: string },
  chainId: number
) {
  const data = {
    domain: {
      chainId: chainId,
      name: "Collab.Land Connect",
      // verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      version: "1",
    },
    primaryType: "Verify" as const,
    message,
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        // {name: 'verifyingContract', type: 'address'},
      ],
      Verify: [{ name: "message", type: "string" }],
    },
  };
  return data;
}

export async function verifyTypedSignature_v4(
  address: string,
  signature: string,
  message: string,
  chainId: number
): Promise<boolean> {
  const temp = utils.verifyMessage(message, signature);
  console.log("temp", temp);
  try {
    const domain = {
      chainId,
      name: "Collab.Land Connect",
      version: "1",
    };

    // Define types without EIP712Domain (ethers handles this internally)
    const types = {
      Verify: [{ name: "message", type: "string" }],
    };

    // The actual data to verify
    const value = {
      message,
    };

    const recoveredAddress = await utils.verifyTypedData(
      domain,
      types,
      value,
      signature
    );
    console.log("recoveredAddress", recoveredAddress);
    return address.toLowerCase() === recoveredAddress.toLowerCase();
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
}
