import "./App.css";
import background from "./assets/backgroundImage.png";
import { DAppProvider, Mumbai, OptimismKovan } from "@usedapp/core";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import BridgeBox from "./components/BridgeBox";

const App = () => {
	// Configuration object for DAppProvider
	const config = {
		readOnlyChainId: Mumbai.chainId,
		readOnlyUrls: {
			[Mumbai.chainId]:
				"https://polygon-mumbai.infura.io/v3/206521d92d4b4b2fa8d3332813afe164",
			[OptimismKovan.chainId]:
				"https://optimism-goerli.infura.io/v3/206521d92d4b4b2fa8d3332813afe164",
		},
	};

	return (
		<DAppProvider config={config}>
			<div
				style={{ backgroundImage: `url(${background})` }}
				className="App"
			>
				<header className="App-header">
					<Layout>
						<div
							style={{
								marginTop: 50,
								display: "grid",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<BridgeBox />
						</div>
					</Layout>
				</header>
				<Footer
					style={{
						marginTop: "1rem",
						padding: "1rem",
						position: "fixed",
						bottom: 0,
						left: 0,
						width: "100%",
					}}
				/>
			</div>
		</DAppProvider>
	);
};

export default App;
