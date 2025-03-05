const local = {
    apiGateway: {
        //URL: "https://api.smilepass.com"
        URL: "https://back.shahedgold.com/"
    },
    mediaGateway: {
        //URL: "https://api.smilepass.com"
        URL: "https://back.shahedgold.com/"
    },
    stripe: {
        key: 'pk_test_Osu2iYG3m8zmTD1xI1vljmJN00jDeQAy6a'
    },
};

const staging = {
    apiGateway: {
        //URL: "https://api.smilepass.com"
        URL: "https://back.shahedgold.com/"
    },
    mediaGateway: {
        //URL: "https://api.smilepass.com"
        URL: "https://back.shahedgold.com/"
    },
    stripe: {
        key: 'pk_test_Osu2iYG3m8zmTD1xI1vljmJN00jDeQAy6a'
    },
};

const production = {
    apiGateway: {
        //URL: "https://api.smilepass.com"
        URL: "https://back.shahedgold.com/"
    },
    mediaGateway: {
        //URL: "https://api.smilepass.com"
        URL: "https://back.shahedgold.com/"
    },
    stripe: {
        //URL: "https://api.smilepass.com"
        URL: "https://back.shahedgold.com/"
    },
}


const config = process.env.REACT_APP_DEPLOYMENT === 'production' ? production : ((process.env.REACT_APP_DEPLOYMENT === 'staging') ? staging : local);

export default {
    someCommonConfig: '',
    ...config
};






