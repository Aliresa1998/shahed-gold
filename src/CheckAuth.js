import React, { useState, useEffect } from "react";
import { controller } from "./assets/controller/controller";
const CheckAuth = () => {
    const checkExpireToken = async () => {
        if (localStorage.getItem("user")) {
            const response = await controller.checkAdminUser()
            console.log("ressss", response)
            if (response.status == 401) {
                localStorage.clear();
                window.location.href = "/";
            }
        }
    }
    React.useEffect(() => {
        checkExpireToken()
    }, [])
    return (
        <></>
    )
}

export default CheckAuth;