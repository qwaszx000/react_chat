function checkExist(obj){
	if(obj === "" || obj.length === 0 || obj === null || obj === undefined){
		return false;
	}
	return true;
}

module.exports.checkExist = checkExist;