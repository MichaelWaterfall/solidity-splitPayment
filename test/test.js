const SplitPayment = artifacts.require("SplitPayment");

contract('SplitPayment', (accounts) => {
    let splitPayment = null;
    before(async() => {
        splitPayment = await SplitPayment.deployed()
    });

    it('should deploy contract ', async () => {
        assert(splitPayment.address != '');
    });

    it('should set accounts[0] as owner of contract', async () => {
       assert(await splitPayment.owner() === accounts[0]); 
    });

    it('should split payment', async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amounts = [40, 20, 30];
        const initialBalances = await Promise.all(recipients.map(recipient => {
            return web3.eth.getBalance(recipient);
        }));
        await splitPayment.send(
            recipients,
            amounts,
            {from: accounts[0], value: 90}
        );
        const finalBalances = await Promise.all(recipients.map(recipient => {
            return web3.eth.getBalance(recipient);
        }));
        recipients.forEach((_item, i) => {
            const finalBalance = web3.utils.toBN(finalBalances[i]);
            const initialBalance = web3.utils.toBN(initialBalances[i]);
            assert(finalBalance.sub(initialBalance).toNumber() === amounts[i]);
        });
    });

    it('should NOT split payment if array lengths are a mismatch', async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amount = [40, 20];
        try {
            await splitPayment.send(
                recipients,
                amount,
                {from: accounts[0], value: 90}
            );
        } catch (error) {
            assert(error.message.includes('The to and amount arrays must be equal in length'));
            return;
        }
        assert(false);
    });

    it('should NOT split payment if sender is not owner address', async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amount = [40, 20, 30];
        try {
            await splitPayment.send(
              recipients,
              amount,
              {from: accounts[1], value: 90}  
            );
        } catch (error) {
            assert(error.message.includes('Only the owner of the contract can call this function'));
            return;
        }
        assert(false);
    });
});