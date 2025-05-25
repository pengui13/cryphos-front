import Modal from "react-modal";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function BotModal({ open, opened }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  return (
    <div>
      <Modal
        isOpen={opened}
        onRequestClose={() => open(false)}
        className={`max-w-[400px] w-full px-4 flex gap-3 outline-none flex-col bg-bkg items-center rounded-xl p-7 `}
        overlayClassName="fixed inset-0 px-4 rounded-xl bg-black bg-opacity-50 flex justify-center items-center z-[10004]"
      >
        <div className="flex flex-col items-center justify-center w-full  gap-7">
          <div className="flex flex-col w-full items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center gap-3">
              <p className="font-semibold text-bl text-2xl text-center">
                {"urBotCreated"}
              </p>
              <p className="font-semibold text-bl  text-center">
                {"nowBotConfigured"}🥳
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-16 h-16 bg-root-green rounded-full pb-[6px]">
              <Image
                src={"/assets/icons/bot_whitiey.svg"}
                width={40}
                height={39}
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <Link href={"/my-bots"} className="w-full">
              <button className={"w-full"}>{"watchMyBots"}</button>
            </Link>
            <button
              onClick={() => open(false)}
              transparent={true}
              classes={"w-full"}
            >
              {"close"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
