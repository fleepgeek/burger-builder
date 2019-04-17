import React, { Fragment } from "react";

import classes from "./Modal.css";
import Backdrop from "../Backdrop/Backdrop";

const Modal = props => {
	return (
		<Fragment>
			<Backdrop show={props.show} clicked={props.modalClosed} />
			<div
				className={classes.Modal}
				style={{
					transform: props.show ? "translateY(0)" : "translateY(-100vh)",
					opacity: props.show ? "1" : "0"
				}}
			>
				{props.children}
			</div>
		</Fragment>
	);
};

// Memoize the component if the condition returns true
export default React.memo(
	Modal,
	(prevProps, nextProps) =>
		prevProps.show === nextProps.show &&
		prevProps.children === nextProps.children
);
