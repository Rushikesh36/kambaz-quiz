import Link from "next/link";

export default function Profile() {
    return (
        <div id="wd-profile-screen" style={{ maxWidth: 400 }}>
            <h3 className="mb-4">Profile</h3>
            <form>
                <div className="form-group mb-3">
                    <input defaultValue="john" placeholder="username" id="wd-username" className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <input defaultValue="123" placeholder="password" type="password" id="wd-password" className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <input defaultValue="John" placeholder="First Name" id="wd-firstname" className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <input defaultValue="Doe" placeholder="Last Name" id="wd-lastname" className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <input defaultValue="1999-10-19" type="date" id="wd-dob" className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <input defaultValue="johndoe@gmail.com" type="email" id="wd-email" className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <select defaultValue="FACULTY" id="wd-role" className="form-control">
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="STUDENT">Student</option>
                    </select>
                </div>
                <div className="form-group mb-2">
                    <Link href="Signin" id="wd-signout-btn" className="btn btn-danger w-100">Signout</Link>
                </div>
            </form>
        </div>
    );
}
