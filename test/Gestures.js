const { expect } = require('chai');
const { ethers, network } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Gestures', () => {
  const NAME = 'Gestures'
  const SYMBOL = 'G'
  const COST = ether(0.1)
  const MAX_SUPPLY = 99
  const BASE_URI = 'ipfs://QmPk6cAtZ68tdeYEWSMfiznzDzuBXYXznZo4x5ArcbUJnp/'

  let nft,
      deployer,
      minter

  beforeEach(async () => {
    let accounts = await ethers.getSigners()
    deployer = accounts[0]
    minter = accounts[1]
  })

  describe('Deployment', () => {
    const WL_START_TIME = (Date.now() + 120000).toString().slice(0, 10) // starts in 2 minutes

    beforeEach(async () => {
      const Gestures = await ethers.getContractFactory('Gestures')
      nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)
    })

    it('has correct name', async () => {
      expect(await nft.name()).to.equal(NAME)
    })

    it('has correct symbol', async () => {
      expect(await nft.symbol()).to.equal(SYMBOL)
    })

    it('returns the cost to mint', async () => {
      expect(await nft.cost()).to.equal(COST)
    })

    it('returns the maximum total supply', async () => {
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY)
    })

    it('sets the start minting time correctly', async () => {
      expect(await nft.wlStartTime()).to.equal(WL_START_TIME)
    })

    it('returns the base URI', async () => {
      expect(await nft.baseURI()).to.equal(BASE_URI)
    })

    it('returns the owner', async () => {
      expect(await nft.owner()).to.equal(deployer.address)
    })
  })

  describe('Adding and Checking Whitelist', () => {
  let transaction, result, isWhitelisted

    describe('Success', async () => {

      const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

      beforeEach(async () => {
        const Gestures = await ethers.getContractFactory('Gestures')
        nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

      })

      it("checks the minter has been added to the whitelist.", async function () {
        // add minter address to updateWhitelist function - ENSURE ITS DONE BY OWNER (ACCOUNT[0])
        await nft.connect(deployer).updateWhitelist([minter.address], true)
        // expect that minter is on the whitelist when isWhitelisted is run and returns true.
        isWhitelisted = await nft.isWhitelisted(minter.address)
        expect(isWhitelisted).to.equal(true)
      })
    })

    describe('Failure', async () => {

      it("reverts when the minter tries to add themselves to the whitelist.", async function () {
        // try to have the minter add themselves to the whitelist...
        await expect(nft.connect(minter).updateWhitelist([minter.address], true)).to.be.reverted
      })
    })
  })

  describe('Whitelist Minting', () => {
  let transaction, result, isWhitelisted

  const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

    describe('Success', async () => {

      beforeEach(async () => {
        const Gestures = await ethers.getContractFactory('Gestures')
        nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

      })
      // it("allows whitelist minting because the mint is open.", async function () {

      //   wMintAmount = 1
      //   cost = await nft.cost()
      //   tx = nft.whitelistMint(wMintAmount, {from: minter, value: cost})

      //   await network.provider.send('evm_setNextBlockTimestamp', [currentTimestamp + 3601]) // time travel
      //   await network.provider.send('evm_mine') // mine a block to trigger the timestamp update

      //   await expect(tx)...

      // Success results included before each failure testing something after it.

      it("allows minting 1 or 2 NFTs.", async function () {
      })

    describe('Failure', async () => {
      let wMintAmount, cost, tx
      const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

      // Same test as below but using different code...
      it("does not allow whitelist minting before the specified time", async function () {
        cost = await nft.cost()
        const block = await ethers.provider.getBlock('latest')
        const currentTimestamp = block.timestamp

        await network.provider.send('evm_setNextBlockTimestamp', [currentTimestamp + 3599]) // time travel
        await network.provider.send('evm_mine') // mine a block to trigger the timestamp update

        const errorMessage = "Whitelist Mint not open yet."
        // expect the transaction to be reverted with the correct error message
        await(expect(tx).to.be.reverted, errorMessage)
        console.log(errorMessage)

      })

      // This code works but I'm not sure it's testing the right thing??
      it("does not allow whitelist minting before the specified time", async function () {

        // try to mint a whitelisted NFT before the minting period is open...
        // Does this code know when the minting period is and isn't open???
        wMintAmount = 1
        cost = await nft.cost()
        tx = nft.whitelistMint(wMintAmount, {from: minter, value: cost})

        const errorMessage = "Whitelist Mint not open yet."
        // expect the transaction to be reverted with the correct error message
        await(expect(tx).to.be.reverted, errorMessage)
        console.log(errorMessage)
      })
    })


      it("reverts when wMintAmount is > 2.", async function () {
        // time issue!!!
        cost = await nft.cost()
        const block = await ethers.provider.getBlock('latest')
        const currentTimestamp = block.timestamp

        await network.provider.send('evm_setNextBlockTimestamp', [currentTimestamp + 3601]) // time travel
        await network.provider.send('evm_mine') // mine a block to trigger the timestamp update

        isWhitelisted = await nft.isWhitelisted(minter.address)

        const _wMintAmount = 3
        tx = nft.whitelistMint(_wMintAmount, {from: minter, value: cost})

        const errorMessage = "Please enter 1 or 2."
        // expect the transaction to be reverted with the correct error message
        await(expect(tx).to.be.reverted, errorMessage)
        console.log(errorMessage)
      })

      // it("reverts when cost != wMintAmount x cost.", async function () { //is this wording right? E.g. 0.2 eth != 3 x 0.1
      //   // So cost = cost atm. wMintAmount can only be 1 or 2 so I'll use those but I'll use a different...
      //   // ... number for the cost value.

      //   wMintAmount = 1
      //   cost = await nft.cost()
      //   const invalidValue = cost * 5

      //   await(expect(nft.whitelistMint(wMintAmount, {from: minter, value: invalidValue}))).to.be.revertedWith("Invalid value")


      // })

      // it("reverts when maxSupply is exceeded.", async function () { // e.g. when maxSupply is 1 and they mint 2.
      //   // set the maxSupply as 1 and try to mint 2.

      //   const MAX_SUPPLY = 1
      //   const _wMintAmount = 2
      //   cost = await nft.cost()

      //   nft.whitelistMint(_wMintAmount, {from: minter, value: cost})

      //   await expect(nft.whitelistMint(_wMintAmount, {from: minter, value: cost})).to.be.revertedWith("Exceeds MAX_SUPPLY")

      // })

      it("reverts when whitelister tries to mint twice.", async function () {

      })
    })
  })

