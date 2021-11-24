import {CasperClient, CasperServiceByJsonRPC, CLPublicKey, DeployUtil, Keys} from "casper-js-sdk";
import {Buffer} from "buffer";


const testPage = () => {

    // const apiUrl = 'https://event-store-api-clarity-testnet.make.services';
    const apiUrl = 'https://node-clarity-testnet.make.services/rpc';
    const casperService = new CasperServiceByJsonRPC(apiUrl);
    const casperClient = new CasperClient(apiUrl);

    const transfer = async ()=>{


        const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();
        const latestBlock = await casperService.getLatestBlockInfo();
        const root = await casperService.getStateRootHash(latestBlock.block.hash);
        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
            root,
            CLPublicKey.fromHex(publicKeyHex)
        )
        const balance = await casperService.getAccountBalance(
            latestBlock.block.header.state_root_hash,
            balanceUref
        );

        console.log(balance.toString())

    };

    return <div><a href={"#"} onClick={async e =>  {
        e.preventDefault()
        await transfer()
    }
    }>Transfer</a>
    </div>
}


export default testPage