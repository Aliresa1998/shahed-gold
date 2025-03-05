import { Result } from 'antd';
import React from 'react';
import { NavLink } from "react-router-dom";
import CheckAuth from "../CheckAuth";
const NotFound = () => {

    return (
        <div>
            <CheckAuth />
            <Result
                status="404"
                title="خطای 404 - صفحه پیدا نشد"
                subTitle="صفحه‌ای که به دنبال آن هستید پیدا نشد."
                extra={
                    <NavLink to="/dashboard">بازگشت به داشبورد</NavLink>
                }
            />
        </div>
    )


};
export default NotFound;