async function test() {
  const username = "rishnudk"; // Using the workspace mapping user "rishnudk/Stack"
  
  // Test REST API
  try {
    const restRes = await fetch(`http://localhost:4000/trpc/devStats.getGitHubStats?input={"username":"${username}"}`);
    const restData = await restRes.json();
    console.log("REST API Stats:", JSON.stringify(restData?.result?.data, null, 2));
  } catch (e) {
    console.error("REST API error:", e);
  }
}

test();
