"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: any;
}

export default function VerifyModal({ open, setOpen, user }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* Background Blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-neutral-900 border border-neutral-800 w-[420px] rounded-2xl text-white p-6 relative">

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <Image
              src={user.image || "/profile.png"}
              alt="Profile"
              width={60}
              height={60}
              className="rounded-full"
            />

            <h2 className="text-xl font-semibold mt-3">
              {user.name}
            </h2>

            <p className="text-neutral-400 text-sm">
              Manage your profile verification.
            </p>
            <p className=" bg-red-500/20 text-red-400 text-lg mt-2 px-2 py-1 rounded-md">
              Coming soon...
            </p>
          </div>

          {/* Options */}
          <div className="mt-6 space-y-3">

            <div className="border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Workplace</p>
                <p className="text-xs text-neutral-500">
                  Only current workplace can be verified.
                </p>
              </div>

              <span className="text-xs bg-neutral-800 px-2 py-1 rounded-md">
                Not Eligible
              </span>
            </div>

            <div className="border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Education</p>
                <p className="text-xs text-neutral-500">
                  Only current education can be verified.
                </p>
              </div>

              <span className="text-xs bg-neutral-800 px-2 py-1 rounded-md">
                Not Eligible
              </span>
            </div>

            <div className="border border-neutral-800 rounded-xl p-4 flex justify-between items-center hover:bg-neutral-800 cursor-pointer">
              <div>
                <p className="font-medium">Identity</p>
                <p className="text-xs text-neutral-500">
                  Verify identity with government-issued ID.
                </p>
              </div>

              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-md">
                Unverified →
              </span>
            </div>

          </div>

          <div className="text-center mt-6">
            <a className="text-sm text-blue-400 hover:underline">
              More about verification
            </a>
          </div>

        </div>
      </div>
    </>,
    document.body
  );
}
