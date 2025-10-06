import Link from "next/link";

export default function Signin() {
    return (
        <div id="wd-signin-screen" style={{ maxWidth: 400 }}>
            <h3 className="mb-4">Signin</h3>
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
                    <Link href="/Dashboard" id="wd-signin-btn" className="btn btn-primary w-100">
                        Signin
                    </Link>
                </div>
                <div className="form-group">
                    <Link href="Signup" id="wd-signup-link" className="text-primary">
                        Signup
                    </Link>
                </div>
            </form>
        </div>

    );
}
