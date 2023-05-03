const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Gestures', () => {
  const NAME = 'Gestures'
  const SYMBOL = 'G'
  const COST = ether(0.1)
  const MAX_SUPPLY = 100
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
    const START_MINTING = (Date.now() + 120000).toString().slice(0, 10) // 2 minutes from now

    beforeEach(async () => {
      const Gestures = await ethers.getContractFactory('Gestures')
      nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, START_MINTING, BASE_URI)
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

    // it('returns the start minting time', async () => {
    //   expect(await nft.startMinting()).to.equal(START_MINTING.toString())
    // })

    it('returns the base URI', async () => {
      expect(await nft.baseURI()).to.equal(BASE_URI)
    })

    it('returns the owner', async () => {
      expect(await nft.owner()).to.equal(deployer.address)
    })
  })

  describe('Public Minting', () => {
  let transaction, result

    describe('Success', async () => {

      const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10) // Now

      beforeEach(async () => {
        const Gestures = await ethers.getContractFactory('Gestures')
        nft = await Gestures.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

        let timestamp = await nft.connect(minter).publicMint()

        transaction = await nft.connect(minter).publicMint(1, { value: COST })
        result = await transaction.wait()

      })

      it('returns the address of the minter', async () => {
        expect(await nft.ownerOf(1)).to.equal(minter.address)
      })

      // it('returns total number of tokens the minter owns', async () => {
      //   expect(await nft.balanceOf(minter.address)).to.equal(1)
      // })

      // it('returns IPFS URI', async () => {
      //   // EG: 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/1.json'
      //   // Uncomment this line to see example
      //   // console.log(await nft.tokenURI(1))
      //   expect(await nft.tokenURI(1)).to.equal(`${BASE_URI}1.json`)
      // })

      // it('updates the total supply', async () => {
      //   expect(await nft.totalSupply()).to.equal(1)
      // })

      // it('updates the contract ether balance', async () => {
      //   expect(await ethers.provider.getBalance(nft.address)).to.equal(COST)
      // })

      // it('emits Mint event', async () => {
      //   await expect(transaction).to.emit(nft, 'Mint')
      //     .withArgs(1, minter.address)
      // })
    })
  })
})
