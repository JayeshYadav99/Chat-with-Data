const formatConvHistory=(messages)=> {
    return messages.map((message, i) => {
        if (i % 2 === 0){
            return `Human: ${message}`
        } else {
            return `AI: ${message}`
        }
    }).join('\n')
}

module.exports=formatConvHistory;