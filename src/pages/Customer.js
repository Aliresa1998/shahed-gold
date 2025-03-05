import React, { useState } from "react";
import CustomerCreate from "./CustomerCreate";
import CustomerEdit from "./CustomerEdit";
import CustomerTable from "./CustomerTable";
import CustomerTol from "./CustomerTol";
// import { controller } from "../assets/controller/controller";

const Customer = () => {
    const [mode, setMode] = useState("table");
    /*
        modes :
        1. table
        2. new
        3. edit
    */
    const [editData, setEditData] = useState({});
    const [tolData, setTolData] = useState({});

    const handleManageMode = (mode) => {
        setMode(mode)
    }

    const handleTol = (data) => {
        setTolData(data)
        setMode("tol")
    }

    const handleEditedData = (data) => {
        setEditData(data)
        setMode("edit")
    }

    return (
        mode == "table" ?
            <CustomerTable handleManageMode={handleManageMode} handleEditedData={handleEditedData} handleTol={handleTol} />
            :
            mode == "new" ?
                <CustomerCreate handleManageMode={handleManageMode} />
                :
                mode == "edit" ?
                    <CustomerEdit handleManageMode={handleManageMode} editData={editData} />
                    :
                    mode == "tol" ?
                        <CustomerTol handleManageMode={handleManageMode} tolData={tolData} />
                        :
                        <></>
    )
}

export default Customer;