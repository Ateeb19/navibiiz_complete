import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaBoxOpen, FaUser, FaUsers } from "react-icons/fa";
import { RiSecurePaymentFill, RiUserFill } from "react-icons/ri";
import { BsBuildingsFill } from "react-icons/bs";
import { FaUserGear } from "react-icons/fa6";

export default function MobileBottomNav({ userRole }) {
    const location = useLocation();

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };


    return (
        <div
            className="mobile-bottom-nav d-flex justify-content-around align-items-center"
        >
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard', true) ? 'active' : ''}`}>
                <MdDashboard size={22} />
                <span>Dashboard</span>
            </Link>

            {userRole === 'Sadmin' ? (
                <>
                    <Link to="/dashboard/admin/companies" className={`nav-item ${isActive('/dashboard/admin/companies') ? 'active' : ''}`}>
                        <BsBuildingsFill size={22} />
                        <span> Companies</span>
                    </Link>

                    <Link to="/dashboard/admin/offers" className={`nav-item ${isActive('/dashboard/admin/offers') ? 'active' : ''}`}>
                        <FaUsers size={22} />
                        <span> Offers</span>
                    </Link>

                    <Link to="/dashboard/admin/payment" className={`nav-item ${isActive('/dashboard/admin/payment') ? 'active' : ''}`}>
                        <RiSecurePaymentFill size={22} />
                        <span> Payments</span>
                    </Link>

                    <Link to="/dashboard/admin/roles" className={`nav-item ${isActive('/dashboard/admin/roles') ? 'active' : ''}`}>
                        <FaUserGear size={22} />
                        <span> Roles</span>
                    </Link>
                </>) : (
                <>
                    {userRole === 'user' ? (
                        <Link to="/dashboard/orders" className={`nav-item ${isActive('/dashboard/orders') ? 'active' : ''}`}>
                            <FaBoxOpen size={22} />
                            <span>Shipments</span>
                        </Link>
                    ) : (
                        <Link to={userRole === 'user' ? "/dashboard/offers-user" : "/dashboard/offers-admin"} className={`nav-item ${isActive('/dashboard/offers') ? 'active' : ''}`}>
                            <MdPayment size={22} />
                            <span>Offers</span>
                        </Link>
                    )}


                    {userRole === 'user' && (
                        <Link to="/dashboard/payment" className={`nav-item ${isActive('/dashboard/payment') ? 'active' : ''}`}>
                            <RiSecurePaymentFill size={22} />
                            <span>Payments</span>
                        </Link>
                    )}
                </>
            )}

            <Link to="/dashboard/profile" className={`nav-item ${isActive('/dashboard/profile') ? 'active' : ''}`}>
                <RiUserFill size={22} />
                <span>Profile</span>
            </Link>
        </div>
    );
}