//   describe('Public Minting', () => {
//   let transaction, result

//     describe('Success', async () => {

//       let WL_START_TIME = Date.now().toString().slice(0, 10) // Now

//       beforeEach(async () => {
//         const Gestures = await ethers.getContractFactory('Gestures')
//         nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

//         let timestamp = await nft.connect(minter).publicMint()

//         transaction = await nft.connect(minter).publicMint(1, { value: COST })
//         result = await transaction.wait()

//       })

//       it("NO SUCCESS CASES???", async function () {

//       })
//     })

//     describe('Failure', async () => {

//       it("reverts before startMinting + 28800", async function () {
//         // set startMinting to 1 hour in the future
//         const startMinting = Math.floor(Date.now() / 1000) + 3600;
//         await nft.setStartMinting(startMinting);
//         await expect(nft.connect(minter).publicMint(1, { value: COST }))
//           .to.be.revertedWith("revert");
//       })

//       it("reverts with invalid mint amount", async function () {
//       await expect(nft.connect(minter).publicMint(3, { value: COST }))
//         .to.be.revertedWith("Invalid mint amount");
//       })

//       it("reverts with invalid ether amount", async function () {
//         await expect(nft.connect(minter).publicMint(1, { value: 0 }))
//           .to.be.revertedWith("Invalid Ether amount");
//       })

//       it("reverts after max supply is reached", async function () {
//         // mint maxSupply - 1 tokens
//         await nft.connect(minter).publicMint(1, { value: COST });
//         await nft.connect(minter).publicMint(1, { value: COST });
//         // the next mint should fail because max supply is reached
//         await expect(nft.connect(minter).publicMint(1, { value: COST }))
//           .to.be.revertedWith("SafeMath: addition overflow");
//       })
//     })
//   })

//   describe('Token URI', () => {
//   let transaction, result

//     describe('Failure', async () => {

