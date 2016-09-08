/***********************************************************************************************************
 *                                                                                                         *
 * This file manages the CLI used to interact with the program, no assignment specific stuff happens here. *
 *                                                                                                         *
 ***********************************************************************************************************/

const readLine = require('readline');
const dl = require('./DataLoader');
const assignments = require('./Assignments');
function CLI()
{
	this.interface = readLine.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	this.kVals = [3, 5, 10, 50, 100];
	this.message = "Available commands: " +
		"\n* 1\t Run assignment 1" +
		"\n* 3 \<k\>\t Run assignment 3 with the specified k value (" + this.kVals.join(", ") + ")" +
		"\n* 4 \<k\>\t Run assignment 4 with the specified k value (" + this.kVals.join(", ") + ")" +
		"\n* 5 \<k\>\t Run assignment 5 with the specified k value (" + this.kVals.join(", ") + ")" +
		"\n* exit\t Exit program";
	const $this = this;
	dl.load(function()
	{
		$this.data = dl.data;
		$this.listen();
	});
}
CLI.prototype.listen = function()
{
	const $this = this;

	this.interface.question(this.message + "\n>", function(command)
	{
		console.log("\n");
		$this.interface.prompt();
		command = command.indexOf("exit") != -1 ? "0" : command;
		command = command.replace(/[\ \D]*/, "").split(" ");

		switch(Number(command[0]))
		{
			case 0:
				console.log("Bye bye");
				process.exit(0);
				break;
			case 1:
				assignments.a1($this.data);
				break;
			case 3:
			case 4:
				var a = Number(command[0]);
				var k = command.length > 1 ? Number(command[1]) : -1;

				if(k != -1 && $this.kVals.indexOf(k) != -1)
				{  assignments.a3And4(a, $this.data, k)}
				else
				{  console.error("\nInvalid value for k specified. Example:\n>3 10"); }
				break;
			case 5:
				k = command.length > 1 ? Number(command[1]) : -1;

				if(k != -1 && $this.kVals.indexOf(k) != -1)
				{  assignments.a5($this.data, k)}
				else
				{  console.error("\nInvalid value for k specified. Example:\n>5 10"); }
				break;
			default:
				console.error("\nCommand not Recognized");
				break;
		}
		console.log("\n");
		$this.listen();
	});
};
new CLI();