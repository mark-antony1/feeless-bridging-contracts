import "./App.css";
import bg from "./assets/backgroundImage.png";
import { DAppProvider, Mumbai, OptimismKovan } from "@usedapp/core";
import "semantic-ui-css/semantic.min.css";
import Header from "./components/Header";
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
			<div style={{ backgroundImage: `url(${bg})` }} className="App">
				<header className="App-header">
					<Header />
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<BridgeBox />
					</div>
					<Footer />
				</header>
			</div>
		</DAppProvider>
	);
};

export default App;
