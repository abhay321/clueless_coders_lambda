// Import BedrockRuntimeClient and InvokeModelCommand classes from the @aws-sdk/client-bedrock-runtime
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
// Instance of the BedrockRuntimeClient 
const client = new BedrockRuntimeClient({ region: "us-east-1" });

module.exports.bedrock = async (event) => {
  const prompt = 'Extract travel information to write sql query in json format key like location, check-in-date, check-out-date, rating and amenities without explanation from this phase: '+ event.prompt;
  const input = {
    "modelId": "cohere.command-text-v14",
    "contentType": "application/json",
    "accept": "*/*",
    "body": JSON.stringify({
      "prompt": prompt,
      "max_tokens": 200,
      "temperature": 0.7,
      "p": 0.01,
      "k": 0
    })
  };

  try {
    // It uses the client.send method to invoke the model with the provided input.
    const data = await client.send(new InvokeModelCommand(input));
    const jsonString = Buffer.from(data.body).toString('utf8');
    const parsedData = JSON.parse(jsonString);
    const text = JSON.parse(parsedData.generations[0].text.replace(/`|json/gi, ""))
    return {
      status:200,
      data:text
    }
  } catch (error) {
    console.error(error);
    return {
      status:400,
      error:error
    }
  }
};