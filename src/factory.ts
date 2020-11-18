/**
 * factory.ts
 * Generate a factory graph using a recursive algorithm.
 * lgfrbcsgo & Nikolaus - October 2020
 */

import { Craftable, isOre, Item, CATALYSTS, isCatalyst } from "./items"
import { findRecipe } from "./recipes"
import {
    ContainerNode,
    FactoryGraph,
    PerMinute,
    TransferNode,
    isIndustryNode,
    TransferContainerNode,
    isTransferContainerNode,
    MAX_CONTAINER_LINKS,
    MAX_INDUSTRY_LINKS,
    OutputNode,
    isContainerNode,
    isTransferNode,
} from "./graph"
import { equals } from "ramda"

/**
 * Add to the factory graph all nodes required to increase production of an item by a given rate.
 * Recursively call this function to produce all ingredients.
 * @param item Item to produce
 * @param rate Rate of increased production
 * @param factory the FactoryGraph
 */
function produce(item: Item, rate: PerMinute, factory: FactoryGraph): ContainerNode[] {
    /* Get containers already storing this item */
    const containers = factory.getContainers(item)

    /* Return a container(s) for ores, or create a new one(s) */
    if (isOre(item)) {
        for (const container of containers) {
            if (container.canAddOutgoingLinks(1)) {
                return [container]
            }
        }
        return [factory.createContainer(item)]
    }

    /* Return a new temporary container for each catalyst */
    if (isCatalyst(item)) {
        return [factory.createTemporaryContainer(item)]
    }

    /* Increase egress of existing container if possible */
    for (const container of containers) {
        if (container.egress + rate < container.ingress && container.canAddOutgoingLinks(1)) {
            return [container]
        }
    }

    /* Create producers to existing container if possible */
    const recipe = findRecipe(item)
    let outputs: ContainerNode[] = []
    let additionalIndustries = 0
    let catalystTransferUnit: TransferNode | undefined
    for (const container of containers) {
        additionalIndustries = Math.ceil(
            (rate + container.egress - container.ingress) / (recipe.product.quantity / recipe.time),
        )

        // Get the catalyst transfer unit consuming from this container, if any
        for (const consumer of container.consumers) {
            if (isTransferNode(consumer) && isCatalyst(consumer.item)) {
                catalystTransferUnit = consumer
            }
        }

        // Check that we can add incoming and outgoing link to this container,
        // and that we can add outgoing links to the catalyst transfer unit output
        // if any
        if (
            container.canAddIncomingLinks(additionalIndustries) &&
            container.canAddOutgoingLinks(1) &&
            (catalystTransferUnit === undefined ||
                catalystTransferUnit.output?.canAddOutgoingLinks(additionalIndustries) === true)
        ) {
            outputs.push(container)
            break
        }
        catalystTransferUnit = undefined
    }

    /* Create a new output container(s) if necessary */
    if (outputs.length === 0) {
        // The maximum number of required industries
        additionalIndustries = Math.ceil(rate / (recipe.product.quantity / recipe.time))

        // Add split containers if maxAdditionalIndustries exceeds limit
        if (additionalIndustries > MAX_CONTAINER_LINKS) {
            const numContainers = Math.ceil(additionalIndustries / MAX_CONTAINER_LINKS)
            const evenLinks = Math.ceil(additionalIndustries / numContainers)
            let linksRemaining = additionalIndustries
            for (let i = 0; i < numContainers; i++) {
                const numLinks = Math.min(evenLinks, linksRemaining)
                const split = numLinks / additionalIndustries
                outputs.push(factory.createSplitContainer(item, split))
                linksRemaining += -numLinks
            }
        } else {
            outputs.push(factory.createContainer(item))
        }
    }

    for (let i = 0; i < additionalIndustries; i++) {
        const industry = factory.createIndustry(item)
        industry.outputTo(outputs[i % outputs.length])
        // link catalyst byproduct
        if (catalystTransferUnit?.output !== undefined) {
            industry.takeFrom(catalystTransferUnit.output)
        }
        /* Build dependencies recursively */
        for (const ingredient of recipe.ingredients) {
            const inputs = produce(ingredient.item, ingredient.quantity / recipe.time, factory)
            for (const input of inputs) {
                industry.takeFrom(input)
            }
        }
    }
    return outputs
}

/**
 * Add transfer units to remove byproducts from industry outputs
 * @param factory the FactoryGraph
 */
