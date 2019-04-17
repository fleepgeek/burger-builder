import { useState, useEffect } from "react";

/*
  This can be used anywhere we make a http request to get the error.
  Must not be only used by withErrorHandler hoc.
*/
const useHttpErrorHandler = axios => {
	const [error, setError] = useState(null);

	// reqInterceptor and resInterceptor are ran before we return any JSX
	// this simulates componentWillMount
	const reqInterceptor = axios.interceptors.request.use(request => {
		setError(null);
		return request;
	});

	const resInterceptor = axios.interceptors.response.use(
		res => res,
		err => {
			setError(err);
		}
	);

	useEffect(() => {
		return () => {
			// run after the comp is unmounted
			axios.interceptors.request.eject(reqInterceptor);
			axios.interceptors.response.eject(resInterceptor);
		};
	}, [reqInterceptor, resInterceptor]); // only clean when any of these two changes (optional). could leave the array empty

	const errorConfirmedHandler = () => {
		setError(null);
	};

	return [error, errorConfirmedHandler];
};

export default useHttpErrorHandler;
