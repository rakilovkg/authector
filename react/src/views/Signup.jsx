import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const [errors, setErrors] = useState(null);

    const { setUser, setToken } = useStateContext();

    const onSubmit = (event) => {
        event.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value
        };

        axiosClient.post("/signup", payload)
            .then(({ data }) => {                
                setUser(data.user);
                setToken(data.token);
            })
            .catch((error) => {
                const { response } = error;
                if (response && response.status == 422) {
                    setErrors(response.data.errors);
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
                    <h1 className="title">Create an account</h1>
                    {errorsAlert}
                    <input ref={nameRef} type="text" placeholder="John Doe" />
                    <input ref={emailRef} type="email" placeholder="jdoe@mail.com" />
                    <input ref={passwordRef}type="password" placeholder="Password" />
                    <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
                    <button className="btn btn-fold">Signup</button>
                    <p className="txt">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>        
    );
}

export default Signup;