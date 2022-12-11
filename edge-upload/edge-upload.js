import { EdgeWebstoreClient } from "@plasmo-corp/ewu"
import Package from "./../package.json" assert { type: "json" };

const productId = process.env.EDGE_PRODUCT_ID;
const accessTokenUrl = process.env.EDGE_ACCESS_TOKEN_URL;
const clientId = process.env.EDGE_CLIENT_ID;
const clientSecret = process.env.EDGE_CLIENT_SECRET;


console.log(`productId:${productId}`);
console.log(`accessTokenUrl:${accessTokenUrl}`);
console.log(`clientId:${clientId}`);
console.log(`clientSecret:${clientSecret}`);

const client = new EdgeWebstoreClient({
  productId,
  clientId,
  clientSecret,
  accessTokenUrl
});


const version = Package.version;


client.submit({
	filePath: "./../web-scrobbler-edge.zip",
	notes: `Upgrade to v${version}`,
});