function handleByproducts(factory: FactoryGraph) {
    /* Loop over all factory containers */
    for (const container of factory.containers) {
        /* Ore containers have no byproducts, */
        if (isOre(container.item)) {
            continue
        }
        const recipe = findRecipe(container.item)
        for (const byproduct of recipe.byproducts) {
            // Skip catalysts
            if (isCatalyst(byproduct.item)) {
                continue
            }
            /* Check if byproduct is already being consumed */
            let isConsumed = false
            for (const consumer of container.consumers) {
                if (consumer.item === byproduct.item) {
                    isConsumed = true
                }
            }
            if (isConsumed) {
                continue
            }
            /* Check if there is already a transfer unit for this item */
            let transfer: TransferNode | undefined
            const itemTransfers = factory.getTransferUnits(byproduct.item)
            for (const itemTransfer of itemTransfers) {
                if (itemTransfer.canAddIncomingLinks(1)) {
                    transfer = itemTransfer
                }
            }
            /* Create a new transfer unit if necessary */
            if (transfer === undefined) {
                transfer = factory.createTransferUnit(byproduct.item)
                /* Find an output container that has space for an incoming link */
                let output: ContainerNode | undefined
                const itemContainers = factory.getContainers(byproduct.item)
                for (const itemContainer of itemContainers) {
                    if (itemContainer.canAddIncomingLinks(1)) {
                        output = itemContainer
                    }
                }
                /* Create a new container if necessary */
                if (output === undefined) {
                    output = factory.createContainer(byproduct.item)
                }
                transfer.outputTo(output)
            }
            transfer.takeFrom(container)
        }
    }
}

/**
 * Handle the production and transfer of catalysts
 * @param factory the FactoryGraph
 * */
