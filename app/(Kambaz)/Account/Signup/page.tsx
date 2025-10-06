import Link from "next/link";

export default function Signup() {
    return (
        <div id="wd-signup-screen" style={{ maxWidth: 400 }}>
            <h3 className="mb-4">Signup</h3>
            <form>
                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="wd-username"
                        placeholder="username"
                        defaultValue="john"
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="wd-password"
                        placeholder="password"
                        defaultValue="123"
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="wd-verify-password"
                        placeholder="verify password"
                        defaultValue="123"
                    />
                </div>
                <div className="form-group mb-3">
                    <Link href="Profile" id="wd-signup-btn" className="btn btn-primary w-100">
                        Signup
                    </Link>
                </div>
                <div className="form-group">
                    <Link href="Signin" id="wd-signin-link" className="text-primary">
                        Signin
                    </Link>
                </div>
            </form>
        </div>
    );
}

