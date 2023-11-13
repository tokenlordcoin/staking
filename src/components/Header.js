import React, { useState } from "react";
import cx from "classnames";
import { useMediaQuery } from "react-responsive";
import Button from "../components/common/Button";
import { ConnectKitButton } from "connectkit";
import {
  AiOutlineGlobal,
  AiOutlineBook,
  AiOutlineLineChart,
} from "react-icons/ai";
import { FaFaucetDrip } from "react-icons/fa6";
import DelayedButton from "../utils/delayedButton";

export default function Header() {
  const [clicked, setClicked] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const renderButton = () => {
    return (
      <>
        <button
          className={cx(
            "menu focus:outline-none",
            clicked ? "opened absolute z-50 top-0 right-1 mt-2" : ""
          )}
          onClick={() => {
            window.scrollTo(0, 0);
            if (!clicked) {
              document.body.style.overflowY = "hidden";
            } else {
              document.body.style.overflowY = "auto";
            }
            setClicked(!clicked);
          }}
          aria-label="Main Menu"
          aria-expanded={clicked}
        >
          <svg width="60" height="60" viewBox="0 0 100 100">
            <path
              className="line line1"
              d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
            />
            <path className="line line2" d="M 20,50 H 80" />
            <path
              className="line line3"
              d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
            />
          </svg>
        </button>
      </>
    );
  };

  return (
    <header className="container px-4 mx-auto py-8">
      {isDesktopOrLaptop ? (
        <>
          <div className="flex flex-row justify-between items-center relative">
            <span>
              <img src="/images/logo.png" width="220" alt="memelordapp.com" />
            </span>
            <span>
              <a
                href="https://memelordapp.com/"
                rel="noreferrer noopener"
                target="_blank"
              >
                {" "}
                <span className="text-white ml-5 p-4 text-sm sm:text-xl font-Montserrat-ExtraBold cursor-pointer  hover:text-red-600 ">
                  Website
                </span>
              </a>
              <a
                href="https://www.dextools.io/app/en/ether/pair-explorer/0x4f0d0b05e14070e4f83e4d8ef6f51f9942734bd8"
                rel="noreferrer noopener"
                target="_blank"
              >
                {" "}
                <span className="text-white ml-5 p-4 text-sm sm:text-xl font-Montserrat-ExtraBold cursor-pointer  hover:text-red-600 ">
                  Chart
                </span>
              </a>
              <a
                href="https://memelordapp.com/"
                rel="noreferrer noopener"
                target="_blank"
              >
                <span className="text-white ml-5 p-4 text-sm sm:text-xl font-Montserrat-ExtraBold cursor-pointer  hover:text-red-600 ">
                  Faucet WEB3Tokens
                </span>
              </a>
            </span>
            <span>
              <DelayedButton waitBeforeShow={200}>
                <ConnectKitButton.Custom>
                  {({
                    isConnected,
                    show,
                    truncatedAddress,
                    ensName,
                    isConnecting,
                  }) => {
                    return (
                      <>
                        <Button
                          className="w-1/4 md:w-auto text-xs md:text-lg flex flex-row justify-center mx-auto mr-2"
                          uppercase={false}
                          onClick={show}
                        >
                          {isConnected ? (
                            ensName ?? truncatedAddress
                          ) : (
                            <>
                              {!isDesktopOrLaptop && (
                                <img
                                  src="/images/wallet.svg"
                                  alt="WalletConnect"
                                  width={isDesktopOrLaptop ? 30 : 25}
                                />
                              )}
                              {isDesktopOrLaptop && <>CONNECT WALLET</>}
                            </>
                          )}
                        </Button>
                      </>
                    );
                  }}
                </ConnectKitButton.Custom>
              </DelayedButton>
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row justify-between items-center relative">
            <img src="/images/logo.png" width="140" alt="memelordapp.com/" />

            <ConnectKitButton.Custom>
              {({
                isConnected,
                show,
                truncatedAddress,
                ensName,
                isConnecting,
              }) => {
                return (
                  <>
                    <Button
                      className="w-1/4 md:w-auto text-xs md:text-lg flex flex-row justify-center mx-auto mr-2"
                      uppercase={false}
                      onClick={show}
                    >
                      {isConnected ? (
                        ensName ?? truncatedAddress
                      ) : (
                        <>
                          {!isDesktopOrLaptop && (
                            <img
                              src="/images/wallet.svg"
                              alt="WalletConnect"
                              width={isDesktopOrLaptop ? 30 : 25}
                            />
                          )}
                          {isDesktopOrLaptop && <>CONNECT WALLET</>}
                        </>
                      )}
                    </Button>
                  </>
                );
              }}
            </ConnectKitButton.Custom>

            <div className="cursor-pointer">{renderButton()}</div>
          </div>
          <div
            className={cx(
              "w-full h-full fixed inset-0 z-40  text-white font-Montserrat-ExtraBold uppercase flex-col justify-center text-4xl transition duration-500 ease-in-out",
              clicked ? "flex bg-black" : "hidden bg-transparent"
            )}
          >
            <div className="flex flex-col mx-auto justify-center text-center">
              <a
                rel="noreferrer noopener"
                className={cx(
                  "transition duration-500 ease-in-out delay-500 py-4",
                  clicked ? "opacity-100" : "opacity-0"
                )}
                href="https://memelordapp.com/"
              >
                <span className="flex flex-row justify-center">
                  {" "}
                  <AiOutlineGlobal className="mt-2 mr-2" /> Website
                </span>
              </a>
              <a
                rel="noreferrer noopener"
                className={cx(
                  "transition duration-500 ease-in-out delay-500 py-4",
                  clicked ? "opacity-100" : "opacity-0"
                )}
                href="https://memelordapp.com/"
              >
                <span className="flex flex-row justify-center">
                  {" "}
                  <AiOutlineBook className="mt-2 mr-2" /> Docs
                </span>
              </a>

              <a
                rel="noreferrer noopener"
                className={cx(
                  "transition duration-500 ease-in-out delay-500 py-4",
                  clicked ? "opacity-100" : "opacity-0"
                )}
                href="https://www.dextools.io/app/en/ether/pair-explorer/0x4f0d0b05e14070e4f83e4d8ef6f51f9942734bd8"
              >
                <span className="flex flex-row justify-center">
                  {" "}
                  <AiOutlineLineChart className="mt-2 mr-2" /> Chart
                </span>
              </a>
              <a
                rel="noreferrer noopener"
                className={cx(
                  "transition duration-500 ease-in-out delay-500 py-4",
                  clicked ? "opacity-100" : "opacity-0"
                )}
                href="https://memelordapp.com/"
              >
                <span className="flex flex-row justify-center">
                  {" "}
                  <FaFaucetDrip size={27} className="mt-3 mr-2" /> Faucet
                </span>
              </a>
              <span
                className={cx(
                  "mt-10 text-white font-Montserrat-ExtraBold flex-col justify-center text-xs  ",
                  clicked ? "flex bg-black" : "hidden bg-transparent"
                )}
              >
                &copy; {new Date().getFullYear()} Copyright{" "}
                <a href="https://memelordapp.com/">
                  {" "}
                  Copyright - Staking Lordtoken - Web3 - v0.0.1{" "}
                </a>
              </span>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
