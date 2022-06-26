import React from "react";
import footerBanner from "../assets/footerBanner.png";

const Footer = () => {
	return (
		<div style={{ display: "flex" }}>
			<img
				alt="footerBanner"
				src={footerBanner}
				style={{ height: 45, width: "100%" }}
			/>
		</div>
	);
};

export default Footer;