function handleCatalysts(factory: FactoryGraph): void {
    // Loop over catalyst types
    for (const catalyst of CATALYSTS) {
        // Get all temporary catalyst containers
        const catalystContainers = Array.from(factory.temporaryContainers).filter(
            (node) => node.item === catalyst,
        )

        // Create a map of containers holding a catalyst byproduct, and
        // all temproary catalyst containers from which that catalyst byproduct originated
        const catalystFlow: Map<ContainerNode, ContainerNode[]> = new Map()
        for (const container of catalystContainers) {
            const consumers = Array.from(container.consumers)
            if (consumers.length !== 1) {
                console.log(container)
                throw new Error("Catalyst container does not have one consumer?")
            }
            if (consumers[0].output === undefined) {
                console.log(consumers[0])
                throw new Error("Catalyst consumer has no output?")
            }
            if (isTransferContainerNode(consumers[0].output)) {
                console.log(consumers[0])
                throw new Error("Catalyst consumer output is a transfer container node?")
            }
            if (catalystFlow.has(consumers[0].output)) {
                catalystFlow.set(
                    consumers[0].output,
                    catalystFlow.get(consumers[0].output)!.concat([container]),
                )
            } else {
                catalystFlow.set(consumers[0].output, [container])
            }
        }

        // Loop over containers holding byproduct and try to add an existing
        // transfer unit. Otherwise, create a new transfer unit
        for (const [endingContainer, startingContainers] of catalystFlow) {
            let transferUnit: TransferNode | undefined

            // check if there is already a transfer unit for this container
            // and the transfer unit output can handle more consumers
            let hasTransferUnit = false
            for (const consumer of endingContainer.consumers) {
                if (isTransferNode(consumer) && consumer.item === catalyst) {
                    hasTransferUnit = true
                    if (consumer.output === undefined) {
                        console.log(consumer)
                        throw new Error("Transfer unit has no output?")
                    }
                    if (isTransferContainerNode(consumer.output)) {
                        console.log(consumer)
                        throw new Error("Transfer unit output is transfer container node?")
                    }

                    // we may already have some links from transferContainer.output to
                    // startingContainer.consumer. Count existing links
                    let existingLinks = 0
                    for (const startingContainer of startingContainers) {
                        const startingConsumers = Array.from(startingContainer.consumers)
                        if (startingConsumers.length !== 1) {
                            console.log(startingContainer)
                            throw new Error(
                                "Temporary catalyst container does not have one consumer?",
                            )
                        }
                        if (startingConsumers[0].inputs.has(consumer.output)) {
                            existingLinks += 1
                        }
                    }

                    if (
                        consumer.output.canAddOutgoingLinks(
                            startingContainers.length - existingLinks,
                        )
                    ) {
                        transferUnit = consumer
                        break
                    }
                }
            }

            // sanity check: prevent having two transfer units drawing from the same container
            if (transferUnit === undefined && hasTransferUnit) {
                console.log("Starting Containers")
                console.log(startingContainers)
                console.log("Ending Container")
                console.log(endingContainer)
                throw new Error("Container already has a transfer unit?")
            }

            // look for existing transfer units
            if (transferUnit === undefined) {
                // Get transfer nodes already moving this catalyst
                const transferUnits = factory.getTransferUnits(catalyst)

                // Check for existing transfer unit
                for (const checkTransferUnit of transferUnits) {
                    if (checkTransferUnit.output === undefined) {
                        console.log(checkTransferUnit)
                        throw new Error("Transfer unit has no output?")
                    }
                    if (
                        checkTransferUnit.canAddIncomingLinks(1) &&
                        checkTransferUnit.output.canAddOutgoingLinks(startingContainers.length)
                    ) {
                        transferUnit = checkTransferUnit
                        break
                    }
                }
            }

            // Create new transfer unit if necessary
            if (transferUnit === undefined) {
                transferUnit = factory.createTransferUnit(catalyst)
                const container = factory.createContainer(catalyst)
                transferUnit.outputTo(container)
            }

            // Remove temporary containers, link transfer unit output back to industries
            for (const container of startingContainers) {
                const consumers = Array.from(container.consumers)
                if (consumers.length !== 1) {
                    console.log(container)
                    throw new Error("Catalyst container does not have one consumer?")
                }
                consumers[0].inputs.delete(container)
                factory.temporaryContainers.delete(container)
                if (transferUnit.output === undefined) {
                    console.log(transferUnit)
                    throw new Error("Transfer unit has no output?")
                }
                if (isTransferContainerNode(transferUnit.output)) {
                    console.log(transferUnit)
                    throw new Error("Transfer unit output is a transfer container node?")
                }
                consumers[0].takeFrom(transferUnit.output)
            }

            // Link industry output to transfer unit
            transferUnit.takeFrom(endingContainer)
        }

        // Get all catalyst containers that don't already have a producing industry
        const containers = Array.from(factory.getContainers(catalyst)).filter(
            (node) => !Array.from(node.producers).some(isIndustryNode),
        )

        const recipe = findRecipe(catalyst)
        for (const container of containers) {
            // Add one industry to produce catalyst for this container
            const industry = factory.createIndustry(catalyst)
            industry.outputTo(container)
            // Build ingredients
            for (const ingredient of recipe.ingredients) {
                const inputs = produce(ingredient.item, ingredient.quantity / recipe.time, factory)
                for (const input of inputs) {
                    industry.takeFrom(input)
                }
            }
        }
    }
}

/**
 * Add transfer units and containers to handle industries that require
 * >7 incoming links
 * @param factory the FactoryGraph
 */
