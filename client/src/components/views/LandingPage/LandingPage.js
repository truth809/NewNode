import React, { useEffect } from 'react'
import axios from 'axios';
import { response } from 'express';

function LandingPage() {
    // LandingPage들어오면 useEffect를 실행
    useEffect(() => {
        // 서버로 보낸다
        axios.get('/api/hello')
        // 서버에서 돌아옴
        .then(response => console.log(response.data))

    }, [])

    return (
        <div>
            LandingPage 랜딩페이지
        </div>
    )
}

export default LandingPage
