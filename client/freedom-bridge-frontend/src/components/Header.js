import React, { useState, useEffect } from "react";
import { Menu, Button, Modal } from "semantic-ui-react";
import logo from "../assets/logo.png";
import metamaskIcon from "../assets/metamaskIcon.svg";
import walletConnectIcon from "../assets/walletConnectIcon.svg";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Mumbai, useEthers } from "@usedapp/core";

const Header = () => {
	// State Management
	const [openModal, setOpenModal] = useState(false);

	// Destructure properties out of useEthers
	const {
		activateBrowserWallet,
		activate,
		deactivate,
		account,
		chainId,
		switchNetwork,
	} = useEthers();

	const getWalletConnect = async () => {
		try {
			const provider = new WalletConnectProvider({
				infuraId: "206521d92d4b4b2fa8d3332813afe164",
			});
			await provider.enable();
			await activate(provider);
		} catch (error) {
			console.error(error);
		}
	};

	const getBrowserWallet = async () => {
		try {
			activateBrowserWallet();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (account && chainId != Mumbai.chainId) {
			switchNetwork(Mumbai.chainId);
		}
	}, []);

	return (
		<Menu
			style={{
				backgroundColor: "transparent",
				marginTop: 10,
				width: "100%",
				height: 15,
				boxShadow: "none",
				border: 0,
			}}
		>
			<img alt="logo" src={logo} style={{ paddingRight: 20 }} />
			<Menu.Menu position="right">
				{account ? (
					<div>
						{chainId != Mumbai.chainId && (
							<Button
								onClick={() => switchNetwork(Mumbai.chainId)}
								inverted
								color="black"
								style={{
									marginRight: 10,
									borderRadius: 10,
								}}
							>
								Switch to Polygon Mumbai Network
							</Button>
						)}
						<Button
							disabled
							inverted
							color="black"
							style={{
								marginRight: 10,
								borderRadius: 10,
							}}
						>
							{account.substring(0, 5)}...
							{account.substring(Math.max(0, account.length - 5))}
						</Button>
						<Button
							onClick={() => deactivate()}
							style={{
								width: 165,
								borderRadius: 10,
							}}
							color="red"
							inverted
						>
							Disconnect
						</Button>
					</div>
				) : (
					<Modal
						onClose={() => setOpenModal(false)}
						onOpen={() => setOpenModal(true)}
						open={openModal}
						dimmer="blurring"
						basic={true}
						style={{ width: 340, backgroundColor: "#282c34" }}
						trigger={
							<Button
								style={{
									width: 165,
									borderRadius: 10,
								}}
								inverted
								primary
							>
								Connect Wallet
							</Button>
						}
					>
						<Modal.Header>Connect Wallet</Modal.Header>
						<Modal.Content>
							<div style={{ marginBottom: 20 }}>
								<Button
									style={{
										width: 300,
										height: 70,
										display: "flex",
										alignItems: "center",
									}}
									color="orange"
									onClick={() => {
										getBrowserWallet();
										setOpenModal(false);
									}}
									icon={true}
									labelPosition="right"
									inverted
								>
									MetaMask
									<img
										style={{
											height: "100%",
											marginLeft: 119,
										}}
										alt="metamaskIcon"
										src={metamaskIcon}
									/>
								</Button>
							</div>
							<div style={{ flex: "50%", marginBottom: 20 }}>
								<Button
									style={{
										width: 300,
										height: 70,
										display: "flex",
										alignItems: "center",
									}}
									color="blue"
									onClick={() => {
										getWalletConnect();
										setOpenModal(false);
									}}
									icon={true}
									labelPosition="right"
									inverted
								>
									WalletConnect
									<img
										style={{
											height: "90%",
											marginLeft: 80,
										}}
										alt="walleConnectIcon"
										src={walletConnectIcon}
									/>
								</Button>
							</div>
						</Modal.Content>
					</Modal>
				)}
			</Menu.Menu>
		</Menu>
	);
};

export default Header;
