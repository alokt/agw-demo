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
  //   try {
  //     const recovered = recoverTypedSignature({
  //       data: formatEIP712DataForVerification({ message }, chainId),
  //       signature,
  //       version: SignTypedDataVersion.V4,
  //     });
  //     console.log("recovered", recovered);
  //     return address.toLowerCase() === recovered.toLowerCase();
  //   } catch (_error) {
  //     console.log(_error);
  //     return false;
  //   }

  const recoveredAddress = await utils.verifyTypedData(
    {
      chainId,
      name: "Collab.Land Connect",
      // verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      version: "1",
    },
    {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        // { name: 'verifyingContract', type: 'address' },
      ],
      Verify: [{ name: "message", type: "string" }],
    },
    [{ name: "message", type: "string" }],
    signature
  );
  console.log("recoveredAddress", recoveredAddress);
  return address.toLowerCase() === recoveredAddress.toLowerCase();
}
