import React from "react";
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Detail() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state === null) {
            navigate("/");
        }
    });

    if (location.state) {
        const { summary } = location.state;
        console.log(location.state)
        return <span>{summary}</span>;
        

    }

    
    return null;


  
}

export default Detail;