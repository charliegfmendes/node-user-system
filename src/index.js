module.exports = {
    mobileNumberOrEmail: (data, firstFunction, secondFunction) => {
        const { mobileNumber, email } = data;
        if (!mobileNumber) {
            if (!email) {
                return 'A mobile number or email is required'
            } else {
                if(email.indexOf('@') > -1) {
                    return secondFunction(data)
                } else {
                    return 'Email is invalid'
                }
            }
        } else {
            if (isNaN(mobileNumber)) {
                return 'Mobile number is invalid' 
            } else {
                return firstFunction(data)
            }
        }
    }
}
