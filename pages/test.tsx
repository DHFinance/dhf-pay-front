import {CasperClient, CasperServiceByJsonRPC, CLPublicKey, DeployUtil, Keys} from "casper-js-sdk";
import {Buffer} from "buffer";


const testPage = () => {

    // const apiUrl = 'https://event-store-api-clarity-testnet.make.services';
    const apiUrl = 'https://node-clarity-testnet.make.services/rpc';
    const casperService = new CasperServiceByJsonRPC(apiUrl);
    const casperClient = new CasperClient(apiUrl);

    const transfer = async ()=>{

        // const prKey = Keys.Ed25519.parsePrivateKey(Uint8Array.from(Buffer.from("MC4CAQAwBQYDK2VwBCIEICskzyRNMeBLjaZ4vRI4pRPlhWI/+jvW0PYDcQIDfzYm", "hex")));
        // const pbKey = Keys.Ed25519.parsePublicKey(Uint8Array.from(Buffer.from("MCowBQYDK2VwAyEAbs+KZPmzQdeAXWvFBBvEITlURWHwen31odZg2PJhn+4=", "hex")))

        // const pare = Keys.Ed25519.parseKeyPair(Uint8Array.from(Buffer.from("MC4CAQAwBQYDK2VwBCIEICskzyRNMeBLjaZ4vRI4pRPlhWI/+jvW0PYDcQIDfzYm", "hex")),
        //     Uint8Array.from(Buffer.from("MCowBQYDK2VwAyEAbs+KZPmzQdeAXWvFBBvEITlURWHwen31odZg2PJhn+4=", "hex")))


        // const publicKey = await window.casperlabsHelper.getActivePublicKey();
        // const casper = await window.casperlabsHelper;
        // debugger
        //
        //
        // const clPK = CLPublicKey.fromHex('016ecf8a64f9b341d7805d6bc5041bc42139544561f07a7df5a1d660d8f2619fee')
        //
        // const id = 187821;
        // const gasPrice = 1;
        // const ttl = 1800000;
        //
        // const paymentAmount = 10000000000;
        //
        // let deployParams = new DeployUtil.DeployParams(
        //     clPK,
        //     'test-network',
        //     gasPrice,
        //     ttl
        // );
        //
        // const session = DeployUtil.ExecutableDeployItem.newTransfer(
        //     paymentAmount,
        //     CLPublicKey.fromHex('010eee1078c906942cf609cf01b73dfc6551bc79bb3ab06ee80f912a641bbdd666'),
        //     null,
        //     id
        // );
        //
        //
        // const payment = DeployUtil.standardPayment(paymentAmount);
        // const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        // const signedDeploy = DeployUtil.signDeploy(deploy, pare);
        //
        // console.log(signedDeploy)
        //



        const to = '010eee1078c906942cf609cf01b73dfc6551bc79bb3ab06ee80f912a641bbdd666';
// get amount to send from input.
        const amount = '2500000000'
// For native-transfers the payment price is fixed.
        const paymentAmount = 2500000000;

// transfer_id field in the request to tag the transaction and to correlate it to your back-end storage.
        const id = 287821;

// gasPrice for native transfers can be set to 1.
        const gasPrice = 1;

// Time that the deploy will remain valid for, in milliseconds
// The default value is 1800000 ms (30 minutes).
        const ttl = 1800000;
        const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();
        const publicKey = CLPublicKey.fromHex(publicKeyHex)

        let deployParams = new DeployUtil.DeployParams(publicKey,"casper-test",gasPrice,ttl );

// We create a public key from account-address (it is the hex representation of the public-key with an added prefix).
        const toPublicKey = CLPublicKey.fromHex(to);

        const session = DeployUtil.ExecutableDeployItem.newTransfer( amount,toPublicKey,null,id);

        const payment = DeployUtil.standardPayment(paymentAmount);
        const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

// Turn your transaction data to format JSON
        const json = DeployUtil.deployToJson(deploy)

// Sign transcation using casper-signer.
        const signature = await window.casperlabsHelper.sign(json,publicKeyHex,to)
        const deployObject = DeployUtil.deployFromJson(signature)

// Here we are sending the signed deploy.
        // @ts-ignore
        const signed = await casperClient.putDeploy(deployObject.val);
        console.log(signed)


    };

    return <div><a href={"#"} onClick={async e =>  {
        e.preventDefault()
        await transfer()
    }
    }>Transfer</a></div>
}


export default testPage