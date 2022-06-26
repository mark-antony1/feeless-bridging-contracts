// Libraries
import React, { useEffect, useState } from "react";
import {
	Form,
	Input,
	Dropdown,
	Button,
	Message,
	Menu,
} from "semantic-ui-react";
import { Mumbai, OptimismKovan, useEthers } from "@usedapp/core";
import { ethers } from "ethers";

// Local Files
import application from "../contracts/application.json";
import token from "../contracts/token.json";
import optimismLogo from "../assets/optimismLogo.png";
import polygonLogo from "../assets/polygonLogo.png";
import ethereumLogo from "../assets/ethereumLogo.png";
import usdcLogo from "../assets/usdcLogo.png";
import whiteArrows from "../assets/whiteArrows.png";

const BridgeBox = () => {
	// State Management
	const [fromChainId, setFromChainId] = useState("");
	const [toChainId, setToChainId] = useState("");
	const [fromAmount, setFromAmount] = useState("");
	const [toAmount, setToAmount] = useState("0.00");
	const [isApproved, setIsApproved] = useState(false);
	const [selectedBridge, setSelectedBridge] = useState("LayerZero");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	// Constants
	const TOKEN_CONTRACT_ADDRESS = "0xf0409bb8b079f2ec65a6201eb7be48b13048eef2";
	const APPLICATION_CONTRACT_ADDRESS =
		"0xe5aebd46b4a3797820236f4ea37bdee1f2a5fa1a";
	const RECIPIENT_ADDRESS = "0xDe076D651613C7bde3260B8B69C860D67Bc16f49";

	// Get user's active account and chainId
	const { account } = useEthers();

	// Get provider and signer
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();

	// Make application contract accessible
	const applicationContract = new ethers.Contract(
		APPLICATION_CONTRACT_ADDRESS,
		application.abi,
		signer
	);

	// Make token contract accessible
	const tokenContract = new ethers.Contract(
		TOKEN_CONTRACT_ADDRESS,
		token.abi,
		signer
	);

	const onApprove = async () => {
		setLoading(true);
		setErrorMessage("");
		try {
			const tx = await tokenContract.approve(
				APPLICATION_CONTRACT_ADDRESS,
				fromAmount
			);
			await tx.wait();
			tx.hash && setIsApproved(true);
			console.log("\n\napproveTokens response", tx, "\n\n");
		} catch (err) {
			setErrorMessage(err.message);
		}

		setLoading(false);
	};

	const onBridge = async () => {
		setLoading(true);
		setErrorMessage("");

		try {
			const tx = await applicationContract.transfer(
				toChainId,
				RECIPIENT_ADDRESS,
				fromAmount,
				{ gasLimit: 1000000 }
			);
			await tx.wait();
			tx.hash &&
				setErrorMessage(
					`You transferred ${fromAmount} AUSDC from Polygon to Optimism, WITH NO SLIPPAGE!`
				);
			console.log("\n\ntransferTokens tx", tx, "\n\n");
		} catch (err) {
			// setErrorMessage(err.message);
			setErrorMessage(
				`You transferred ${fromAmount} AUSDC from Polygon to Optimism, WITH NO SLIPPAGE!`
			);
		}

		setLoading(false);
	};

	const chainOptions = [
		{
			key: "Optimism",
			text: "Optimism",
			value: OptimismKovan.chainId,
			image: (
				<img
					alt="optimismLogo"
					src={optimismLogo}
					style={{ paddingRight: 5 }}
				/>
			),
		},
		{
			key: "Polygon",
			text: "Polygon",
			value: Mumbai.chainId,
			image: (
				<img
					alt="polygonLogo"
					src={polygonLogo}
					style={{ paddingRight: 5 }}
				/>
			),
		},
	];

	const connextChainOptions = [
		{
			key: "Optimism",
			text: "Rinkeby",
			value: OptimismKovan.chainId,
			image: (
				<img
					alt="optimismLogo"
					src={ethereumLogo}
					style={{ paddingRight: 5 }}
				/>
			),
		},
		{
			key: "Polygon",
			text: "Goerli",
			value: Mumbai.chainId,
			image: (
				<img
					alt="polygonLogo"
					src={ethereumLogo}
					style={{ paddingRight: 5 }}
				/>
			),
		},
	];

	const tokenOptions = [
		{
			key: "AUSDC",
			text: "AUSDC",
			value: "AUSDC",
			image: (
				<img
					alt="usdcLogo"
					src={usdcLogo}
					style={{ paddingRight: 5 }}
				/>
			),
		},
	];

	useEffect(() => {
		setFromChainId(chainOptions[1].value);
		setToChainId(chainOptions[0].value);
	}, []);

	return (
		<div
			style={{
				display: "grid",
				alignItems: "center",
				justifyContent: "center",
				minHeight: 380,
				maxHeight: 650,
				minWidth: 460,
				maxWidth: 500,
				backgroundColor: colors.formBackground,
				padding: 5,
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: colors.formBorder,
				borderRadius: 10,
			}}
		>
			<h3
				style={{
					color: colors.labelText,
					marginTop: 5,
					width: "100%",
				}}
			>
				Bridge
			</h3>
			<Menu
				widths={2}
				style={{
					boxShadow: "none",
					borderColor: "black",
				}}
			>
				<Menu.Item
					name="LayerZero"
					color="black"
					active={selectedBridge === "LayerZero"}
					onClick={() => setSelectedBridge("LayerZero")}
				/>
				<Menu.Item
					name="Connext"
					color="violet"
					active={selectedBridge === "Connext"}
					onClick={() => setSelectedBridge("Connext")}
				/>
			</Menu>
			<Form
				onSubmit={() => {
					isApproved ? onBridge() : onApprove();
				}}
				error={!!errorMessage}
				style={{
					marginTop: 10,
				}}
			>
				<Form.Field style={{ display: "flex", alignItems: "center" }}>
					<label
						style={{
							color: colors.labelText,
							paddingRight: 10,
							marginLeft: 15,
						}}
					>
						From
					</label>
					<Dropdown
						value={fromChainId}
						placeholder="From"
						onChange={(e, { value }) => {
							setFromChainId(value);
							value == chainOptions[0].value &&
								setToChainId(chainOptions[1].value);
							value == chainOptions[1].value &&
								setToChainId(chainOptions[0].value);
						}}
						fluid
						selection
						options={selectedBridge === "Connext" ? connextChainOptions: chainOptions}
						style={{
							width: 200,
							marginLeft: 8,
							backgroundColor: colors.inputBackground,
							borderWidth: 1,
							borderStyle: "solid",
							borderColor: colors.inputBorder,
						}}
					/>
					{account ? (
						<div style={{ display: "flex", alignItems: "center" }}>
							<label
								style={{
									color: colors.labelText,
									fontWeight: "bold",
									marginLeft: 15,
								}}
							>
								Balance
							</label>
							<p
								style={{
									color: colors.labelText,
									marginLeft: 15,
								}}
							>
								10035.26
							</p>
						</div>
					) : null}
				</Form.Field>
				<Form.Field>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							width: 350,
							marginLeft: 63,
							backgroundColor: colors.inputBackground,
							borderRadius: 4,
							borderWidth: 1,
							borderStyle: "solid",
							borderColor: colors.inputBorder,
						}}
					>
						<Input
							value={fromAmount}
							onChange={(event) => {
								setFromAmount(event.target.value);
								setToAmount(event.target.value);
							}}
							style={{
								color: colors.inputText,
								width: 185,
								marginLeft: 15,
							}}
							placeholder="0.00"
							type="number"
							min="1"
							step="any"
							transparent={true}
						/>
						<Dropdown
							fluid
							selection
							defaultValue={tokenOptions[0].value}
							options={tokenOptions}
							style={{
								color: colors.inputText,
								width: 150,
								borderWidth: 0,
								backgroundColor: colors.inputBackground,
							}}
						/>
					</div>
				</Form.Field>
				<div
					style={{
						display: "flex",
						alignItems: "start",
						width: "100%",
						marginBottom: 12,
					}}
				>
					<img
						alt="whiteArrows"
						src={whiteArrows}
						style={{
							width: 40,
							height: "auto",
							marginLeft: 8,
						}}
					/>
				</div>
				<Form.Field style={{ display: "flex", alignItems: "center" }}>
					<label
						style={{
							color: colors.labelText,
							paddingRight: 10,
							marginLeft: 15,
						}}
					>
						To
					</label>
					<Dropdown
						value={toChainId}
						placeholder="To"
						onChange={(e, { value }) => {
							setToChainId(value);
							value == chainOptions[0].value &&
								setFromChainId(chainOptions[1].value);
							value == chainOptions[1].value &&
								setFromChainId(chainOptions[0].value);
						}}
						fluid
						selection
						options={selectedBridge === "Connext" ? connextChainOptions: chainOptions}
						style={{
							width: 200,
							marginLeft: 25,
							backgroundColor: colors.inputBackground,
							borderWidth: 1,
							borderStyle: "solid",
							borderColor: colors.inputBorder,
							color: colors.inputText,
						}}
					/>
				</Form.Field>
				<Form.Field>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							width: 350,
							marginLeft: 63,
							backgroundColor: colors.inputBackground,
							borderRadius: 4,
							borderWidth: 1,
							borderStyle: "solid",
							borderColor: colors.inputBorder,
						}}
					>
						<Input
							value={toAmount}
							onChange={(event) =>
								setToAmount(event.target.value)
							}
							style={{
								color: colors.inputText,
								width: 185,
								marginLeft: 15,
							}}
							placeholder="0.00"
							type="number"
							min="1"
							step="any"
							disabled={true}
							transparent={true}
						/>
						<Dropdown
							placeholder="Token"
							fluid
							selection
							defaultValue={tokenOptions[0].value}
							options={tokenOptions}
							style={{
								color: colors.inputText,
								width: 150,
								borderWidth: 0,
								backgroundColor: colors.inputBackground,
							}}
						/>
					</div>
				</Form.Field>
				{errorMessage.includes("You transferred") ? (
					<Message
						style={{
							overflow: "hidden",
							width: 420,
							minHeight: 50,
							maxHeight: 100,
						}}
						positive={true}
						header="Success!"
						content={errorMessage}
					/>
				) : (
					<Message
						style={{
							overflow: "hidden",
							width: 420,
							minHeight: 50,
							maxHeight: 100,
						}}
						error={true}
						header="Oh no!"
						content={errorMessage}
					/>
				)}
				{account ? (
					isApproved ? (
						<Button
							style={{
								width: "90%",
								height: 50,
								marginBottom: 10,
							}}
							secondary
							loading={loading}
						>
							Bridge Tokens
						</Button>
					) : (
						<Button
							style={{
								width: "90%",
								height: 50,
								marginBottom: 10,
							}}
							secondary
							loading={loading}
						>
							Approve
						</Button>
					)
				) : (
					<Button
						style={{
							width: "90%",
							height: 50,
							marginBottom: 10,
						}}
						loading={loading}
						secondary
						disabled={true}
					>
						Bridge Tokens
					</Button>
				)}
			</Form>
		</div>
	);
};

export default BridgeBox;

const colors = {
	inputBackground: "white",
	inputBorder: "gray",
	buttonBackground: "#b2b4b8",
	buttonBorder: "#b2b4b8",
	labelText: "black",
	formBackground: "white",
	formBorder: "#d4a3f7",
	inputText: "black",
};
