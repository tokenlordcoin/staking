import React from "react";

export default function Footer() {
  return (
    <div className="py-8 footer-bg">
      <footer className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div>
            <a
              href="https://memelordapp.com/"
              className="logo flex flex-row items-center"
            >
              <img
                src="/images/logo.png"
                width="220"
                className="cursor-pointer"
                alt="https://memelordapp.com/"
              />
            </a>
            <div className="uppercase text-white text-md mb-3 mt-4 text-left">
              Follow Us
            </div>
            <div className="flex flex-row items-center ">
              <a
                href="https://twitter.com/memelord_coin/"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-x.svg" alt="" width="20" />
              </a>
              <a
                href="https://t.me/memelord_coin"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <img src="/images/sm-telegram.svg" alt="" width="20" />
              </a>
            </div>
          </div>
          <div className="text-white leading-7 text-xs cursor-pointer flex flex-col">
            <a
              rel="noreferrer noopener"
              href="https://memelordapp.com/"
              className="font-Montserrat-ExtraBold uppercase"
            >
              About Us
            </a>
            {/* <div>Project</div> */}
            <a rel="noreferrer noopener" href="https://memelordapp.com/">
              Website
            </a>
            <a rel="noreferrer noopener" href="https://memelordapp.com/">
              Team
            </a>
            {/* <div>Ecosystem</div> */}
          </div>
          <div className="text-white leading-7 text-xs cursor-pointer flex flex-col">
            <div className="font-Montserrat-ExtraBold uppercase">
              Documentation
            </div>
            <a
              href="https://memelordapp.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Taxes & Tokenomics
            </a>
            <a
              href="https://memelordapp.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Road Map
            </a>
          </div>
        </div>
        <div className="footer-copyright text-center py-3 text-xs text-white mt-5">
          <div fluid>
            &copy; {new Date().getFullYear()} Copyright - Staking TokenLord -
            Web3 - v0.0.1
          </div>
        </div>
      </footer>
    </div>
  );
}
