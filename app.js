const axios = require('axios');
const {sleepBreath} = require('./utils')
let testData = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

async function listenTradeInserts(){
    while(true){
        let res = {};
        try{
            res = await axios({
                method: 'get',
                baseURL: 'http://localhost:3000/',
                url: '/trades',
                timeout: 30001
            });
        } catch (e){
            console.log(e.message);
            await sleepBreath(1000);
            continue;
        }
        testData.push(res.data.data.id);
        console.log(testData);
        await sleepBreath(0);
    }
}

async function createNewTrades(){
    while(true){
        try{
            await axios({
                method: 'post',
                baseURL: 'http://localhost:3000/',
                url: '/trade',
                timeout: 30002,
                data: {
                    price: String(Math.random()*1000),
                    size: getRandomInt(0,100000),
                    side: Math.random() > 0.5,
                    client: (Math.random() + 1).toString(36).substring(2),
                    security: getRandomInt(0,100000),
                }
            });
        } catch (e){
            console.log(e.message);
            await sleepBreath(1000);
            continue;
        }
        await sleepBreath(10);
    }
}

async function createNewTrade() {
    try {
        res = await axios({
            method: 'post',
            baseURL: 'http://localhost:3000/',
            url: '/trade',
            timeout: 30003,
            data: {
                price: String(Math.random() * 1000),
                size: getRandomInt(0, 100000),
                side: Math.random() > 0.5,
                client: (Math.random() + 1).toString(36).substring(2),
                security: getRandomInt(0, 100000),
            }
        });
        return res.config.data
    } catch (e) {
        console.log(e.message)
    }
}

async function createNewSecurity() {
    try {
        res = await axios({
            method: 'post',
            baseURL: 'http://localhost:3000/',
            url: '/security',
            timeout: 30004,
            data: {
                seccode: (Math.random() + 1).toString(36).substring(2),
                price: getRandomInt(0, 100000),
                isin: (Math.random() + 1).toString(36).substring(2),
                lotsize: getRandomInt(0, 100000),
            }
        });
        return res.config.data
    } catch (e) {
        console.log(e.message)
    }
}

async function getSecurityById(id) {
    try {
        res = await axios({
            method: 'get',
            baseURL: 'http://localhost:3000/',
            url: `/security/${id}`,
            timeout: 30005
        });
        return res.data
    } catch (e) {
        console.log(e.message)
    }
}

async function getSecurity(page,limit) {
    try {
        res = await axios({
            method: 'get',
            baseURL: 'http://localhost:3000/',
            url: `/security`,
            timeout: 30006,
            params: {
                page: page,
                limit: limit
            },
        });
        return res.data
    } catch (e) {
        console.log(e.message)
    }
}
async function app(){

    listenTradeInserts();
    let currPage = 1;
    let funcPool = [
        async () => {
        console.log('getSecurityById');
        return await getSecurityById(getRandomInt(1, 3))
        },
        async () => {
            console.log('createNewSecurity');
            return await createNewSecurity()
        },
        async () => {
            console.log('createNewTrade');
            return await createNewTrade()
        },
        async () => {
            console.log('getSecurity');
            let res = await getSecurity(currPage,10);
            currPage = Number(res.meta.pagination.page) + 1;
            return res;
        }
    ]

    while(true){
        let res = await funcPool[getRandomInt(0, 4)]()
        console.log(res,'\n');
        await sleepBreath(6000);
    }
}

app();
// createNewTrades()



