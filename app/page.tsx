"use client";

import {
  useAbstractClient,
  useLoginWithAbstract,
} from "@abstract-foundation/agw-react";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import { formatEIP712DataForVerification } from "@/utils/eip712helper";

export default function Home() {
  const { login } = useLoginWithAbstract();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const MESSAGE = "Hello world!";

  const { data: agwClient } = useAbstractClient();
  // const {} = useVerifyTypedData();

  // const signatureResult = useVerifyTypedData({
  //   domain: {
  //     chainId: 1,
  //     name: "Collab.Land Connect",
  //     // verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  //     version: "1",
  //   },
  //   types: {
  //     EIP712Domain: [
  //       { name: "name", type: "string" },
  //       { name: "version", type: "string" },
  //       { name: "chainId", type: "uint256" },
  //       // { name: 'verifyingContract', type: 'address' },
  //     ],
  //     Verify: [{ name: "message", type: "string" }],
  //   },
  //   message: { message: MESSAGE },
  //   primaryType: "Verify",
  //   address: "0x21deBfAe52C5CEe564e27d0dF2a534C475bc6014",
  //   signature:
  //     "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000074b9ae28ec45e3fa11533c7954752597c3de3e7a0000000000000000000000000000000000000000000000000000000000000041589a5c3b0e0f93db8353566a40f2c004477b29b0eebf4e0103eb425df26ad09b1d9df60f9d49b70e191ec97a5273180cb000939a4346b32005f113e0c2709d861c00000000000000000000000000000000000000000000000000000000000000",
  // });

  const handleClick = async () => {
    if (address) {
      disconnect();
      setSignature(null);
      setError(null);
    } else {
      await login();
    }
  };

  const handleSignMessage = async () => {
    if (!agwClient) return;
    const msgParams = formatEIP712DataForVerification({ message: MESSAGE }, 1);
    const signature = await agwClient.signTypedData(msgParams);
    console.log("signature", signature);

    setSignature(signature);
    setError(null);
  };

  const handleVerifyMessage = async () => {
    if (!signature || !address) return;
    // add logic to verify message and print the result
    const isVerified = false;
    console.log("isVerified", isVerified);
    setIsVerified(isVerified);
  };

  let content;
  if (error) {
    content = (
      <>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg min-w-[300px] text-center mb-4">
          {error}
        </div>
        {address && (
          <>
            <div className="p-4 bg-gray-100 rounded-lg min-w-[300px] text-center">
              <p className="font-mono break-all">{address}</p>
            </div>
            {signature && (
              <>
                <div className="p-4 bg-gray-100 rounded-lg min-w-[300px] text-center">
                  <p className="text-sm text-gray-500 mb-1">Signature:</p>
                </div>
                {isVerified !== null && (
                  <div
                    className={`text-center p-2 rounded-md ${
                      isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Signature is {isVerified ? "valid" : "invalid"}
                  </div>
                )}
              </>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleClick}
                className="px-4 py-2 text-white rounded-md transition-colors bg-red-500 hover:bg-red-600 active:bg-red-700"
              >
                Disconnect
              </button>
              <button
                onClick={signature ? handleVerifyMessage : handleSignMessage}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  signature
                    ? "bg-purple-500 hover:bg-purple-600 active:bg-purple-700"
                    : "bg-green-500 hover:bg-green-600 active:bg-green-700"
                }`}
              >
                {signature ? "Verify Message" : "Sign Message"}
              </button>

              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg min-w-[300px] text-center">
                  {error}
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  } else if (address) {
    content = (
      <>
        <div className="p-4 bg-gray-100 rounded-lg min-w-[300px] text-center">
          <p className="font-mono break-all">{address}</p>
        </div>
        {signature && (
          <>
            <div className="p-4 bg-gray-100 rounded-lg min-w-[300px] text-center">
              <p className="text-sm text-gray-500 mb-1">Signature:</p>
              <p className="font-mono break-all text-sm">{signature}</p>
            </div>
            {isVerified !== null && (
              <div
                className={`text-center p-2 rounded-md ${
                  isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Signature is {isVerified ? "valid" : "invalid"}
              </div>
            )}
          </>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleClick}
            className="px-4 py-2 text-white rounded-md transition-colors bg-red-500 hover:bg-red-600 active:bg-red-700"
          >
            Disconnect
          </button>
          <button
            onClick={signature ? handleVerifyMessage : handleSignMessage}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              signature
                ? "bg-purple-500 hover:bg-purple-600 active:bg-purple-700"
                : "bg-green-500 hover:bg-green-600 active:bg-green-700"
            }`}
          >
            {signature ? "Verify Message" : "Sign Message"}
          </button>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className="p-4 bg-gray-100 rounded-lg min-w-[300px] text-center">
          <p className="text-gray-500">Not connected</p>
        </div>
        <button
          onClick={handleClick}
          className="px-4 py-2 text-white rounded-md transition-colors bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        >
          Login with Abstract
        </button>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
      {content}
    </div>
  );
}
