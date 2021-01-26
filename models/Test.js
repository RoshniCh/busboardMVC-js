class Bus{
	constructor(line, towards, time) {
		this.line = line;
		this.towards = towards;
		this.time = time;
	}

	showTestData() {
//		return this.name + ", id: " + this.id; 
        return this.line + " towards " + this.towards + " in " + this.time + " seconds"
//console.log(`${bus.line} towards ${bus.towards} : ${toMinutes(bus.time)}`))
	};

	// editName(newName) {
	// 	this.name = newName
	// }
}; 

module.exports = Bus;
