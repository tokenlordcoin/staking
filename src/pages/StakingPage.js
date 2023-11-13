import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import { initWeb3 } from "../utils/initWeb3.js";
import StakingContract from "../contracts/StakingContract.json";
import fromExponential from "from-exponential";
import {
  formattedShort,
  formattedNumberTwo,
  formattedNumber,
  getFullDisplayBalance,
} from "../utils/formatNumber.js";
import AnimatedNumber from "animated-number-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import ERC20 from "../contracts/ERC20.json";
import CONFIG from "../utils/config.js";

const StakingPage = () => {
  const { address } = useAccount();
  const [web3, setWeb3] = useState();

  const [stakeLoading, setStakeLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [accounts, setAccounts] = useState();
  const [stakingCA, setStakingCA] = useState();
  const [tokenContract, setTokenContract] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [balance, setBalance] = useState();
  const [totalStaked, setTotalStaked] = useState();
  const [stakes, setStakes] = useState();
  const [minStake, setMinStake] = useState();
  const [stakingTax, setStakingTax] = useState();
  const [unstakingTax, setUnstakingTax] = useState();
  const [registrationTax, setRegistrationTax] = useState();
  const [referralRewards, setReferralRewards] = useState();
  const [referralCount, setReferralCount] = useState();
  const [dailyROI, setDailyROI] = useState();
  const [stakingRewards, setStakeRewards] = useState();
  const [minRegister, setMinRegister] = useState();
  const [totalRewards, setTotalRewards] = useState();
  const [registeredStatus, setRegisteredStaus] = useState();
  const [amount, setAmount] = useState();
  const [unstakeAmount, setUnstakeAmount] = useState();
  const [referrer, setReferrer] = useState();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const { wallet } = useParams();

  const isReady = useCallback(() => {
    return !!stakingCA && !!web3 && !!accounts;
  }, [stakingCA, web3, accounts]);

  useEffect(() => {
    const init = async () => {
      try {
        if (isReady()) {
          return;
        }

        let web3 = await initWeb3();
        const accounts = await web3.eth.getAccounts();
        const tokenContractInstance = new web3.eth.Contract(
          ERC20,
          CONFIG.tokenAddress
        );
        const stakingContractInstance = new web3.eth.Contract(
          StakingContract.abi,
          CONFIG.stakingContract
        );

        const [
          totalSupplyValue,
          balanceValue,
          totalStakedValue,
          minStakeValue,
          stakingTaxRateValue,
          unstakingTaxRateValue,
          registrationTaxValue,
          referralRewardsValue,
          referralCountValue,
          dailyROIValue,
          statusValue,
        ] = await Promise.all([
          tokenContractInstance.methods.totalSupply().call(),
          tokenContractInstance.methods.balanceOf(accounts[0]).call(),
          stakingContractInstance.methods.totalStaked().call(),
          stakingContractInstance.methods.minimumStakeValue().call(),
          stakingContractInstance.methods.stakingTaxRate().call(),
          stakingContractInstance.methods.unstakingTaxRate().call(),
          stakingContractInstance.methods.registrationTax().call(),
          stakingContractInstance.methods.referralRewards(accounts[0]).call(),
          stakingContractInstance.methods.referralCount(accounts[0]).call(),
          stakingContractInstance.methods.dailyROI().call(),
          stakingContractInstance.methods.registered(accounts[0]).call(),
        ]);

        setWeb3(web3);
        setAccounts(accounts);
        setStakingCA(stakingContractInstance);
        setTokenContract(tokenContractInstance);
        setTotalSupply(totalSupplyValue);
        setBalance(balanceValue);
        setTotalStaked(Number(totalStakedValue));
        setMinStake(Number(minStakeValue));
        setStakingTax(Number(stakingTaxRateValue));
        setUnstakingTax(Number(unstakingTaxRateValue));
        setRegistrationTax(Number(registrationTaxValue));
        setReferralRewards(Number(referralRewardsValue));
        setReferralCount(Number(referralCountValue));
        setDailyROI(Number(dailyROIValue));
        setRegisteredStaus(Number(statusValue));

        window.ethereum.on("accountsChanged", (newAccounts) => {
          setAccounts(newAccounts);
        });
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, [address, isReady]);

  async function updateAll() {
    await Promise.all([
      updateStakes(),
      updateTotalSupply(),
      updateAccountBalance(),
      updateTotalStaked(),
      stakeRewards(),
      minRegisteration(),
      totalReward(),
      updateReferrals(),
      updateStatus(),
    ]);
  }

  useEffect(() => {
    if (isReady()) {
      updateAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingCA, tokenContract, web3, accounts]);

  async function updateStakes() {
    const stake = await stakingCA.methods.stakes(accounts[0]).call();
    setStakes(stake);
    return stake;
  }

  async function updateReferrals() {
    if (tokenContract) {
      const referralRewards = await stakingCA.methods
        .referralRewards(accounts[0])
        .call();
      const referralCount = await stakingCA.methods
        .referralCount(accounts[0])
        .call();
      setReferralRewards(referralRewards);
      setReferralCount(referralCount);
    }
  }

  async function updateAccountBalance() {
    if (tokenContract) {
      const balance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setBalance(balance);
      return balance;
    }
  }

  async function updateTotalSupply() {
    if (tokenContract) {
      const totalSupply = await tokenContract.methods.totalSupply().call();
      setTotalSupply(totalSupply);
      return totalSupply;
    }
  }

  async function updateTotalStaked() {
    if (stakingCA) {
      const totalStaked = await stakingCA.methods.totalStaked().call();

      return totalStaked;
    }
  }

  async function minRegisteration() {
    if (stakingCA) {
      const tax = Number(await stakingCA.methods.registrationTax().call());
      const value = Number(await stakingCA.methods.minimumStakeValue().call());
      const sum = Number(tax) + Number(value);
      await setMinRegister(sum);
      return sum;
    }
  }

  async function stakeRewards() {
    if (stakingCA) {
      const rewards = Number(
        await stakingCA.methods.stakeRewards(accounts[0]).call()
      );
      const owing = Number(
        await stakingCA.methods.calculateEarnings(accounts[0]).call()
      );
      const sum = rewards + owing;
      await setStakeRewards(sum);
      return sum;
    }
  }

  async function totalReward() {
    const owing = Number(
      await stakingCA.methods.calculateEarnings(accounts[0]).call()
    );
    const recorded = Number(
      await stakingCA.methods.stakeRewards(accounts[0]).call()
    );
    const referral = Number(
      await stakingCA.methods.referralRewards(accounts[0]).call()
    );
    const sum = owing + referral + recorded;
    await setTotalRewards(sum);
    return sum;
  }

  async function updateStatus() {
    if (tokenContract) {
      const status = await stakingCA.methods.registered(accounts[0]).call();
      setRegisteredStaus(status);
    }
  }

  async function registerAndStake() {
    if (Number(balance) === 0 || !amount || Number(amount) === 0) {
      setErrorMessage(
        Number(balance) === 0
          ? "You don't have any $LORD's yet!"
          : "Please provide the amount needed to stake!"
      );
      setShowModal(true);
      return;
    }

    setStakeLoading(true);

    const arg = fromExponential(
      ethers.parseUnits(BigInt(amount).toString(), CONFIG.tokenDecimals)
    );

    try {
      let ref = referrer;
      await tokenContract.methods
        .approve(CONFIG.stakingContract, arg)
        .send({ from: accounts[0] });

      if (!web3.utils.isAddress(ref)) {
        ref = "0x0000000000000000000000000000000000000000";
      }

      await stakingCA.methods
        .registerAndStake(arg, ref)
        .send({ from: accounts[0] });

      await updateAll();
    } catch (err) {
      if (err.code !== 4001) {
        setErrorMessage(err.message);
        setShowModal(true);
      }
    }

    setStakeLoading(false);
  }

  async function stake() {
    if (Number(balance) === 0 || !amount || Number(amount) === 0) {
      setErrorMessage(
        Number(balance) === 0
          ? "You don't have any $LORD yet!"
          : "Please provide the amount needed to stake!"
      );
      setShowModal(true);
      return;
    }

    setStakeLoading(true);

    const arg = fromExponential(
      ethers.parseUnits(Number(amount).toString(), CONFIG.tokenDecimals)
    );

    try {
      await tokenContract.methods
        .approve(CONFIG.stakingContract, arg)
        .send({ from: accounts[0] });

      await stakingCA.methods.stake(arg).send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      if (err.code !== 4001) {
        setErrorMessage(err.message);
        setShowModal(true);
      }
    }

    setStakeLoading(false);
  }

  async function unstake() {
    if (Number(stakes) === 0 || !unstakeAmount || Number(unstakeAmount) === 0) {
      setErrorMessage(
        Number(stakes) === 0
          ? "You don't have any staked $LORD yet!"
          : "Please provide the amount needed to unstake!"
      );
      setShowModal(true);
      return;
    }

    setUnstakeLoading(true);

    const arg = fromExponential(
      ethers.parseUnits(Number(unstakeAmount).toString(), CONFIG.tokenDecimals)
    );

    try {
      await stakingCA.methods.unstake(arg).send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      if (err.code !== 4001) {
        setErrorMessage(err.message);
        setShowModal(true);
      }
    }

    setUnstakeLoading(false);
  }

  async function withdrawEarnings() {
    if (Number(totalRewards) === 0) {
      setErrorMessage("No earnings yet!");
      setShowModal(true);
      return;
    }

    setWithdrawLoading(true);

    try {
      await stakingCA.methods.withdrawEarnings().send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      if (err.code !== 4001) {
        setErrorMessage(err.message);
        setShowModal(true);
      }
    }

    setWithdrawLoading(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  useEffect(() => {
    setReferrer(wallet);
  }, [wallet]);

  return (
    <div className="w-full overflow-hidden">
      {showModal && (
        <Modal
          title=""
          onClose={() => setShowModal(false)}
          className="bg-gray-800 text-white rounded-lg shadow-lg"
        >
          <div className="p-5">
            <div className="text-3xl mb-4 font-bold text-red-500 animate-pulse">
              ⚠️ Error! Please retry...
            </div>
            <div className="text-lg mb-4 border-l-4 border-red-500 pl-4">
              {errorMessage}
            </div>

            <div className="flex flex-row justify-center mt-5">
              <Button
                onClick={() => setShowModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="relative z-20 w-full top-0">
        {/* <img
          src="/images/nosiy.png"
          alt=""
          className="absolute z-10 top-noisy"
        />
    */}
      </div>

      <div className="relative z-10 w-full top-0">
        <div className="absolute w-full home-gradient"></div>
      </div>

      <div className="relative w-full z-30">
        <Header />

        <div className="container mx-auto pb-18 px-4 force-height">
          {!address && (
            <div className="w-full py-6 text-center">
              <div className="text-white text-center mt-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
                <h1>Welcome to MemelordApp</h1>
              </div>
              <div className="w-full md:w-3/6 justify-center mx-auto mt-6">
                <Card title="Rules">
                  <div className="flex flex-col pt-8 pb-4 text-white text-center">
                    <ul>
                      <li>1. Connect your Web3 Wallet</li>
                      <li>2. Stake $LORD tokens and earn daily returns</li>
                      <li>3. Withdraw earned rewards anytime</li>
                      <li>4. Unstake $LORD tokens anytime</li>
                      <li>5. Earn EXTRA rewards by referring NEW investors</li>
                    </ul>
                  </div>
                </Card>
                <div className="flex flex-col pt-8 px-2">
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
                <Card noLine>
                  <div className="flex flex-col px-2">
                    <div className="text-center ">
                      <div className="text-white text-xs">
                        <span className="text-blue-500">Disclaimer:</span>{" "}
                        Staking Smart Contract is in process of being audited.
                        Keep in mind that security audits don't fully eliminate
                        all possible security risks.
                        <br />
                        <span className="text-blue-500">Note:</span> The Stake
                        Rewards can be reduced without prior warning, stakers
                        are advised to claim their rewards daily.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          {address && (
            <div className="grid grid-col-1 md:grid-cols-2 mb-10 gap-6 mt-10">
              <Card title="Total LORD Tokens Staked">
                <div className="flex flex-col pt-8 pb-4 text-white">
                  <div className="text-center">
                    <span className="text-white text-5xl">
                      <AnimatedNumber
                        value={
                          totalStaked
                            ? getFullDisplayBalance(
                                totalStaked,
                                CONFIG.tokenDecimals
                              )
                            : "0.00"
                        }
                        duration="2000"
                        formatValue={(value) => `${formattedShort(value)}`}
                      ></AnimatedNumber>
                    </span>
                    <span className="text-white text-3xl ml-2">LORD</span>
                  </div>
                  {/* <div className="text-center text-3xl 	">
                    Total Value: <AnimatedNumber
                      value={(totalStaked) ? (Number(totalStaked) * 100.0) /
                        Number(totalSupply) : '0.00%'}
                      duration="2000"
                      formatValue={value => `${formattedShort(value)}`}
                    >
                    </AnimatedNumber>$

                  </div> */}
                  <div className="text-center text-lg	">
                    {
                      <AnimatedNumber
                        value={
                          totalStaked
                            ? Number(
                                (Number(totalStaked) * 100.0) /
                                  Number(totalSupply)
                              ).toFixed(11)
                            : "0.00%"
                        }
                        duration="2000"
                        formatValue={(value) => `${formattedShort(value)}`}
                      ></AnimatedNumber>
                    }
                    % of total supply
                  </div>
                </div>
              </Card>

              <Card title="Fees">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-8">
                    <div className="text-gray-400 text-lg font-thin">
                      <ul>
                        <li>
                          Registration Fee:{"  "}
                          <span className="text-white text-2xl">
                            <AnimatedNumber
                              value={
                                registrationTax
                                  ? ethers.formatUnits(
                                      BigInt(registrationTax),
                                      CONFIG.tokenDecimals
                                    )
                                  : "0.00"
                              }
                              duration="2000"
                              formatValue={(value) =>
                                `${formattedNumberTwo(value)}`
                              }
                            ></AnimatedNumber>{" "}
                            LORD
                          </span>
                        </li>
                        <li>
                          Staking Fee:{"  "}
                          <span className="text-white text-2xl">
                            <AnimatedNumber
                              value={
                                stakingTax ? Number(stakingTax) / 10 : "0.00%"
                              }
                              duration="2000"
                              formatValue={(value) =>
                                `${formattedShort(value)}`
                              }
                            ></AnimatedNumber>
                            %
                          </span>
                        </li>
                        <li>
                          Unstaking Fee:{"  "}
                          <span className="text-white text-2xl">
                            <AnimatedNumber
                              value={
                                unstakingTax
                                  ? Number(unstakingTax) / 10
                                  : "0.00%"
                              }
                              duration="2000"
                              formatValue={(value) =>
                                `${formattedShort(value)}`
                              }
                            ></AnimatedNumber>
                            %
                          </span>
                        </li>
                        <li>
                          Minimum Stake:{"  "}
                          <span className="text-white text-2xl">
                            <AnimatedNumber
                              value={
                                minStake
                                  ? ethers.formatUnits(
                                      BigInt(minStake),
                                      CONFIG.tokenDecimals
                                    )
                                  : "0.00"
                              }
                              duration="2000"
                              formatValue={(value) =>
                                `${formattedNumberTwo(value)}`
                              }
                            ></AnimatedNumber>{" "}
                            LORD
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {!registeredStatus ? (
                <Card title="Staking">
                  <div className="flex flex-col pt-8 px-2">
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Minimum amount needed:{" "}
                      </span>
                      <span className="text-white text-3xl">
                        <AnimatedNumber
                          value={
                            minRegister
                              ? ethers.formatUnits(
                                  BigInt(minRegister),
                                  CONFIG.tokenDecimals
                                )
                              : "0.00"
                          }
                          duration="2000"
                          formatValue={(value) =>
                            `${formattedNumberTwo(value)}`
                          }
                        ></AnimatedNumber>
                      </span>
                      <span className="text-white text-2xl ml-2">LORD</span>
                    </div>
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Available amount:{" "}
                      </span>
                      <span className="text-white text-3xl">
                        <AnimatedNumber
                          value={
                            balance
                              ? ethers.formatUnits(
                                  balance,
                                  CONFIG.tokenDecimals
                                )
                              : "0.00"
                          }
                          duration="2000"
                          formatValue={(value) =>
                            `${formattedNumberTwo(value)}`
                          }
                        ></AnimatedNumber>
                      </span>
                      <span className="text-white text-2xl ml-2">LORD</span>
                    </div>
                    <div className="rounded-md border-2 border-primary p-2 ml-10 mr-10 flex justify-between items-center">
                      <input
                        type="number"
                        placeholder="LORD To Stake"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-white font-extrabold flex-shrink text-xs sm:text-2xl w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                      />
                      <span
                        className="text-white cursor-pointer rounded-md border-2 text-xs sm:text-base border-primary p-1 mr-2 ml-1 flex justify-between items-center active:bg-black "
                        onClick={() =>
                          setAmount(
                            getFullDisplayBalance(balance, CONFIG.tokenDecimals)
                          )
                        }
                      >
                        Max
                      </span>

                      <Button
                        onClick={() => registerAndStake()}
                        className="flex flex-row items-center w-48 text-xs sm:text-lg justify-center"
                      >
                        {stakeLoading ? (
                          <Spinner size={30} color="#fff" />
                        ) : (
                          <>
                            <img src="/images/locked.svg" width="25" alt="" />
                            <span className="w-16">STAKE</span>{" "}
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-white text-center mt-4 mb-2">
                      Referring a wallet?
                    </div>
                    <div className="rounded-md border-2 border-primary p-2  ml-10 mr-10 flex justify-between items-center">
                      <input
                        placeholder="Referrer Address"
                        value={referrer}
                        onChange={(e) => setReferrer(e.target.value)}
                        className="text-white font-extrabold flex-shrink text-xs sm:text-2xl w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                      />
                    </div>
                    <div className="text-center p-5">
                      <span className="text-lg text-gray-400">
                        If you have a wallet to referr, please type it here.
                        It's important that the mentioned wallet to have some
                        LORD Tokens already staked otherwise, it will not
                        work.
                      </span>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card title="Staking">
                  <div className="flex flex-col pt-8 px-2">
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Minimum amount needed:{" "}
                      </span>
                      <span className="text-white text-3xl">
                        <AnimatedNumber
                          value={
                            minRegister
                              ? ethers.formatUnits(
                                  BigInt(minRegister),
                                  CONFIG.tokenDecimals
                                )
                              : "0.00"
                          }
                          duration="2000"
                          formatValue={(value) => `${formattedNumber(value)}`}
                        ></AnimatedNumber>
                      </span>
                      <span className="text-white text-2xl ml-2">LORD</span>
                    </div>
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Available amount:{" "}
                      </span>
                      <span className="text-white text-3xl">
                        <AnimatedNumber
                          value={
                            balance
                              ? ethers.formatUnits(
                                  balance,
                                  CONFIG.tokenDecimals
                                )
                              : "0.00"
                          }
                          duration="2000"
                          formatValue={(value) =>
                            `${formattedNumberTwo(value)}`
                          }
                        ></AnimatedNumber>
                      </span>
                      <span className="text-white text-2xl ml-2">LORD</span>
                    </div>
                    <div className="rounded-md border-2 border-primary p-2 ml-10 mr-10 flex justify-between items-center">
                      <input
                        type="number"
                        placeholder="LORD To Stake"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-white font-extrabold flex-shrink text-xs sm:text-2xl w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                      />
                      <span
                        className="text-white cursor-pointer text-xs sm:text-base rounded-md border-2 border-primary p-1 mr-2 flex justify-between items-center active:bg-black  "
                        onClick={() =>
                          setAmount(
                            ethers.formatUnits(balance, CONFIG.tokenDecimals)
                          )
                        }
                      >
                        Max
                      </span>

                      <Button
                        onClick={() => stake()}
                        className="flex flex-row items-center w-48 text-xs sm:text-lg justify-center  "
                      >
                        {stakeLoading ? (
                          <Spinner size={30} />
                        ) : (
                          <>
                            <img src="/images/locked.svg" width="25" alt="" />
                            <span className="w-16">STAKE</span>{" "}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <Card title="Your Earnings">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-4">
                    <span className="text-white text-5xl">
                      <AnimatedNumber
                        value={
                          totalRewards
                            ? ethers.formatUnits(
                                BigInt(totalRewards),
                                CONFIG.tokenDecimals
                              )
                            : "0.00"
                        }
                        duration="2000"
                        formatValue={(value) => `${formattedNumberTwo(value)}`}
                      ></AnimatedNumber>
                    </span>
                    <span className="text-white text-2xl ml-2">LORD</span>
                  </div>
                  <div className="flex flex-row justify-center">
                    <Button
                      type="submit"
                      className="flex flex-row items-center justify-center w-32"
                      onClick={() => withdrawEarnings()}
                    >
                      {withdrawLoading ? (
                        <Spinner size={30} />
                      ) : (
                        <>
                          <img src="/images/unlocked.svg" width="25" alt="" />
                          <span className="w-24">CLAIM</span>{" "}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-white text-2xl mt-4 mx-2">
                    <div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Staking Reward:{" "}
                        </span>
                        <AnimatedNumber
                          value={
                            stakingRewards
                              ? ethers.formatUnits(
                                  BigInt(stakingRewards),
                                  CONFIG.tokenDecimals
                                )
                              : "0.00"
                          }
                          duration="2000"
                          formatValue={(value) =>
                            `${formattedNumberTwo(value)}`
                          }
                        ></AnimatedNumber>{" "}
                        LORD
                      </div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Daily Return:{" "}
                        </span>
                        <AnimatedNumber
                          value={dailyROI ? Number(dailyROI) / 100 : "0.00%"}
                          duration="2000"
                          formatValue={(value) =>
                            `${formattedNumberTwo(value)}`
                          }
                        ></AnimatedNumber>
                        %
                      </div>
                    </div>
                    <div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Referral Reward:
                        </span>{" "}
                        <AnimatedNumber
                          value={
                            referralRewards
                              ? ethers.formatUnits(
                                  BigInt(referralRewards),
                                  CONFIG.tokenDecimals
                                )
                              : "0.00"
                          }
                          duration="2000"
                          formatValue={(value) =>
                            `${formattedNumberTwo(value)}`
                          }
                        ></AnimatedNumber>{" "}
                        LORD
                      </div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Referral Count:
                        </span>{" "}
                        {Number(referralCount)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Unstaking">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-4">
                    <span className="text-lg text-gray-400">
                      Available to unstake:{" "}
                    </span>
                    <span className="text-white text-3xl">
                      <AnimatedNumber
                        value={
                          stakes
                            ? ethers.formatUnits(
                                BigInt(stakes),
                                CONFIG.tokenDecimals
                              )
                            : "0.00"
                        }
                        duration="2000"
                        formatValue={(value) => `${formattedNumberTwo(value)}`}
                      ></AnimatedNumber>
                    </span>
                    <span className="text-white text-2xl ml-2">LORD</span>
                  </div>
                  <div className="rounded-md border-2 border-primary p-2 ml-10 mr-10 flex justify-between items-center">
                    <input
                      type="number"
                      placeholder="LORD To Unstake"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="text-white font-extrabold flex-shrink text-xs sm:text-2xl w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                    />
                    <span
                      className="text-white cursor-pointer rounded-md  text-xs sm:text-base border-2 border-primary p-1 mr-2 ml-1 flex justify-between items-center active:bg-black "
                      onClick={() =>
                        setUnstakeAmount(
                          ethers.formatUnits(
                            BigInt(stakes),
                            CONFIG.tokenDecimals
                          )
                        )
                      }
                    >
                      Max
                    </span>

                    <Button
                      onClick={() => unstake()}
                      className="flex flex-row items-center text-xs sm:text-lg w-48 justify-center"
                    >
                      {unstakeLoading ? (
                        <Spinner size={30} />
                      ) : (
                        <>
                          <img src="/images/unlocked.svg" width="25" alt="" />
                          <span className="w-24">UNSTAKE</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card title="Referral Link">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pr-5 pl-5 pb-3">
                    <span className="text-lg text-gray-400">
                      You will be eligible to earn EXTRA rewards by referring
                      other investors.
                      <br />
                      You will earn{" "}
                      <span className="font-bold text-white text-md">
                        {stakingTax / 10}%
                      </span>{" "}
                      out of the amount that the new investor stakes (after
                      excluding the Registration Tax)
                    </span>
                  </div>
                  <div className="rounded-md border-2 border-primary p-2 ml-3 mr-3 flex justify-between items-center">
                    <input
                      type="text"
                      readOnly
                      value={"https://memelordapp.com/referral/".concat(address)}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="text-white font-extrabold flex-shrink text-xs w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                    />
                    <CopyToClipboard
                      onCopy={() => setCopied(true)}
                      text={"https://memelordapp.com/referral/".concat(address)}
                    >
                      <Button className="flex flex-row items-center w-48 justify-center">
                        {copied ? (
                          <>✅ COPIED</>
                        ) : (
                          <>
                            <img
                              src="/images/copy-white.svg"
                              width="20"
                              alt=""
                            />
                            <span className="w-16">COPY</span>
                          </>
                        )}
                      </Button>
                    </CopyToClipboard>
                  </div>
                  <div className="text-center p-5">
                    <span className="text-lg text-gray-400">
                      The new investor has to enter your Wallet Address that
                      you've staked LORD with when he stakes.
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default StakingPage;
