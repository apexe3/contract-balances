import { Injectable } from '@nestjs/common';
import { EtheriumTokens } from './etheriumToken';
import { AddressBalanceMap } from 'eth-balance-checker';
import * as Ethers from 'ethers';
import * as BN from 'bn.js';
@Injectable()
export class AppService {
  async getBalances(): Promise<any> {
    const promises: Array<Promise<BN>> = [];
    const Web3 = require('web3');
    const provider =
      'https://mainnet.infura.io/v3/b509a32f1d2a412d958d135660d62b8a';

    const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

    const tokenAbi = [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ];

    const tokenObj = EtheriumTokens.filter((t) => {
      if (t.address) {
        return true;
      } else {
        return false;
      }
    });
    const tokenAddresses = tokenObj.map((i) => i.address);
    console.log('tokenAddresses', tokenAddresses);
    const address = ['0x742d35cc6634c0532925a3b844bc454e4438f44e'];

    const data = address.map((address) => {
      return {
        [address]: tokenAddresses.map(async (tokenAddr) => {
          const eth = Ethers.getDefaultProvider();
          const contract: any = new Web3Client.eth.Contract(
            tokenAbi,
            tokenAddr,
          );
          promises.push(
            contract.methods
              .balanceOf(address)
              .call()
              .catch(() => new BN(0)),
          );
        }),
      };
    });

    return Promise.all(promises).then((responses) => {
      const balances: AddressBalanceMap = {};
      address.forEach((address, addressIdx) => {
        balances[address] = {};
        tokenAddresses.forEach((tokenAddr, tokenIdx) => {
          const balance =
            responses[addressIdx * tokenAddresses.length + tokenIdx];
          balances[address][tokenAddr] = balance.toString();
        });
      });
      console.log(balances);
      return balances;
    });

    // const result = await Web3Client.eth.getBalance(
    //   '0xbFe35Cfb1bC98F56709595633E26F39eA2725fA8',
    // );
    // const format = Web3Client.utils.fromWei(result);

    console.log('abc', data);
  }
}
