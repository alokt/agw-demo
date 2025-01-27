"use client";

import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useState } from "react";
import { verifyMessage } from "viem";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

export default function Home() {
  const { login } = useLoginWithAbstract();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { signMessageAsync } = useSignMessage({});

  const MESSAGE = "Hello from Abstract!";

  const handleClick = async () => {
    if (address) {
      disconnect();
      setSignature(null);
      setIsVerified(null);
      setError(null);
    } else {
      await login();
    }
  };

  const handleSignMessage = async () => {
    const signature = await signMessageAsync({
      message: MESSAGE,
    });
    setSignature(signature);
    setIsVerified(null);
    setError(null);
    console.log("Signature:", signature);
  };

  const handleVerifyMessage = async () => {
    if (!signature || !address) return;
    
    try {
      setError(null);
      const isValid = await verifyMessage({
        address,
        message: MESSAGE,
        signature,
      });
      setIsVerified(isValid);
      console.log("Verification result:", isValid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during verification');
      setIsVerified(null);
    }
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
