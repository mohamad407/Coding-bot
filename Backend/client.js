const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, resolve);
    });
}

async function main() {
    console.clear();

    console.log("========================================");
    console.log("              CODING BOT");
    console.log("========================================\n");

    let url = await ask("Enter Backend URL: ");

    url = url.trim().replace(/\/+$/, "");

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        console.log("\nInvalid backend URL.");
        rl.close();
        return;
    }

    console.log("\nConnected to:", url);

    while (true) {
        console.log("\n----------------------------------------");
        console.log("1. Generate Code");
        console.log("2. Disconnect");
        console.log("----------------------------------------");

        const choice = await ask("Choose: ");

        if (choice.trim() === "2") {
            console.log("\nDisconnected.");
            rl.close();
            return;
        }

        if (choice.trim() !== "1") {
            console.log("\nInvalid option.");
            continue;
        }

        const question = await ask("\nEnter coding question: ");

        if (!question.trim()) {
            console.log("\nQuestion cannot be empty.");
            continue;
        }

        console.log("\nGenerating...\n");

        try {
            const response = await fetch(`${url}/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question.trim()
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.log("Error:", data.error || "Generation failed");
                continue;
            }

            console.log("========================================");
            console.log("              GENERATED CODE");
            console.log("========================================\n");

            console.log(data.answer);

            console.log("\n========================================");

        } catch (error) {
            console.log("\nConnection failed.");
            console.log("Check the backend URL and server status.");
        }
    }
}

main();
