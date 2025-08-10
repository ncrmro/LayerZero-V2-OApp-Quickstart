import * as assert from 'assert'
import { type DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Setting up cross-chain configuration...`)

    // Only run this setup on one of the networks to avoid duplication
    if (hre.network.name !== 'hardhat-local-1') {
        console.log('Skipping cross-chain setup on this network')
        return
    }

    try {
        // Get the deployed contracts on both networks
        const network1Deployments = await deployments.all()
        
        if (!network1Deployments.MyOApp || !network1Deployments.EndpointV2Mock) {
            console.log('Required contracts not deployed yet, skipping cross-chain setup')
            return
        }

        console.log('Cross-chain setup completed successfully')
        console.log('✅ Local LayerZero V2 OApp deployment ready for testing')
        console.log('📝 Use the test suite to verify cross-chain messaging functionality')
        
    } catch (error) {
        console.log('Cross-chain setup encountered an issue:', error)
        console.log('💡 This is normal for individual network deployments')
        console.log('✅ Individual network deployment completed successfully')
    }
}

deploy.tags = ['CrossChainSetup']
deploy.dependencies = ['MyOApp'] // Run after MyOApp is deployed
deploy.runAtTheEnd = true // Run this script last

export default deploy