function handleIndustryLinks(factory: FactoryGraph): void {
    // Loop over all factory industries
    for (const industry of factory.industries) {
        // Get ingredients and ingredient quantities
        const recipe = findRecipe(industry.item)
        // Sort ingredients by quantity
        const recipeIngredients = recipe.ingredients
        recipeIngredients.sort((a, b) => a.quantity - b.quantity)
        const ingredients = recipeIngredients.map((ingredient) => ingredient.item)

        // Get exceeding link count
        const exceedingLinks = industry.incomingLinkCount - MAX_INDUSTRY_LINKS
        if (exceedingLinks > 0) {
            let transferContainer: TransferContainerNode | undefined

            // Check if this industry is already fed by a transfer container
            const industryTransferContainers = Array.from(industry.inputs).filter(
                isTransferContainerNode,
            )
            for (const checkTransferContainer of industryTransferContainers) {
                // Get the links to this industry that can be moved to this transfer container
                const movingLinks = Array.from(industry.inputs)
                    .filter(isContainerNode)
                    .filter((node) => checkTransferContainer.items.includes(node.item))

                // Check that all transfer container items are links
                if (movingLinks.length !== checkTransferContainer.items.length) {
                    continue
                }

                // Check that all transfer container input transfer units can have one incoming link
                if (
                    Array.from(checkTransferContainer.producers).some(
                        (node) => !node.canAddIncomingLinks(1),
                    )
                ) {
                    continue
                }

                // good
                transferContainer = checkTransferContainer
                break
            }

            if (transferContainer === undefined) {
                // Check if there exists another transfer container from which we can feed
                const transferContainers = factory.getTransferContainers(new Set(ingredients))
                for (const checkTransferContainer of transferContainers) {
                    // Check if thi stransfer container has at least exceedingLinks+1 items
                    // +1 because we need to remove one link to make space for this transfer container
                    if (checkTransferContainer.items.length < exceedingLinks + 1) {
                        continue
                    }

                    // Check if we can add an outgoing link from this transfer continaer
                    if (!checkTransferContainer.canAddOutgoingLinks(1)) {
                        continue
                    }

                    // Check that all transfer container input transfer units can have one incoming link
                    if (
                        Array.from(checkTransferContainer.producers).some(
                            (node) => !node.canAddIncomingLinks(1),
                        )
                    ) {
                        continue
                    }

                    // Check that all transfer container input transfer units can have one incoming link
                    if (
                        Array.from(checkTransferContainer.producers).some(
                            (node) => !node.canAddIncomingLinks(1),
                        )
                    ) {
                        continue
                    }

                    // good
                    transferContainer = checkTransferContainer
                    break
                }
            }

            // Create a new TransferContainerNode if necessary
            if (transferContainer === undefined) {
                // Use first exceedingLinks+1 items in ingredients (sorted by quantity)
                // +1 because we need to remove one link to make space for TransferContainerNode
                const items = ingredients.slice(0, exceedingLinks + 1)
                transferContainer = factory.createTransferContainer(items)

                // Add transfer units
                for (const item of items) {
                    const transferUnit = factory.createTransferUnit(item)
                    transferUnit.outputTo(transferContainer)
                }
            }

            // Remove existing container->industry links, and replace with
            // container->transfer unit links
            for (const transferUnit of transferContainer.producers) {
                let check = false
                for (const container of industry.inputs) {
                    if (isTransferContainerNode(container)) {
                        continue
                    }
                    if (container.item === transferUnit.item) {
                        const rate = container.egressTo(industry)
                        container.consumers.delete(industry)
                        industry.inputs.delete(container)
                        transferUnit.takeFrom(container, rate)
                        check = true
                        break
                    }
                }
                if (!check) {
                    console.log(industry)
                    console.log(transferUnit)
                    throw new Error("Unable to transfer item")
                }
            }

            // Link transfer container to industry
            industry.takeFrom(transferContainer)
        }
    }
}

/**
 * Sanity check the factory. Check for 1) exceeding container limits,
 * 2) egress > ingress, 3) or split containers having more than one consumer,
 * 4) no temporary containers remain
 * @param factory the FactoryGraph
 */
function sanityCheck(factory: FactoryGraph): void {
    // Check containers
    for (const container of factory.containers) {
        if (container.incomingLinkCount > MAX_CONTAINER_LINKS) {
            console.log(container)
            throw new Error("Container exceeds incoming link limit")
        }
        if (container.outgoingLinkCount > MAX_CONTAINER_LINKS) {
            console.log(container)
            throw new Error("Container exceeds outgoing link limit")
        }
        // delta to avoid rounding errors
        const delta = 1.0e-8
        if (container.egress > container.ingress + delta) {
            console.log(container)
            throw new Error("Container egress exceeds ingress")
        }
        if (container.isSplit) {
            // get the number of non-transfer unit outgoing links
            let numOutgoing = 0
            for (const consumer of container.consumers) {
                if (!isTransferNode(consumer)) {
                    numOutgoing += 1
                }
            }
            if (numOutgoing > 1) {
                console.log(container)
                throw new Error("Split container has more than one non-transfer unit outgoing link")
            }
        }
    }
    // Check industries
    for (const industry of factory.industries) {
        if (industry.incomingLinkCount > MAX_INDUSTRY_LINKS) {
            console.log(industry)
            throw new Error("Industry exceeds incoming link limit")
        }
    }
    // Check temporary containers
    if (factory.temporaryContainers.size > 0) {
        console.log(factory)
        throw new Error("Factory still contains temporary containers")
    }
}

/**
 * Generate a new factory graph that supplies a given number of assemblers
 * for a given set of products
 * @param requirements Products and number of assemblers
 */
