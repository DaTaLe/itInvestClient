module.exports.sleepBreath = async function sleepBreath (delayInMs) {
    return new Promise(res => setTimeout(() => {res()}, delayInMs));
}