// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

function processFile(filePath: string, searchString: string, outputFile: string): void {
    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the file: ${err}`);
            return;
        }

        var lines = data.split('\n');
		// lines = lines[:-5];
		lines = lines.slice(0, lines.length - 6);


		for(let i = 0; i<lines.length; i++){
			console.log(lines[i]);
		}

        // console.log(`Total lines in the file: ${lines.length}`);
        
        // let lastIndex = -1;
        // let secondLastIndex = -1;
        // let once = false;

        // let interestedLines: string[] = [];

        // // Find the last and second-to-last occurrence of the search string
        // for (let i = lines.length - 1; i >= 0; i--) {
        //     console.log(`Checking line ${i}: ${lines[i]}`);

        //     if (lines[i].includes(searchString)) {
        //         console.log(`Found search string at line ${i}`);
        //         if (once) {
        //             secondLastIndex = i;
        //             console.log(`Second-to-last occurrence found at line ${secondLastIndex}`);
        //             break;
        //         }
        //         once = true;
        //         lastIndex = i;
        //         console.log(`Last occurrence found at line ${lastIndex}`);
        //     }
        // }

        // // Debug the final indices found
        // console.log(`Last occurrence index: ${lastIndex}`);
        // console.log(`Second-to-last occurrence index: ${secondLastIndex}`);

        // // If both occurrences were found, create the array as per the requirement
        // if (secondLastIndex !== -1 && lastIndex !== -1) {
        //     // Get lines after the second-to-last occurrence and before the last occurrence
        //     interestedLines = lines.slice(secondLastIndex + 1, lastIndex).concat(lines.slice(lastIndex + 1));

        //     // Optionally write the result to the output file
        //     // fs.writeFile(outputFile, interestedLines.join('\n'), (err) => {
        //     //     if (err) {
        //     //         console.error(`Error writing to the file: ${err}`);
        //     //     } else {
        //     //         console.log(`Data has been written to ${outputFile}`);
        //     //     }
        //     // });

        //     console.log(`The following lines are the result:`);
        //     console.log(interestedLines.join('\n'));
        // } else {
        //     console.log(`Less than two occurrences of '${searchString}' were found in the file.`);
        // }
    });
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {



	const printTerminalData = vscode.commands.registerCommand('debugmate.printTerminalData', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
	// 	const terminal = vscode.window.createTerminal('My Terminal');
    // terminal.show();
    // terminal.sendText('wsl awk \'{line[NR]=$0} END {for(i=NR;i>=1;i--) if(line[i] ~ /shubham@LAPTOP-U5S0C6BK/) {for(j=i;j<=NR;j++) print line[j]; break}}\' /mnt/c/Users/shubh/tmp/typescript');
    // vscode.window.showInformationMessage('Following is your current terminal data');
		
		const filePath = 'C:\\Users\\shubh\\terminal-output.txt';  // Correct file path with escaped backslashes

		const searchString = 'shubh';  // String to search for
		const outputFile = '~/last_command.txt';  // Output file name

		processFile(filePath, searchString, outputFile);

	});

	context.subscriptions.push(printTerminalData);
}

// This method is called when your extension is deactivated
export function deactivate() {}
