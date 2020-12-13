module.exports = checkDate = (date) => {
    let isValid = false;
    if(date.calanderType == "GC"){
        if((date.day > 0 && date.day <= 31) && (date.month > 0 && date.month <= 12) && (date.year >= 2020)){
            isValid = true;
        }
        else {
            isValid = false;
        }
    }

    else if(date.calanderType == "EC"){
        if((date.day > 0 && date.day <= 30) && (date.month > 0 && date.month <= 13) && (date.year >= 2013)){
            isValid = true;    
        }
        else {
            isValid = false;
        }
    }
    console.log(isValid);
    return isValid;
};

