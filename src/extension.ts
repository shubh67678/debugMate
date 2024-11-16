// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';


function processFile(filePath: string, searchString: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        // Read the file asynchronously
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading the file: ${err}`);
                return;
            }

            const lines = data.split('\n');

            // Slice the lines to remove the last 7 lines
            const linesToProcess = lines.slice(0, lines.length - 7);

            // Find the last occurrence of the search string
            let lastIndex = -1;
            for (let i = linesToProcess.length - 1; i >= 0; i--) {
                if (linesToProcess[i].includes(searchString)) {
                    lastIndex = i;
                    break;
                }
            }

            let resultLines: string[] = [];
            // If the search string is found, return the lines from the last occurrence to the end
            if (lastIndex !== -1) {
                resultLines = linesToProcess.slice(lastIndex); // Get all lines from the last occurrence onwards
                resolve(resultLines);  // Return the result through resolve
            } else {
                reject(`The search string '${searchString}' was not found in the file.`);
            }
        });
    });
}


function readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Read the file asynchronously
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading the file: ${err}`);
                return;
            }
			// console.log(data);
			resolve(data);
        });
    });
}


function saveListToFile(fileName: string, data: string[]): void {
	const fileContent = data.join('\n');  // Join the list of strings with newlines
	fs.writeFile(fileName, fileContent, (err) => {
	  if (err) {
		console.error('Error writing to file', err);
	  } else {
		console.log('File saved successfully');
	  }
	});
  }
  
  // Example usage:


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	var counter = 0;
	var cur_file = "";
	const terminal = vscode.window.createTerminal('My Terminal');

	const ERROR_OUTPUT_FILE = "C:\\Users\\shubh\\tmp\\error-output.txt";
	const GIT_DIFF_FILE = "C:\\Users\\shubh\\tmp\\git-diff-output.txt";
	const TERMINAL_OUTPUT_FILE = "C:\\Users\\shubh\\tmp\\terminal-output"; // make complete with counter
	
	let current_git_diff: string;
	let current_error_log: string;

	startRecording(terminal);


	function saveTerminalOutput(terminal: any): void {
		terminal.sendText('Stop-Transcript');
	}

	function parseTerminalOutput(filePath: string, searchString: string){
		processFile(filePath, searchString)
			.then(resultLines => {
				current_error_log = resultLines.join("\n");
			})
			.catch(error => {
				console.error(error);
			});
	}

	function startRecording(terminal: any): void {
		terminal.show();
		counter += 1;
		const filePath = TERMINAL_OUTPUT_FILE + counter.toString() + ".txt";  // Correct file path with escaped backslashes
		cur_file = filePath;
		terminal.sendText('Start-Transcript ' + "\"" + filePath + "\"");
	}
	

	const recordTerminal = vscode.commands.registerCommand('debugmate.startRecording', () => {
		terminal.show();
		counter += 1;
		const filePath = TERMINAL_OUTPUT_FILE + counter.toString() + ".txt";  // Correct file path with escaped backslashes
		cur_file = filePath;
		terminal.sendText('Start-Transcript ' + "\"" + filePath + "\"");
	});



	const printTerminalData = vscode.commands.registerCommand('debugmate.printTerminalData', () => {
		// terminal.show();
		// terminal.pr
		terminal.sendText('Stop-Transcript');
		const searchString = 'debugmate>';  // String to search for
		processFile(cur_file, searchString)
		.then(resultLines => {
			current_error_log = resultLines.join("\n");
			// console.log("Returning result lines from the last occurrence:");
			// resultLines.forEach(line => console.log(line));
			saveListToFile(ERROR_OUTPUT_FILE, resultLines);
		})
		.catch(error => {
			console.error(error);
		});
	});

	const gitDiff = vscode.commands.registerCommand('debugmate.gitDiff', () => {
		// terminal.show();
		terminal.sendText('git diff > ' + GIT_DIFF_FILE);
		readFile(GIT_DIFF_FILE)
			.then(response => {current_git_diff = response;})
	});


	const generatePrompt = vscode.commands.registerCommand('debugmate.generatePrompt', () => {
		console.log(current_error_log);
		console.log(current_git_diff);
	})
	


	const findError = vscode.commands.registerCommand('debugmate.findError', () => {
		terminal.show();

		saveTerminalOutput(terminal);
		const searchString = 'debugmate>';  // String to search for
		// processFile(cur_file, searchString);
		
		terminal.sendText('git diff > ' + GIT_DIFF_FILE);
		readFile(GIT_DIFF_FILE)
			.then(response => {current_git_diff = response;})
		parseTerminalOutput(cur_file, searchString);
		startRecording(terminal);
		

		console.log(current_error_log);
		console.log(current_git_diff);
	})
	
	context.subscriptions.push(printTerminalData);
	context.subscriptions.push(gitDiff);
	context.subscriptions.push(recordTerminal);
	context.subscriptions.push(generatePrompt);
	context.subscriptions.push(findError);
}


export function deactivate() {}