//       const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

//       beforeEach(async () => {
//         const Gestures = await ethers.getContractFactory('Gestures')
//         nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

//         let timestamp = await nft.connect(minter).publicMint()

//         transaction = await nft.connect(minter).publicMint(1, { value: COST })
//         result = await transaction.wait()

//       })

//       it("reverts before startMinting + 28800", async function () {
//         // set startMinting to 1 hour in the future
//         const startMinting = Math.floor(Date.now() / 1000) + 3600;
//         await nft.setStartMinting(startMinting);
//         await expect(nft.connect(minter).publicMint(1, { value: COST }))
//           .to.be.revertedWith("revert");
//       })
//     })
//   })

//   describe('Wallet of Owner', () => {
//   let transaction, result

//     describe('Success', async () => {

//       const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

//       beforeEach(async () => {
//         const Gestures = await ethers.getContractFactory('Gestures')
//         nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

//         let timestamp = await nft.connect(minter).publicMint()

//         transaction = await nft.connect(minter).publicMint(1, { value: COST })
//         result = await transaction.wait()

//       })

//       it("NO SUCCESS CASES???", async function () {

//       })
//     })
//   })

  describe('Returnable Function', () => {
  let transaction, result, cost

    describe('Success', async () => {

      const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

      beforeEach(async () => {
        const Gestures = await ethers.getContractFactory('Gestures')
        nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

        cost = await nft.cost() // is this supposed to be 'COST'??
        const block = await ethers.provider.getBlock('latest')
        const currentTimestamp = block.timestamp

        await network.provider.send('evm_setNextBlockTimestamp', [currentTimestamp + 61]) // time travel
        await network.provider.send('evm_mine') // mine a block to trigger the timestamp update
        transaction = await nft.connect(minter).publicMint(1, { value: COST })
        await transaction.wait()
        console.log(transaction)
      })

      it("checks who owns token 1", async function () {
      //   const returnable = await nft.connect(minter).returnable(minter.address, 1)
      //   expect(returnable).to.equal(true)
        const NftOwner = await nft.ownerOf(1)
        if (NftOwner === minter.address) {
        console.log(`The minter's address is: ${NftOwner}\n`)
        } else {
          console.log("Wrong owner!")
        }
      })

      it("transfers the NFT back to the contract owner.", async function () {
        const returnNft = await nft.connect(minter).transferFrom(minter.address, nft.address, 1)
        await returnNft.wait()
        console.log(returnNft)
      })
    })
  })
//     describe('Failure', async () => {

//       const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

//       beforeEach(async () => {
//         const Gestures = await ethers.getContractFactory('Gestures')
//         nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

//         let timestamp = await nft.connect(minter).publicMint()

//         transaction = await nft.connect(minter).publicMint(1, { value: COST })
//         result = await transaction.wait()

//       })
//     })
//   })

//   describe('Withdraw Funds from Contract', () => {
//   let transaction, result

//     describe('Success', async () => {

//       const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

//       beforeEach(async () => {
//         const Gestures = await ethers.getContractFactory('Gestures')
//         nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

//         let timestamp = await nft.connect(minter).publicMint()

//         transaction = await nft.connect(minter).publicMint(1, { value: COST })
//         result = await transaction.wait()

//       })

//       it("", async function () {

//       })
//     })

//     describe('Failure', async () => {

//       const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

//       beforeEach(async () => {
//         const Gestures = await ethers.getContractFactory('Gestures')
//         nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

//         let timestamp = await nft.connect(minter).publicMint()

//         transaction = await nft.connect(minter).publicMint(1, { value: COST })
//         result = await transaction.wait()

//       })
//     })
//   })

//   describe('Setting Mint Cost', () => {
//   let transaction, result

//     describe('Success', async () => {

//       const WL_START_TIME = Date.now().toString().slice(0, 10) // Now

//       beforeEach(async () => {
//         const Gestures = await ethers.getContractFactory('Gestures')
//         nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, WL_START_TIME, BASE_URI)

//         let timestamp = await nft.connect(minter).publicMint()

//         transaction = await nft.connect(minter).publicMint(1, { value: COST })
//         result = await transaction.wait()

//       })

//       it("", async function () {

//       })
//     })
//   })
})
