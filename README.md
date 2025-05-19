# CROP-CHAIN

Decentralised Plant Disease detection and solution verification system.This repo has the front-end code of the project. This is a research project. Technologies include Hardhat, Ipfs, web3 , moralis and Ethereum smart contract development using solidity.This uses PROOF OF AUTHORITY as its consensus mechanism.This is a permissioned chain so the admin aka KvkManager is the who can give access to the chain, who is also the deployer of the smart contract.

Actors Include KvkManager, Farmers and Scientist. The manager includes the farmers and Scientist to the chain. Farmers upload the images. which are first viewed by the AI and are then reviewed by the Scientists and at last all the verifiers vote to verify the correctness of the solutions provided.By this way they arrive at a decision of correct solution for a given plant diesase.

# PROJECT ARCHITECTURE
![Screenshot from 2024-03-31 12-30-30](https://github.com/Adhitya-Vardhan/CropChain-UI/assets/116478666/3aa45eef-2468-437c-9a37-dd9f2b3e061c)
Flow
![op](https://github.com/Adhitya-Vardhan/CropChain-UI/assets/116478666/6af22342-42a9-40ee-b766-1f4e4974353e)


## 🔗 Links

FrontEnd deployment ->[https://adhitya-vardhan.github.io/CropChain-UI/](https://adhitya-vardhan.github.io/CropChain-UI/)

SmartContract->[https://github.com/Adhitya-Vardhan/CropChain ](https://github.com/Adhitya-Vardhan/CropChain)

Etherscan Testnet->[https://sepolia.etherscan.io/tx/0x040fea4b8a199911d5639d042280f57f3faec8baf3cddd6150cc3dd8c104da50](https://sepolia.etherscan.io/tx/0x040fea4b8a199911d5639d042280f57f3faec8baf3cddd6150cc3dd8c104da50)



## UI

Home page: 

![image](https://github.com/user-attachments/assets/9bc2f4d9-ea18-4f04-9af9-1e2b2221e33d)

Login page:

![Screenshot 2025-05-19 133522](https://github.com/user-attachments/assets/abf54fb5-cae4-4303-88ed-2b3aaf4901ab)

Farmer Page:

![Screenshot 2025-05-19 134841](https://github.com/user-attachments/assets/ffaa0fec-fad7-4eda-af9a-4a475ae614b5)
![Screenshot 2025-05-19 135132](https://github.com/user-attachments/assets/f2366b00-2782-4492-a625-871a1be8ceac)

Scientist Page:

![Screenshot 2025-05-19 135411](https://github.com/user-attachments/assets/6094fa1f-43ef-456e-aaed-c8adff97d70b)
![Screenshot 2025-05-19 135443](https://github.com/user-attachments/assets/b3125b9d-4eb7-4a32-912e-cd45eae0cd13)

KvkManager Page:

![Screenshot 2025-05-19 140621](https://github.com/user-attachments/assets/9d7a3d48-e172-4512-93fd-52c38da72b4a)
![Screenshot 2025-05-19 141323](https://github.com/user-attachments/assets/26e74be7-a073-4418-bb99-0fec526ca39f)

Other Pages:

![Screenshot 2025-05-19 140433](https://github.com/user-attachments/assets/1964de8b-2b84-43aa-b4f8-fcffc8178beb)
![Screenshot 2025-05-19 142214](https://github.com/user-attachments/assets/d2cf4bc9-40bf-4318-a6b6-33f8f13dbabd)
![Screenshot 2025-05-19 141704](https://github.com/user-attachments/assets/8cef08ef-232c-4a69-87fc-89656d16ebb0)
![Screenshot 2025-05-19 135649](https://github.com/user-attachments/assets/1428120d-d02c-463c-a3da-33b63cb016fa)
![Screenshot 2025-05-19 135906](https://github.com/user-attachments/assets/19305e6c-35f8-4f38-be64-4673379297d8)



## Private keys

create a .env file and initialise these variables. Generate your pinata API key after going to Pinata website

```bash
REACT_APP_DEPLOYER -> address of the deployer
REACT_APP_PINATA_API_KEY -> secret api key
REACT_APP_PINATA_SECRET_API_KEY -> secret Api key of Pinata
REACT_APP_CONTRACT -> where the contract is deployed -> Addresss
```

## Installation

Locate to the root folder of the project.

To install all the dependencies

```bash
  npm i
```
To start the project

   ```bash 
  npm start
``` 
## License

[MIT](https://choosealicense.com/licenses/mit/)

