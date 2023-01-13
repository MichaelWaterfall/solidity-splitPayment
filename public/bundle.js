
const contractABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address payable[]",
          "name": "to",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amount",
          "type": "uint256[]"
        }
      ],
      "name": "send",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    }
  ];
const contractAddress = '0x58ce59853F0Bb8bF96f3Bc4A21609AC04692e341';
let web3 = new Web3('http://127.0.0.1:9545/');
let splitPaymentContract = new web3.eth.Contract(contractABI, contractAddress);

const initializeWeb3 = () => {
    return new Promise((resolve, reject) => {
        if(typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum)
            window.ethereum.enable()
                .then(() => {
                    resolve(
                        new Web3(window.ethereum)
                    );
                })
                .catch(error => {
                    reject(error);
                });
                return;
        }
        if(typeof window.web3 !== 'undefined') {
            return resolve(
                new Web3(window.web3.currentProvider)
            );
        }
    })
}

const initializeContract  = () => {
    return new web3.eth.Contract(contractABI, contractAddress);
};

const initializeApp = () => {
    const $toInput = document.getElementById("toInput");
    const $amountInput = document.getElementById("amountInput");
    const $button = document.getElementById("button");

    let accounts = [];

    web3.eth.getAccounts()
        .then(_accounts => {
            accounts = _accounts;
        });
    
    const toInput = $toInput.innerHTML;
    const amountInput = $amountInput.innerHTML;

   $button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("test");
        splitPaymentContract.methods
        .send(toInput, amountInput)
        .send({from: accounts[0]})
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error.message);
        })
   })


}

document.addEventListener('DOMContentLoaded', () => {
    initializeWeb3()
        .then(_web3 => {
            web3 = _web3;
            return initializeContract();
        })
        .then(_splitPaymentContract => {
            splitPaymentContract = _splitPaymentContract;
            initializeApp();
        })
        .catch(error => console.log(error));
})