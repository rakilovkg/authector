import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const [errors, setErrors] = useState(null);

    const { setUser, setToken } = useStateContext();

    const onSubmit = (event) => {
        event.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        };
        setErrors(null);
        axiosClient.post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((error) => {
                const { response } = error;
                if (response && response.status == 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message]
                        });
                    }
                }
            });
    };

    let errorsAlert = <></>;
    if (errors) {
        const errorsList = Object.keys(errors).map(key => (<p key={key}>{errors[key][0]}</p>));
        errorsAlert = <div className="error">{errorsList}</div>;
    }

    return (
            <div className="login-signup-form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Login into your account</h1>
                    {errorsAlert}
                    <input ref={emailRef} type="email" placeholder="jdoe@mail.com" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    <button className="btn btn-fold">Login</button>
                    <p className="txt">
                        Not Registered? <Link to="/signup">Create an account</Link>
                    </p>
                </form>
            </div>
    );
}

export default Login;