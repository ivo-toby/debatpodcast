/* eslint-disable */
const { runInThisContext } = require('vm');
const {argv} = require('yargs')
const azFunction = argv.function;
const mock = argv.mock;

const context = require(`./mocks/${mock}/context`);
const req = require(`./mocks/${mock}/request`);
const API = require(`./dist/${azFunction}/index`).default;

// // Map local settings to process.env
const settings = require('./local.settings.json');
Object.keys(settings.Values).forEach((setting)=>{
    const value = settings.Values[setting];
    process.env[setting] = value;
})

// for (let i=0;i<25;i++){
//     const start = new Date();
//     API(context, req).then((response) => {
//         if (response.res.body.contentCollection) {
//             const end = new Date();
//             console.log(start.getTime())
//             const diff = (end.getTime() - start.getTime());
//             // + ' ' + end.getTime() - end.getTime()
//             console.log(response.res.body.contentCollection.total + ' ' + diff );
//         }else{
//             console.log(response.res.body);
//         }
//     });
// }
//
const avgArray = [];
async function runTest(){
    for (let i=0;i<100;i++){
        const start = new Date();
        const count = await runCall();
        const end = new Date();
        const diff = (end.getTime() - start.getTime());
        avgArray.push(diff);
        console.log(`${start.getTime()} : ${end.getTime()} = ${diff} - > ${count}`);
    }
    return "done";
}

runTest().then((count)=>{
    const avgCount = avgArray.length;
    let total = 0;
    avgArray.forEach(num => {
        total = total+num;
    });
    const avg = (total / avgCount)
    console.log(`Avg: ${avg}`);
})

async function runCall(){
    const apiResponse = await API(context, req);
    return apiResponse.res.body.contentCollection.total;
}