export function buildFactory(
    requirements: Map<Craftable, { count: number; maintain: number }>,
    factory?: FactoryGraph,
): FactoryGraph {
    if (factory === undefined) {
        factory = new FactoryGraph()
    }
    for (const [item, { count, maintain }] of requirements) {
        const recipe = findRecipe(item)
        const rate = recipe.product.quantity / recipe.time

        // number of required output containers
        const numOutputs = Math.ceil(count / MAX_CONTAINER_LINKS)

        // check if there is already an output node for this item that we can use
        const outputs: OutputNode[] = []
        const availableOutputs = factory.getOutputNodes(item)
        let catalystTransferUnit: TransferNode | undefined
        for (const checkOutput of availableOutputs) {
            // if this container has a catalyst byproduct transfer unit, then
            // we need to ensure that we can out output link(s) to the transfer unit output
            for (const consumer of checkOutput.consumers) {
                if (isTransferNode(consumer) && isCatalyst(consumer.item)) {
                    catalystTransferUnit = consumer
                }
            }

            if (
                checkOutput.canAddIncomingLinks(count) &&
                (catalystTransferUnit === undefined ||
                    catalystTransferUnit.output?.canAddOutgoingLinks(count) === true)
            ) {
                checkOutput.outputRate += rate * count
                checkOutput.maintainedOutput += maintain
                outputs.push(checkOutput)
                break
            }
            catalystTransferUnit = undefined
        }

        if (outputs.length === 0) {
            // check if there is a container node that we could use
            const containers = factory.getContainers(item)
            for (const container of containers) {
                // catalyst transfer unit check again
                for (const consumer of container.consumers) {
                    if (isTransferNode(consumer) && isCatalyst(consumer.item)) {
                        catalystTransferUnit = consumer
                    }
                }

                if (
                    container.canAddIncomingLinks(count) &&
                    (catalystTransferUnit === undefined ||
                        (catalystTransferUnit.output !== undefined &&
                            catalystTransferUnit.output.canAddOutgoingLinks(count)))
                ) {
                    // convert container to output node
                    const output = factory.createOutput(item, rate * count, maintain, container.id)
                    for (const producer of container.producers) {
                        producer.outputTo(output)
                    }
                    for (const consumer of container.consumers) {
                        consumer.inputs.delete(container)
                        consumer.takeFrom(output)
                    }
                    factory.containers.delete(container)
                    outputs.push(output)
                    break
                }
                catalystTransferUnit = undefined
            }
        }

        if (outputs.length === 0) {
            // track satisfied industries
            let numSatisfied = count

            // add a new output node(s)
            for (let i = 0; i < numOutputs; i++) {
                const numInput = Math.min(MAX_CONTAINER_LINKS, numSatisfied)
                const split = numInput / count
                numSatisfied -= numInput
                const output = factory.createSplitOutput(
                    item,
                    rate * numInput,
                    Math.ceil(maintain * split),
                    split,
                )
                outputs.push(output)
            }
        }

        for (let i = 0; i < count; i++) {
            // Add industry, output to OutputNode
            const industry = factory.createIndustry(item)
            for (const output of outputs) {
                if (output.canAddIncomingLinks(1)) {
                    industry.outputTo(output)
                    break
                }
            }
            // link transfer unit output to industry, if any
            if (catalystTransferUnit?.output !== undefined) {
                industry.takeFrom(catalystTransferUnit.output)
            }
            // Build ingredients
            for (const ingredient of recipe.ingredients) {
                const inputs = produce(ingredient.item, ingredient.quantity / recipe.time, factory)
                for (const input of inputs) {
                    industry.takeFrom(input)
                }
            }
        }
    }
    // Handle catalyst production
    handleCatalysts(factory)
    // Add transfer units to relocate byproducts
    handleByproducts(factory)
    // Add transfer units and containers to handle industry link limit
    handleIndustryLinks(factory)
    // Sanity check for errors in factory
    sanityCheck(factory)
    // update container changed state if maintain or size changed
    for (const container of factory.containers) {
        if (
            container.originalMaintain !== undefined &&
            container.originalMaintain !== container.maintain
        ) {
            container.changed = true
        }
        if (
            container.originalContainers !== undefined &&
            !equals([...container.originalContainers], [...container.containers])
        ) {
            container.changed = true
        }
    }
    return factory
}
