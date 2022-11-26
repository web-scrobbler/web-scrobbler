import { EdgeWebstoreClient } from "@plasmo-corp/ewu"

const productId = process.env.EDGE_PRODUCT_ID;
const accessTokenUrl = process.env.EDGE_ACCESS_TOKEN_URL;
const clientId = process.env.EDGE_CLIENT_ID;
const clientSecret = process.env.EDGE_CLIENT_SECRET;


const client = new EdgeWebstoreClient({
  productId,
  clientId,
  clientSecret,
  accessTokenUrl
});


client.submit({
	filePath: "./web-scrobbler-edge.zip",
	notes: 'Upgrade to v2.81.0',
});
