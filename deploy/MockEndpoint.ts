import * as assert from 'assert'
import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'EndpointV2Mock'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // For local networks, deploy a mock endpoint for testing
    // Use different endpoint IDs for different local networks
    let eid: number
    switch (hre.network.name) {
        case 'hardhat-local-1':
            eid = 1
            break
        case 'hardhat-local-2':
            eid = 2
            break
        default:
            // Skip mock endpoint deployment for non-local networks
            console.log(`Skipping mock endpoint deployment for network: ${hre.network.name}`)
            return
    }

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [eid], // Mock endpoint takes an endpoint ID
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed mock endpoint: ${contractName}, network: ${hre.network.name}, eid: ${eid}, address: ${address}`)

    // Also deploy it as EndpointV2 so MyOApp deployment can find it
    await deploy('EndpointV2', {
        from: deployer,
        args: [eid],
        log: true,
        skipIfAlreadyDeployed: false,
        contract: contractName, // Use the EndpointV2Mock contract
    })
}

deploy.tags = ['MockEndpoint', 'EndpointV2Mock']
deploy.dependencies = [] // This should be deployed first

export default deploy