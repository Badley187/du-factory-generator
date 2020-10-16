/**
 * items.ts
 * All available items and their properties
 * lgfrbcsgo & Nikolaus - October 2020
 */

export type Liter = number
export type Minutes = number
export type Quantity = number

export type Element = ContainerElement | OtherElement
export type Item = Ore | Catalyst | Product | Element

export type Craftable = Exclude<Item, Ore>

export enum ItemType {
    ORE = "ore",
    CATALYST = "catalyst",
    PRODUCT = "product",
    ELEMENT = "element",
}

export enum Tier {
    BASIC = "basic",
    UNCOMMON = "uncommon",
    ADVANCED = "advanced",
    RARE = "rare",
    EXOTIC = "exotic",
    ELEMENT = "element",
}

export enum Category {
    AIRFOIL = "airfoil",
    ANTI_GRAVITY = "anti-gravity",
    CATALYST = "catalyst",
    COMPLEX_PARTS = "complex parts",
    CONTROL = "control",
    CORE_UNIT = "core unit",
    ENGINES = "engines",
    EXCEPTIONAL_PARTS = "exceptional parts",
    FLIGHT_CONTROL = "flight control",
    FUEL = "fuel",
    FUEL_TANKS = "fuel tanks",
    FUNCTIONAL_PARTS = "functional parts",
    INDUSTRY = "industry",
    INSTRUMENTS = "instruments",
    INTERACTIVE = "interactive",
    INTERMEDIARY_PARTS = "intermediary parts",
    ITEM_CONTAINERS = "item containers",
    ORE = "ore",
    PRODUCT = "product",
    PURE = "pure",
    SENSOR = "sensor",
    STRUCTURAL_PARTS = "structural parts",
}

export enum ElementType {
    CONTAINER = "container",
    OTHER = "other",
}

/**
 * Properties commen to each item type
 */
export interface CommonProperties {
    readonly name: string
    readonly tier: Tier
    readonly category: Category
    readonly volume: Liter
}

/**
 * Item types
 */
export interface Ore extends CommonProperties {
    readonly type: ItemType.ORE
}

export interface Catalyst extends CommonProperties {
    readonly type: ItemType.CATALYST
}

export interface Product extends CommonProperties {
    readonly type: ItemType.PRODUCT
}

export interface ContainerElement extends CommonProperties {
    readonly type: ItemType.ELEMENT
    readonly elementType: ElementType.CONTAINER
    readonly capacity: Liter
}

export interface OtherElement extends CommonProperties {
    readonly type: ItemType.ELEMENT
    readonly elementType: ElementType.OTHER
}

/**
 * Ore type guard
 * @param item Item to check
 */
export function isOre(item: Item): item is Ore {
    return item.type === ItemType.ORE
}

/**
 * Craftable type guard
 * @param item Item to check
 */
export function isCraftable(item: Item): item is Craftable {
    return !isOre(item)
}

/**
 * ContainerElement type guard
 * @param item Item to check
 */
export function isContainerElement(item: Item): item is ContainerElement {
    return item.type === ItemType.ELEMENT && item.elementType === ElementType.CONTAINER
}

/**
 * Returns a new Ore type
 * @param name Ore name
 * @param tier Ore tier
 */
export function ore(name: string, tier: Tier): Ore {
    return {
        type: ItemType.ORE,
        name,
        tier,
        category: Category.ORE,
        volume: 1,
    }
}

/**
 * Returns a new Catalyst type
 * @param name Catalyst name
 * @param tier Catalyst tier
 * @param volume Catalyst volume
 */
export function catalyst(name: string, tier: Tier, volume: Liter): Catalyst {
    return {
        type: ItemType.CATALYST,
        name,
        tier,
        category: Category.CATALYST,
        volume,
    }
}

/**
 * Returns a new Product type
 * @param name Product name
 * @param tier Product tier
 * @param category Product category
 * @param volume Product volume
 */
export function product(name: string, tier: Tier, category: Category, volume: Liter): Product {
    return {
        type: ItemType.PRODUCT,
        name,
        tier,
        category,
        volume,
    }
}

/**
 * Returns a new OtherElement type
 * @param name Element name
 * @param category Element category
 * @param volume Element volume
 */
export function otherElement(name: string, category: Category, volume: Liter): OtherElement {
    return {
        type: ItemType.ELEMENT,
        elementType: ElementType.OTHER,
        name,
        tier: Tier.ELEMENT,
        category,
        volume,
    }
}

/**
 * Returns a new ContainerElement type
 * @param name Element name
 * @param category Element category
 * @param volume Element volume
 */
export function containerElement(
    name: string,
    category: Category,
    volume: Liter,
    capacity: Liter,
): ContainerElement {
    return {
        type: ItemType.ELEMENT,
        elementType: ElementType.CONTAINER,
        name,
        tier: Tier.ELEMENT,
        category,
        volume,
        capacity,
    }
}

/**
 * Item list (TODO: complete)
 */
export const ITEMS = {
    Hydrogen: ore("Hydrogen", Tier.BASIC),
    Oxygen: ore("Oxygen", Tier.BASIC),
    Hematite: ore("Hematite", Tier.BASIC),
    Bauxite: ore("Bauxite", Tier.BASIC),
    Quartz: ore("Quartz", Tier.BASIC),
    Coal: ore("Coal", Tier.BASIC),
    Limestone: ore("Limestone", Tier.UNCOMMON),
    Chromite: ore("Chromite", Tier.UNCOMMON),
    Malachite: ore("Malachite", Tier.UNCOMMON),
    Natron: ore("Natron", Tier.UNCOMMON),
    Petalite: ore("Petalite", Tier.ADVANCED),
    Garnierite: ore("Garnierite", Tier.ADVANCED),
    Acanthite: ore("Acanthite", Tier.ADVANCED),
    Pyrite: ore("Pyrite", Tier.ADVANCED),
    Cobaltite: ore("Cobaltite", Tier.RARE),
    Cryolite: ore("Cryolite", Tier.RARE),
    "Gold Nuggets": ore("Gold Nuggets", Tier.RARE),
    Kolbeckite: ore("Kolbeckite", Tier.RARE),
    Rhodonite: ore("Rhodonite", Tier.EXOTIC),
    Columbite: ore("Columbite", Tier.EXOTIC),
    Illmenite: ore("Illmenite", Tier.EXOTIC),
    Vanadinite: ore("Vanadinite", Tier.EXOTIC),
    Iron: product("Iron", Tier.BASIC, Category.PURE, 1),
    Aluminium: product("Aluminium", Tier.BASIC, Category.PURE, 1),
    Silicon: product("Silicon", Tier.BASIC, Category.PURE, 1),
    Carbon: product("Carbon", Tier.BASIC, Category.PURE, 1),
    Calcium: product("Calcium", Tier.UNCOMMON, Category.PURE, 1),
    Chromium: product("Chromium", Tier.UNCOMMON, Category.PURE, 1),
    Copper: product("Copper", Tier.UNCOMMON, Category.PURE, 1),
    Sodium: product("Sodium", Tier.UNCOMMON, Category.PURE, 1),
    Lithium: product("Lithium", Tier.ADVANCED, Category.PURE, 1),
    Nickel: product("Nickel", Tier.ADVANCED, Category.PURE, 1),
    Silver: product("Silver", Tier.ADVANCED, Category.PURE, 1),
    Sulfur: product("Sulfur", Tier.ADVANCED, Category.PURE, 1),
    Cobalt: product("Cobalt", Tier.RARE, Category.PURE, 1),
    Fluorine: product("Fluorine", Tier.RARE, Category.PURE, 1),
    Gold: product("Gold", Tier.RARE, Category.PURE, 1),
    Scandium: product("Scandium", Tier.RARE, Category.PURE, 1),
    Manganese: product("Manganese", Tier.EXOTIC, Category.PURE, 1),
    Niobium: product("Niobium", Tier.EXOTIC, Category.PURE, 1),
    Titanium: product("Titanium", Tier.EXOTIC, Category.PURE, 1),
    Vanadium: product("Vanadium", Tier.EXOTIC, Category.PURE, 1),
    Steel: product("Steel", Tier.BASIC, Category.PRODUCT, 1),
    Silumin: product("Silumin", Tier.BASIC, Category.PRODUCT, 1),
    "Al-Fe Alloy": product("Al-Fe Alloy", Tier.BASIC, Category.PRODUCT, 1),
    "Biologic Matter": product("Biologic Matter", Tier.BASIC, Category.PRODUCT, 1),
    Brick: product("Brick", Tier.BASIC, Category.PRODUCT, 1),
    "Carbon Fiber": product("Carbon Fiber", Tier.BASIC, Category.PRODUCT, 1),
    Glass: product("Glass", Tier.BASIC, Category.PRODUCT, 1),
    "Polycarbonate Plastic": product("Polycarbonate Plastic", Tier.BASIC, Category.PRODUCT, 1),
    Wood: product("Wood", Tier.BASIC, Category.PRODUCT, 1),
    "Advanced Glass": product("Advanced Glass", Tier.UNCOMMON, Category.PRODUCT, 1),
    "Calcium Reinforced Copper": product(
        "Calcium Reinforced Copper",
        Tier.UNCOMMON,
        Category.PRODUCT,
        1,
    ),
    Concrete: product("Concrete", Tier.UNCOMMON, Category.PRODUCT, 1),
    Duralumin: product("Duralumin", Tier.UNCOMMON, Category.PRODUCT, 1),
    Marble: product("Marble", Tier.UNCOMMON, Category.PRODUCT, 1),
    "Polycalcite Plastic": product("Polycalcite Plastic", Tier.UNCOMMON, Category.PRODUCT, 1),
    "Stainless Steel": product("Stainless Steel", Tier.UNCOMMON, Category.PRODUCT, 1),
    "Ag-Li Reinforced Glass": product("Ag-Li Reinforced Glass", Tier.ADVANCED, Category.PRODUCT, 1),
    "Al-Li Alloy": product("Al-Li Alloy", Tier.ADVANCED, Category.PRODUCT, 1),
    "Cu-Ag Alloy": product("Cu-Ag Alloy", Tier.ADVANCED, Category.PRODUCT, 1),
    Inconel: product("Inconel", Tier.ADVANCED, Category.PRODUCT, 1),
    "Polysulfide Plastic": product("Polysulfide Plastic", Tier.ADVANCED, Category.PRODUCT, 1),
    Fluoropolymer: product("Fluoropolymer", Tier.RARE, Category.PRODUCT, 1),
    "Gold Coated Glass": product("Gold Coated Glass", Tier.RARE, Category.PRODUCT, 1),
    "Maraging Steel": product("Maraging Steel", Tier.RARE, Category.PRODUCT, 1),
    "Red Gold": product("Red Gold", Tier.RARE, Category.PRODUCT, 1),
    "Sc-Al Alloy": product("Sc-Al Alloy", Tier.RARE, Category.PRODUCT, 1),
    "Grade 5 Titanium Alloy": product("Grade 5 Titanium Alloy", Tier.EXOTIC, Category.PRODUCT, 1),
    Mangalloy: product("Mangalloy", Tier.EXOTIC, Category.PRODUCT, 1),
    "Manganese Reinforced Glass": product(
        "Manganese Reinforced Glass",
        Tier.EXOTIC,
        Category.PRODUCT,
        1,
    ),
    "Ti-Nb Superconductor": product("Ti-Nb Superconductor", Tier.EXOTIC, Category.PRODUCT, 1),
    Vanamer: product("Vanamer", Tier.EXOTIC, Category.PRODUCT, 1),
    "Catalyst 3": catalyst("Catalyst 3", Tier.ADVANCED, 1),
    "Catalyst 4": catalyst("Catalyst 4", Tier.RARE, 1),
    "Catalyst 5": catalyst("Catalyst 5", Tier.EXOTIC, 1),
    "Kergon-X1 Fuel": otherElement("Kergon-X1 Fuel", Category.FUEL, 1),
    "Kergon-X2 Fuel": otherElement("Kergon-X2 Fuel", Category.FUEL, 1),
    "Kergon-X3 Fuel": otherElement("Kergon-X3 Fuel", Category.FUEL, 1),
    "Kergon-X4 Fuel": otherElement("Kergon-X4 Fuel", Category.FUEL, 1),
    "Nitron Fuel": otherElement("Nitron Fuel", Category.FUEL, 1),
    "Xeron Fuel": otherElement("Xeron Fuel", Category.FUEL, 1),
    "Warp Cell": otherElement("Warp Cell", Category.FUEL, 40),
    "Basic Anti-Matter Capsule": product(
        "Basic Anti-Matter Capsule",
        Tier.BASIC,
        Category.COMPLEX_PARTS,
        4.6,
    ),
    "Basic Burner": product("Basic Burner", Tier.BASIC, Category.COMPLEX_PARTS, 10),
    "Basic Electronics": product("Basic Electronics", Tier.BASIC, Category.COMPLEX_PARTS, 4),
    "Basic Explosive Module": product(
        "Basic Explosive Module",
        Tier.BASIC,
        Category.COMPLEX_PARTS,
        4.6,
    ),
    "Basic Hydraulics": product("Basic Hydraulics", Tier.BASIC, Category.COMPLEX_PARTS, 10),
    "Basic Injector": product("Basic Injector", Tier.BASIC, Category.COMPLEX_PARTS, 10),
    "Basic Magnet": product("Basic Magnet", Tier.BASIC, Category.COMPLEX_PARTS, 7.36),
    "Basic Optics": product("Basic Optics", Tier.BASIC, Category.COMPLEX_PARTS, 10),
    "Basic Power System": product("Basic Power System", Tier.BASIC, Category.COMPLEX_PARTS, 9.2),
    "Basic Processor": product("Basic Processor", Tier.BASIC, Category.COMPLEX_PARTS, 5),
    "Basic Quantum Core": product("Basic Quantum Core", Tier.BASIC, Category.COMPLEX_PARTS, 5),
    "Basic Singularity Container": product(
        "Basic Singularity Container",
        Tier.BASIC,
        Category.COMPLEX_PARTS,
        4,
    ),
    "Uncommon Anti-Matter Capsule": product(
        "Uncommon Anti-Matter Capsule",
        Tier.UNCOMMON,
        Category.COMPLEX_PARTS,
        4.6,
    ),
    "Uncommon Burner": product("Uncommon Burner", Tier.UNCOMMON, Category.COMPLEX_PARTS, 10),
    "Uncommon Electronics": product(
        "Uncommon Electronics",
        Tier.UNCOMMON,
        Category.COMPLEX_PARTS,
        4,
    ),
    "Uncommon Explosive Module": product(
        "Uncommon Explosive Module",
        Tier.UNCOMMON,
        Category.COMPLEX_PARTS,
        4.6,
    ),
    "Uncommon Hydraulics": product(
        "Uncommon Hydraulics",
        Tier.UNCOMMON,
        Category.COMPLEX_PARTS,
        10,
    ),
    "Uncommon Injector": product("Uncommon Injector", Tier.UNCOMMON, Category.COMPLEX_PARTS, 10),
    "Uncommon Magnet": product("Uncommon Magnet", Tier.UNCOMMON, Category.COMPLEX_PARTS, 7.36),
    "Uncommon Optics": product("Uncommon Optics", Tier.UNCOMMON, Category.COMPLEX_PARTS, 10),
    "Uncommon Power System": product(
        "Uncommon Power System",
        Tier.UNCOMMON,
        Category.COMPLEX_PARTS,
        9.2,
    ),
    "Uncommon Processor": product("Uncommon Processor", Tier.UNCOMMON, Category.COMPLEX_PARTS, 5),
    "Uncommon Quantum Core": product(
        "Uncommon Quantum Core",
        Tier.UNCOMMON,
        Category.COMPLEX_PARTS,
        5,
    ),
    "Uncommon Singularity Container": product(
        "Uncommon Singularity Container",
        Tier.UNCOMMON,
        Category.COMPLEX_PARTS,
        4,
    ),
    "Uncommon Solid Warhead": product(
        "Uncommon Solid Warhead",
        Tier.UNCOMMON,
        Category.COMPLEX_PARTS,
        5,
    ),
    "Advanced Anti-Matter Capsule": product(
        "Advanced Anti-Matter Capsule",
        Tier.ADVANCED,
        Category.COMPLEX_PARTS,
        4.6,
    ),
    "Advanced Burner": product("Advanced Burner", Tier.ADVANCED, Category.COMPLEX_PARTS, 10),
    "Advanced Electronics": product(
        "Advanced Electronics",
        Tier.ADVANCED,
        Category.COMPLEX_PARTS,
        4,
    ),
    "Advanced Explosive Module": product(
        "Advanced Explosive Module",
        Tier.ADVANCED,
        Category.COMPLEX_PARTS,
        4.6,
    ),
    "Advanced Hydraulics": product(
        "Advanced Hydraulics",
        Tier.ADVANCED,
        Category.COMPLEX_PARTS,
        10,
    ),
    "Advanced Injector": product("Advanced Injector", Tier.ADVANCED, Category.COMPLEX_PARTS, 10),
    "Advanced Magnet": product("Advanced Magnet", Tier.ADVANCED, Category.COMPLEX_PARTS, 7.36),
    "Advanced Optics": product("Advanced Optics", Tier.ADVANCED, Category.COMPLEX_PARTS, 10),
    "Advanced Power System": product(
        "Advanced Power System",
        Tier.ADVANCED,
        Category.COMPLEX_PARTS,
        9.2,
    ),
    "Advanced Processor": product("Advanced Processor", Tier.ADVANCED, Category.COMPLEX_PARTS, 5),
    "Advanced Quantum Core": product(
        "Advanced Quantum Core",
        Tier.ADVANCED,
        Category.COMPLEX_PARTS,
        5,
    ),
    "Advanced Singularity Container": product(
        "Advanced Singularity Container",
        Tier.ADVANCED,
        Category.COMPLEX_PARTS,
        4,
    ),
    "Advanced Solid Warhead": product(
        "Advanced Solid Warhead",
        Tier.ADVANCED,
        Category.COMPLEX_PARTS,
        5,
    ),
    "Rare Anti-Matter Capsule": product(
        "Rare Anti-Matter Capsule",
        Tier.RARE,
        Category.COMPLEX_PARTS,
        4.6,
    ),
    "Rare Electronics": product("Rare Electronics", Tier.RARE, Category.COMPLEX_PARTS, 4),
    "Rare Magnet": product("Rare Magnet", Tier.RARE, Category.COMPLEX_PARTS, 7.36),
    "Rare Optics": product("Rare Optics", Tier.RARE, Category.COMPLEX_PARTS, 10),
    "Rare Power System": product("Rare Power System", Tier.RARE, Category.COMPLEX_PARTS, 9.2),
    "Rare Quantum Core": product("Rare Quantum Core", Tier.RARE, Category.COMPLEX_PARTS, 5),
    "Rare Singularity Container": product(
        "Rare Singularity Container",
        Tier.RARE,
        Category.COMPLEX_PARTS,
        4,
    ),
    "Exotic Anti-Matter Capsule": product(
        "Exotic Anti-Matter Capsule",
        Tier.EXOTIC,
        Category.COMPLEX_PARTS,
        4.6,
    ),
    "Exotic Electronics": product("Exotic Electronics", Tier.EXOTIC, Category.COMPLEX_PARTS, 4),
    "Exotic Magnet": product("Exotic Magnet", Tier.EXOTIC, Category.COMPLEX_PARTS, 7.36),
    "Exotic Power System": product("Exotic Power System", Tier.EXOTIC, Category.COMPLEX_PARTS, 9.2),
    "Exotic Processor": product("Exotic Processor", Tier.EXOTIC, Category.COMPLEX_PARTS, 5),
    "Exotic Quantum Core": product("Exotic Quantum Core", Tier.EXOTIC, Category.COMPLEX_PARTS, 5),
    "Exotic Singularity Container": product(
        "Exotic Singularity Container",
        Tier.EXOTIC,
        Category.COMPLEX_PARTS,
        4,
    ),
    "Advanced Anti-Gravity Core Unit": product(
        "Advanced Anti-Gravity Core Unit",
        Tier.ADVANCED,
        Category.EXCEPTIONAL_PARTS,
        20,
    ),
    "Advanced Anti-Matter Core Unit": product(
        "Advanced Anti-Matter Core Unit",
        Tier.ADVANCED,
        Category.EXCEPTIONAL_PARTS,
        21.5,
    ),
    "Advanced Quantum Alignment Unit": product(
        "Advanced Quantum Alignment Unit",
        Tier.ADVANCED,
        Category.EXCEPTIONAL_PARTS,
        25,
    ),
    "Advanced Quantum Barrier": product(
        "Advanced Quantum Barrier",
        Tier.ADVANCED,
        Category.EXCEPTIONAL_PARTS,
        25,
    ),
    "Rare Anti-Gravity Core Unit": product(
        "Rare Anti-Gravity Core Unit",
        Tier.RARE,
        Category.EXCEPTIONAL_PARTS,
        22.5,
    ),
    "Exotic Anti-Gravity Core Unit": product(
        "Exotic Anti-Gravity Core Unit",
        Tier.EXOTIC,
        Category.EXCEPTIONAL_PARTS,
        25,
    ),
    "Exotic Anti-Matter Core Unit": product(
        "Exotic Anti-Matter Core Unit",
        Tier.EXOTIC,
        Category.EXCEPTIONAL_PARTS,
        26.5,
    ),
    "Exotic Quantum Alignment Unit": product(
        "Exotic Quantum Alignment Unit",
        Tier.EXOTIC,
        Category.EXCEPTIONAL_PARTS,
        30,
    ),
    "Basic Antenna XS": product("Basic Antenna XS", Tier.BASIC, Category.FUNCTIONAL_PARTS, 8.96),
    "Basic Antenna S": product("Basic Antenna S", Tier.BASIC, Category.FUNCTIONAL_PARTS, 46.4),
    "Basic Chemical Container XS": product(
        "Basic Chemical Container XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        4.8,
    ),
    "Basic Chemical Container S": product(
        "Basic Chemical Container S",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        25.6,
    ),
    "Basic Chemical Container M": product(
        "Basic Chemical Container M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        139.2,
    ),
    "Basic Chemical Container L": product(
        "Basic Chemical Container L",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        774.4,
    ),
    "Basic Chemical Container XL": product(
        "Basic Chemical Container XL",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        4420.8,
    ),
    "Basic Combustion Chamber XS": product(
        "Basic Combustion Chamber XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        9.6,
    ),
    "Basic Combustion Chamber S": product(
        "Basic Combustion Chamber S",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        49.6,
    ),
    "Basic Combustion Chamber M": product(
        "Basic Combustion Chamber M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        259.2,
    ),
    "Basic Combustion Chamber L": product(
        "Basic Combustion Chamber L",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        1374.4,
    ),
    "Basic Control System XS": product(
        "Basic Control System XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        5.2,
    ),
    "Basic Control System S": product(
        "Basic Control System S",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        27.6,
    ),
    "Basic Control System M": product(
        "Basic Control System M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        149.2,
    ),
    "Basic Core Unit System XS": product(
        "Basic Core Unit System XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        4.4,
    ),
    "Basic Core Unit System S": product(
        "Basic Core Unit System S",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        23.6,
    ),
    "Basic Electric Engine S": product(
        "Basic Electric Engine S",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        39.04,
    ),
    "Basic Electric Engine M": product(
        "Basic Electric Engine M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        206.4,
    ),
    "Basic Firing System XS": product(
        "Basic Firing System XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        9.6,
    ),
    "Basic Gas Cylinder XS": product(
        "Basic Gas Cylinder XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        9.6,
    ),
    "Basic Gas Cylinder S": product(
        "Basic Gas Cylinder S",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        49.6,
    ),
    "Basic Gas Cylinder M": product(
        "Basic Gas Cylinder M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        259.2,
    ),
    "Basic Ionic Chamber XS": product(
        "Basic Ionic Chamber XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        7.33,
    ),
    "Basic Ionic Chamber S": product(
        "Basic Ionic Chamber S",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        38.24,
    ),
    "Basic Ionic Chamber M": product(
        "Basic Ionic Chamber M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        202.4,
    ),
    "Basic Ionic Chamber L": product(
        "Basic Ionic Chamber L",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        1090.4,
    ),
    "Basic Ionic Chamber XL": product(
        "Basic Ionic Chamber XL",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        6000.8,
    ),
    "Basic Mechanical Sensor XS": product(
        "Basic Mechanical Sensor XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        7.49,
    ),
    "Basic Mobile Panel XS": product(
        "Basic Mobile Panel XS",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        9.6,
    ),
    "Basic Mobile Panel S": product(
        "Basic Mobile Panel S",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        49.6,
    ),
    "Basic Mobile Panel M": product(
        "Basic Mobile Panel M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        259.2,
    ),
    "Basic Mobile Panel L": product(
        "Basic Mobile Panel L",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        1374.4,
    ),
    "Basic Mobile Panel XL": product(
        "Basic Mobile Panel XL",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        7420.8,
    ),
    "Basic Power Transformer M": product(
        "Basic Power Transformer M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        196.4,
    ),
    "Basic Robotic Arm M": product(
        "Basic Robotic Arm M",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        249.2,
    ),
    "Basic Robotic Arm L": product(
        "Basic Robotic Arm L",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        1324.4,
    ),
    "Basic Robotic Arm XL": product(
        "Basic Robotic Arm XL",
        Tier.BASIC,
        Category.FUNCTIONAL_PARTS,
        7170.8,
    ),
    "Basic Screen S": product("Basic Screen S", Tier.BASIC, Category.FUNCTIONAL_PARTS, 25.6),
    "Basic Screen M": product("Basic Screen M", Tier.BASIC, Category.FUNCTIONAL_PARTS, 139.2),
    "Uncommon Antenna XS": product(
        "Uncommon Antenna XS",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        17.12,
    ),
    "Uncommon Antenna S": product(
        "Uncommon Antenna S",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        54.56,
    ),
    "Uncommon Antenna M": product(
        "Uncommon Antenna M",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        251.36,
    ),
    "Uncommon Antenna L": product(
        "Uncommon Antenna L",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        1302.56,
    ),
    "Uncommon Combustion Chamber XS": product(
        "Uncommon Combustion Chamber XS",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        18.4,
    ),
    "Uncommon Combustion Chamber S": product(
        "Uncommon Combustion Chamber S",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        58.4,
    ),
    "Uncommon Combustion Chamber M": product(
        "Uncommon Combustion Chamber M",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        268,
    ),
    "Uncommon Combustion Chamber L": product(
        "Uncommon Combustion Chamber L",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        1383.2,
    ),
    "Uncommon Core Unit System S": product(
        "Uncommon Core Unit System S",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        27.2,
    ),
    "Uncommon Core Unit System M": product(
        "Uncommon Core Unit System M",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        132.8,
    ),
    "Uncommon Core Unit System L": product(
        "Uncommon Core Unit System L",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        728,
    ),
    "Uncommon Electric Engine XL": product(
        "Uncommon Electric Engine XL",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        6107.49,
    ),
    "Uncommon Ionic Chamber XS": product(
        "Uncommon Ionic Chamber XS",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        13.86,
    ),
    "Uncommon Ionic Chamber S": product(
        "Uncommon Ionic Chamber S",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        44.77,
    ),
    "Uncommon Ionic Chamber M": product(
        "Uncommon Ionic Chamber M",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        208.93,
    ),
    "Uncommon Ionic Chamber L": product(
        "Uncommon Ionic Chamber L",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        1096.93,
    ),
    "Uncommon Ionic Chamber XL": product(
        "Uncommon Ionic Chamber XL",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        6007.33,
    ),
    "Uncommon Laser Chamber XS": product(
        "Uncommon Laser Chamber XS",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        18.4,
    ),
    "Uncommon Light XS": product(
        "Uncommon Light XS",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        8.8,
    ),
    "Uncommon Light S": product("Uncommon Light S", Tier.UNCOMMON, Category.FUNCTIONAL_PARTS, 29.6),
    "Uncommon Ore Scanner XL": product(
        "Uncommon Ore Scanner XL",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        2702.9,
    ),
    "Uncommon Power Transformer S": product(
        "Uncommon Power Transformer S",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        43.33,
    ),
    "Uncommon Power Transformer M": product(
        "Uncommon Power Transformer M",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        206.69,
    ),
    "Uncommon Screen XS": product(
        "Uncommon Screen XS",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        8.8,
    ),
    "Uncommon Screen M": product(
        "Uncommon Screen M",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        143.2,
    ),
    "Uncommon Screen XL": product(
        "Uncommon Screen XL",
        Tier.UNCOMMON,
        Category.FUNCTIONAL_PARTS,
        4424.8,
    ),
    "Advanced Antenna S": product(
        "Advanced Antenna S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        54.56,
    ),
    "Advanced Chemical Container S": product(
        "Advanced Chemical Container S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        29.6,
    ),
    "Advanced Chemical Container M": product(
        "Advanced Chemical Container M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        143.2,
    ),
    "Advanced Chemical Container L": product(
        "Advanced Chemical Container L",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        448.4,
    ),
    "Advanced Chemical Container XL": product(
        "Advanced Chemical Container XL",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        4424.8,
    ),
    "Advanced Combustion Chamber XS": product(
        "Advanced Combustion Chamber XS",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        27.2,
    ),
    "Advanced Combustion Chamber S": product(
        "Advanced Combustion Chamber S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        58.4,
    ),
    "Advanced Combustion Chamber M": product(
        "Advanced Combustion Chamber M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        268,
    ),
    "Advanced Control System S": product(
        "Advanced Control System S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        32,
    ),
    "Advanced Control System M": product(
        "Advanced Control System M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        153.6,
    ),
    "Advanced Control System L": product(
        "Advanced Control System L",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        828.8,
    ),
    "Advanced Core Unit System M": product(
        "Advanced Core Unit System M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        132.8,
    ),
    "Advanced Firing System XS": product(
        "Advanced Firing System XS",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        27.2,
    ),
    "Advanced Firing System S": product(
        "Advanced Firing System S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        58.4,
    ),
    "Advanced Firing System M": product(
        "Advanced Firing System M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        268,
    ),
    "Advanced Firing System L": product(
        "Advanced Firing System L",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        1383.2,
    ),
    "Advanced Ionic Chamber M": product(
        "Advanced Ionic Chamber M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        208.93,
    ),
    "Advanced Ionic Chamber L": product(
        "Advanced Ionic Chamber L",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        1096.93,
    ),
    "Advanced Laser Chamber XS": product(
        "Advanced Laser Chamber XS",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        27.2,
    ),
    "Advanced Laser Chamber S": product(
        "Advanced Laser Chamber S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        58.4,
    ),
    "Advanced Laser Chamber M": product(
        "Advanced Laser Chamber M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        268,
    ),
    "Advanced Laser Chamber L": product(
        "Advanced Laser Chamber L",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        1383.2,
    ),
    "Advanced Magnetic Rail XS": product(
        "Advanced Magnetic Rail XS",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        20.86,
    ),
    "Advanced Magnetic Rail S": product(
        "Advanced Magnetic Rail S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        45.73,
    ),
    "Advanced Magnetic Rail M": product(
        "Advanced Magnetic Rail M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        213.09,
    ),
    "Advanced Magnetic Rail L": product(
        "Advanced Magnetic Rail L",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        1117.09,
    ),
    "Advanced Mechanical Sensor XS": product(
        "Advanced Mechanical Sensor XS",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        20.86,
    ),
    "Advanced Missile Silo XS": product(
        "Advanced Missile Silo XS",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        27.2,
    ),
    "Advanced Missile Silo S": product(
        "Advanced Missile Silo S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        58.4,
    ),
    "Advanced Missile Silo M": product(
        "Advanced Missile Silo M",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        268,
    ),
    "Advanced Missile Silo L": product(
        "Advanced Missile Silo L",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        1383.2,
    ),
    "Advanced Motherboard": product(
        "Advanced Motherboard",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        96,
    ),
    "Advanced Power Transformer S": product(
        "Advanced Power Transformer S",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        43.33,
    ),
    "Advanced Screen XS": product(
        "Advanced Screen XS",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        12.8,
    ),
    "Advanced Screen XL": product(
        "Advanced Screen XL",
        Tier.ADVANCED,
        Category.FUNCTIONAL_PARTS,
        4424.8,
    ),
    "Rare Core Unit System L": product(
        "Rare Core Unit System L",
        Tier.RARE,
        Category.FUNCTIONAL_PARTS,
        728,
    ),
    "Rare Laser Chamber S": product(
        "Rare Laser Chamber S",
        Tier.RARE,
        Category.FUNCTIONAL_PARTS,
        58.4,
    ),
    "Rare Power Transformer L": product(
        "Rare Power Transformer L",
        Tier.RARE,
        Category.FUNCTIONAL_PARTS,
        1066.69,
    ),
    "Rare Power Transformer XL": product(
        "Rare Power Transformer XL",
        Tier.RARE,
        Category.FUNCTIONAL_PARTS,
        5857.09,
    ),
    "Exotic Antenna M": product("Exotic Antenna M", Tier.EXOTIC, Category.FUNCTIONAL_PARTS, 250.56),
    "Exotic Antenna L": product(
        "Exotic Antenna L",
        Tier.EXOTIC,
        Category.FUNCTIONAL_PARTS,
        1301.76,
    ),
    "Exotic Antenna XL": product(
        "Exotic Antenna XL",
        Tier.EXOTIC,
        Category.FUNCTIONAL_PARTS,
        7028.16,
    ),
    "Exotic Core Unit System S": product(
        "Exotic Core Unit System S",
        Tier.EXOTIC,
        Category.FUNCTIONAL_PARTS,
        26.8,
    ),
    "Exotic Mechanical Sensor XS": product(
        "Exotic Mechanical Sensor XS",
        Tier.EXOTIC,
        Category.FUNCTIONAL_PARTS,
        19.26,
    ),
    "Exotic Power Transformer L": product(
        "Exotic Power Transformer L",
        Tier.EXOTIC,
        Category.FUNCTIONAL_PARTS,
        1066.29,
    ),
    "Basic Component": product("Basic Component", Tier.BASIC, Category.INTERMEDIARY_PARTS, 0.5),
    "Basic Connector": product("Basic Connector", Tier.BASIC, Category.INTERMEDIARY_PARTS, 0.8),
    "Basic Fixation": product("Basic Fixation", Tier.BASIC, Category.INTERMEDIARY_PARTS, 1),
    "Basic LED": product("Basic LED", Tier.BASIC, Category.INTERMEDIARY_PARTS, 1),
    "Basic Pipe": product("Basic Pipe", Tier.BASIC, Category.INTERMEDIARY_PARTS, 1),
    "Basic Screw": product("Basic Screw", Tier.BASIC, Category.INTERMEDIARY_PARTS, 1),
    "Uncommon Component": product(
        "Uncommon Component",
        Tier.UNCOMMON,
        Category.INTERMEDIARY_PARTS,
        0.5,
    ),
    "Uncommon Connector": product(
        "Uncommon Connector",
        Tier.UNCOMMON,
        Category.INTERMEDIARY_PARTS,
        0.8,
    ),
    "Uncommon Fixation": product(
        "Uncommon Fixation",
        Tier.UNCOMMON,
        Category.INTERMEDIARY_PARTS,
        1,
    ),
    "Uncommon LED": product("Uncommon LED", Tier.UNCOMMON, Category.INTERMEDIARY_PARTS, 1),
    "Uncommon Pipe": product("Uncommon Pipe", Tier.UNCOMMON, Category.INTERMEDIARY_PARTS, 1),
    "Uncommon Screw": product("Uncommon Screw", Tier.UNCOMMON, Category.INTERMEDIARY_PARTS, 1),
    "Advanced Component": product(
        "Advanced Component",
        Tier.ADVANCED,
        Category.INTERMEDIARY_PARTS,
        0.5,
    ),
    "Advanced Connector": product(
        "Advanced Connector",
        Tier.ADVANCED,
        Category.INTERMEDIARY_PARTS,
        0.8,
    ),
    "Advanced Fixation": product(
        "Advanced Fixation",
        Tier.ADVANCED,
        Category.INTERMEDIARY_PARTS,
        1,
    ),
    "Advanced LED": product("Advanced LED", Tier.ADVANCED, Category.INTERMEDIARY_PARTS, 1),
    "Advanced Pipe": product("Advanced Pipe", Tier.ADVANCED, Category.INTERMEDIARY_PARTS, 1),
    "Advanced Screw": product("Advanced Screw", Tier.ADVANCED, Category.INTERMEDIARY_PARTS, 1),
    "Basic Casing XS": product("Basic Casing XS", Tier.BASIC, Category.STRUCTURAL_PARTS, 2),
    "Basic Casing S": product("Basic Casing S", Tier.BASIC, Category.STRUCTURAL_PARTS, 11),
    "Basic Reinforced Frame XS": product(
        "Basic Reinforced Frame XS",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Basic Reinforced Frame S": product(
        "Basic Reinforced Frame S",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        11,
    ),
    "Basic Reinforced Frame M": product(
        "Basic Reinforced Frame M",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        74,
    ),
    "Basic Reinforced Frame L": product(
        "Basic Reinforced Frame L",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Basic Reinforced Frame XL": product(
        "Basic Reinforced Frame XL",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        3602,
    ),
    "Basic Standard Frame XS": product(
        "Basic Standard Frame XS",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Basic Standard Frame S": product(
        "Basic Standard Frame S",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        11,
    ),
    "Basic Standard Frame M": product(
        "Basic Standard Frame M",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        74,
    ),
    "Basic Standard Frame L": product(
        "Basic Standard Frame L",
        Tier.BASIC,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Uncommon Casing XS": product(
        "Uncommon Casing XS",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Uncommon Casing S": product("Uncommon Casing S", Tier.UNCOMMON, Category.STRUCTURAL_PARTS, 11),
    "Uncommon Casing M": product("Uncommon Casing M", Tier.UNCOMMON, Category.STRUCTURAL_PARTS, 74),
    "Uncommon Casing XL": product(
        "Uncommon Casing XL",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        3602,
    ),
    "Uncommon Reinforced Frame XS": product(
        "Uncommon Reinforced Frame XS",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Uncommon Reinforced Frame S": product(
        "Uncommon Reinforced Frame S",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        11,
    ),
    "Uncommon Reinforced Frame M": product(
        "Uncommon Reinforced Frame M",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        74,
    ),
    "Uncommon Reinforced Frame L": product(
        "Uncommon Reinforced Frame L",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Uncommon Reinforced Frame XL": product(
        "Uncommon Reinforced Frame XL",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        3602,
    ),
    "Uncommon Standard Frame XS": product(
        "Uncommon Standard Frame XS",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Uncommon Standard Frame S": product(
        "Uncommon Standard Frame S",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        11,
    ),
    "Uncommon Standard Frame M": product(
        "Uncommon Standard Frame M",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        74,
    ),
    "Uncommon Standard Frame L": product(
        "Uncommon Standard Frame L",
        Tier.UNCOMMON,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Advanced Casing XS": product(
        "Advanced Casing XS",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Advanced Casing S": product("Advanced Casing S", Tier.ADVANCED, Category.STRUCTURAL_PARTS, 11),
    "Advanced Casing M": product("Advanced Casing M", Tier.ADVANCED, Category.STRUCTURAL_PARTS, 74),
    "Advanced Casing L": product(
        "Advanced Casing L",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Advanced Casing XL": product(
        "Advanced Casing XL",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        3602,
    ),
    "Advanced Reinforced Frame XS": product(
        "Advanced Reinforced Frame XS",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Advanced Reinforced Frame S": product(
        "Advanced Reinforced Frame S",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        11,
    ),
    "Advanced Reinforced Frame M": product(
        "Advanced Reinforced Frame M",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        74,
    ),
    "Advanced Reinforced Frame L": product(
        "Advanced Reinforced Frame L",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Advanced Standard Frame XS": product(
        "Advanced Standard Frame XS",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Advanced Standard Frame S": product(
        "Advanced Standard Frame S",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        11,
    ),
    "Advanced Standard Frame M": product(
        "Advanced Standard Frame M",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        74,
    ),
    "Advanced Standard Frame L": product(
        "Advanced Standard Frame L",
        Tier.ADVANCED,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Rare Casing XS": product("Rare Casing XS", Tier.RARE, Category.STRUCTURAL_PARTS, 2),
    "Rare Casing S": product("Rare Casing S", Tier.RARE, Category.STRUCTURAL_PARTS, 11),
    "Rare Reinforced Frame L": product(
        "Rare Reinforced Frame L",
        Tier.RARE,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Rare Reinforced Frame XL": product(
        "Rare Reinforced Frame XL",
        Tier.RARE,
        Category.STRUCTURAL_PARTS,
        3602,
    ),
    "Rare Standard Frame L": product(
        "Rare Standard Frame L",
        Tier.RARE,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Exotic Casing S": product("Exotic Casing S", Tier.EXOTIC, Category.STRUCTURAL_PARTS, 11),
    "Exotic Reinforced Frame M": product(
        "Exotic Reinforced Frame M",
        Tier.EXOTIC,
        Category.STRUCTURAL_PARTS,
        74,
    ),
    "Exotic Reinforced Frame L": product(
        "Exotic Reinforced Frame L",
        Tier.EXOTIC,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Exotic Reinforced Frame XL": product(
        "Exotic Reinforced Frame XL",
        Tier.EXOTIC,
        Category.STRUCTURAL_PARTS,
        3602,
    ),
    "Exotic Standard Frame XS": product(
        "Exotic Standard Frame XS",
        Tier.EXOTIC,
        Category.STRUCTURAL_PARTS,
        2,
    ),
    "Exotic Standard Frame L": product(
        "Exotic Standard Frame L",
        Tier.EXOTIC,
        Category.STRUCTURAL_PARTS,
        515,
    ),
    "Anti-Gravity Pulsor": otherElement("Anti-Gravity Pulsor", Category.ANTI_GRAVITY, 804.93),
    "Anti-Gravity Generator S": otherElement(
        "Anti-Gravity Generator S",
        Category.ANTI_GRAVITY,
        4279.69,
    ),
    "Anti-Gravity Generator M": otherElement(
        "Anti-Gravity Generator M",
        Category.ANTI_GRAVITY,
        21617.09,
    ),
    "Anti-Gravity Generator L": otherElement(
        "Anti-Gravity Generator L",
        Category.ANTI_GRAVITY,
        86468.35,
    ),
    "Container XS": containerElement("Container XS", Category.ITEM_CONTAINERS, 64, 1000),
    "Container S": containerElement("Container S", Category.ITEM_CONTAINERS, 342, 8000),
    "Container M": containerElement("Container M", Category.ITEM_CONTAINERS, 1873, 64000),
    "Container L": containerElement("Container L", Category.ITEM_CONTAINERS, 3746, 128000),
    "Container Hub": otherElement("Container Hub", Category.ITEM_CONTAINERS, 44.3),
    "Atmospheric Fuel Tank S": otherElement("Atmospheric Fuel Tank S", Category.FUEL_TANKS, 92.6),
    "Atmospheric Fuel Tank M": otherElement("Atmospheric Fuel Tank M", Category.FUEL_TANKS, 499.2),
    "Atmospheric Fuel Tank L": otherElement("Atmospheric Fuel Tank L", Category.FUEL_TANKS, 2755.4),
    "Space Fuel Tank S": otherElement("Space Fuel Tank S", Category.FUEL_TANKS, 92.6),
    "Space Fuel Tank M": otherElement("Space Fuel Tank M", Category.FUEL_TANKS, 499.2),
    "Space Fuel Tank L": otherElement("Space Fuel Tank L", Category.FUEL_TANKS, 2755.4),
    "Resurrection Node": otherElement("Resurrection Node", Category.CONTROL, 203.33),
    "Cockpit Controller": otherElement("Cockpit Controller", Category.CONTROL, 491.2),
    "Command Seat Controller": otherElement("Command Seat Controller", Category.CONTROL, 66.6),
    "Emergency Controller": otherElement("Emergency Controller", Category.CONTROL, 4.8),
    "Programming Board": otherElement("Programming Board", Category.CONTROL, 12.7),
    "Adjustor S": otherElement("Adjustor S", Category.FLIGHT_CONTROL, 22.6),
    "Adjustor M": otherElement("Adjustor M", Category.FLIGHT_CONTROL, 116.6),
    "Adjustor L": otherElement("Adjustor L", Category.FLIGHT_CONTROL, 619.2),
    "Atmospheric Airbrake S": otherElement("Atmospheric Airbrake S", Category.FLIGHT_CONTROL, 22.6),
    "Atmospheric Airbrake M": otherElement(
        "Atmospheric Airbrake M",
        Category.FLIGHT_CONTROL,
        116.6,
    ),
    "Atmospheric Airbrake L": otherElement(
        "Atmospheric Airbrake L",
        Category.FLIGHT_CONTROL,
        619.2,
    ),
    "Retro-Rocket Brake S": otherElement("Retro-Rocket Brake S", Category.FLIGHT_CONTROL, 20.33),
    "Retro-Rocket Brake M": otherElement("Retro-Rocket Brake M", Category.FLIGHT_CONTROL, 105.24),
    "Retro-Rocket Brake L": otherElement("Retro-Rocket Brake L", Category.FLIGHT_CONTROL, 562.4),
    "Aileron XS": otherElement("Aileron XS", Category.AIRFOIL, 45.2),
    "Aileron S": otherElement("Aileron S", Category.AIRFOIL, 233.2),
    "Aileron M": otherElement("Aileron M", Category.AIRFOIL, 1238.4),
    "Compact Aileron XS": otherElement("Compact Aileron XS", Category.AIRFOIL, 22.6),
    "Compact Aileron S": otherElement("Compact Aileron S", Category.AIRFOIL, 116.6),
    "Compact Aileron M": otherElement("Compact Aileron M", Category.AIRFOIL, 619.2),
    "Stabilizer XS": otherElement("Stabilizer XS", Category.AIRFOIL, 22.6),
    "Stabilizer S": otherElement("Stabilizer S", Category.AIRFOIL, 116.6),
    "Stabilizer M": otherElement("Stabilizer M", Category.AIRFOIL, 619.2),
    "Stabilizer L": otherElement("Stabilizer L", Category.AIRFOIL, 3355.4),
    "Wing XS": otherElement("Wing XS", Category.AIRFOIL, 22.6),
    "Wing S": otherElement("Wing S", Category.AIRFOIL, 116.6),
    "Wing M": otherElement("Wing M", Category.AIRFOIL, 619.2),
    "Warp Drive L": otherElement("Warp Drive L", Category.ENGINES, 4123),
    "Basic Atmospheric Engine S": otherElement(
        "Basic Atmospheric Engine S",
        Category.ENGINES,
        116.6,
    ),
    "Basic Atmospheric Engine M": otherElement(
        "Basic Atmospheric Engine M",
        Category.ENGINES,
        619.2,
    ),
    "Basic Atmospheric Engine L": otherElement(
        "Basic Atmospheric Engine L",
        Category.ENGINES,
        3355.4,
    ),
    "Basic Space Engine S": otherElement("Basic Space Engine S", Category.ENGINES, 105.24),
    "Basic Space Engine M": otherElement("Basic Space Engine M", Category.ENGINES, 562.4),
    "Basic Space Engine L": otherElement("Basic Space Engine L", Category.ENGINES, 3071.4),
    "Basic Space Engine XL": otherElement("Basic Space Engine XL", Category.ENGINES, 17148.8),
    "Vertical Booster S": otherElement("Vertical Booster S", Category.ENGINES, 20.33),
    "Vertical Booster M": otherElement("Vertical Booster M", Category.ENGINES, 105.24),
    "Vertical Booster L": otherElement("Vertical Booster L", Category.ENGINES, 562.4),
    "Assembly Line XS": otherElement("Assembly Line XS", Category.INDUSTRY, 21.8),
    "Assembly Line S": otherElement("Assembly Line S", Category.INDUSTRY, 112.6),
    "Assembly Line M": otherElement("Assembly Line M", Category.INDUSTRY, 599.2),
    "Assembly Line L": otherElement("Assembly Line L", Category.INDUSTRY, 3255.4),
    "Assembly Line XL": otherElement("Assembly Line XL", Category.INDUSTRY, 18068.8),
    "3D Printer M": otherElement("3D Printer M", Category.INDUSTRY, 609.2),
    "Chemical Industry M": otherElement("Chemical Industry M", Category.INDUSTRY, 479.2),
    "Electronics Industry M": otherElement("Electronics Industry M", Category.INDUSTRY, 459.2),
    "Glass Furnace M": otherElement("Glass Furnace M", Category.INDUSTRY, 556.4),
    "Honeycomb Refiner M": otherElement("Honeycomb Refiner M", Category.INDUSTRY, 589.2),
    "Metalwork Industry M": otherElement("Metalwork Industry M", Category.INDUSTRY, 599.2),
    "Recycler M": otherElement("Recycler M", Category.INDUSTRY, 619.2),
    "Refiner M": otherElement("Refiner M", Category.INDUSTRY, 479.2),
    "Smelter M": otherElement("Smelter M", Category.INDUSTRY, 499.2),
    "Transfer Unit": otherElement("Transfer Unit", Category.INDUSTRY, 3305.4),
    "Repair Unit": otherElement("Repair Unit", Category.INDUSTRY, 10000),
    Gyroscope: otherElement("Gyroscope", Category.INSTRUMENTS, 17.65),
    Telemeter: otherElement("Telemeter", Category.INSTRUMENTS, 31.4),
    "Territory Scanner": otherElement("Territory Scanner", Category.INSTRUMENTS, 12702.9),
    Airlock: otherElement("Airlock", Category.INTERACTIVE, 546.4),
    "Elevator XS": otherElement("Elevator XS", Category.INTERACTIVE, 57.56),
    "Expanded Gate L": otherElement("Expanded Gate L", Category.INTERACTIVE, 16755.49),
    "Force Field XS": otherElement("Force Field XS", Category.INTERACTIVE, 34.7),
    "Force Field S": otherElement("Force Field S", Category.INTERACTIVE, 34.7),
    "Force Field M": otherElement("Force Field M", Category.INTERACTIVE, 34.7),
    "Force Field L": otherElement("Force Field L", Category.INTERACTIVE, 34.7),
    "Gate XL": otherElement("Gate XL", Category.INTERACTIVE, 16755.49),
    "Hatch S": otherElement("Hatch S", Category.INTERACTIVE, 24),
    "Interior Door": otherElement("Interior Door", Category.INTERACTIVE, 546.4),
    "Landing Gear S": otherElement("Landing Gear S", Category.INTERACTIVE, 67),
    "Landing Gear M": otherElement("Landing Gear M", Category.INTERACTIVE, 360),
    "Landing Gear L": otherElement("Landing Gear L", Category.INTERACTIVE, 1981),
    "Reinforced Sliding Door": otherElement("Reinforced Sliding Door", Category.INTERACTIVE, 546.4),
    "Screen XS": otherElement("Screen XS", Category.INTERACTIVE, 15.8),
    "Screen S": otherElement("Screen S", Category.INTERACTIVE, 15.8),
    "Screen M": otherElement("Screen M", Category.INTERACTIVE, 15.8),
    "Screen XL": otherElement("Screen XL", Category.INTERACTIVE, 11174.8),
    "Transparent Screen XS": otherElement("Transparent Screen XS", Category.INTERACTIVE, 15.8),
    "Transparent Screen S": otherElement("Transparent Screen S", Category.INTERACTIVE, 15.8),
    "Transparent Screen M": otherElement("Transparent Screen M", Category.INTERACTIVE, 15.8),
    "Transparent Screen L": otherElement("Transparent Screen L", Category.INTERACTIVE, 15.8),
    "Sliding Door S": otherElement("Sliding Door S", Category.INTERACTIVE, 102.4),
    "Sliding Door M": otherElement("Sliding Door M", Category.INTERACTIVE, 151.8),
    "Encampment Chair": otherElement("Encampment Chair", Category.INTERACTIVE, 2),
    "Navigator Chair": otherElement("Navigator Chair", Category.INTERACTIVE, 24),
    "Office Chair": otherElement("Office Chair", Category.INTERACTIVE, 13),
    "Long Light S": otherElement("Long Light S", Category.INTERACTIVE, 21.6),
    "Long Light M": otherElement("Long Light M", Category.INTERACTIVE, 21.6),
    "Long Light L": otherElement("Long Light L", Category.INTERACTIVE, 21.6),
    "Atmospheric Radar S": otherElement("Atmospheric Radar S", Category.SENSOR, 96.56),
    "Atmospheric Radar M": otherElement("Atmospheric Radar M", Category.SENSOR, 486.36),
    "Atmospheric Radar L": otherElement("Atmospheric Radar L", Category.SENSOR, 2658.56),
    "Space Radar S": otherElement("Space Radar S", Category.SENSOR, 96.56),
    "Space Radar M": otherElement("Space Radar M", Category.SENSOR, 486.36),
    "Space Radar L": otherElement("Space Radar L", Category.SENSOR, 2658.56),
    "Static Core XS": otherElement("Static Core XS", Category.CORE_UNIT, 16.1),
    "Static Core S": otherElement("Static Core S", Category.CORE_UNIT, 83.6),
    "Static Core M": otherElement("Static Core M", Category.CORE_UNIT, 454.8),
    "Static Core L": otherElement("Static Core L", Category.CORE_UNIT, 2501),
    "Space Core XS": otherElement("Space Core XS", Category.CORE_UNIT, 14),
    "Space Core S": otherElement("Space Core S", Category.CORE_UNIT, 120),
    "Space Core M": otherElement("Space Core M", Category.CORE_UNIT, 420),
    "Space Core L": otherElement("Space Core L", Category.CORE_UNIT, 1383),
    "Dynamic Core XS": otherElement("Dynamic Core XS", Category.CORE_UNIT, 16.1),
    "Dynamic Core S": otherElement("Dynamic Core S", Category.CORE_UNIT, 87.2),
    "Dynamic Core M": otherElement("Dynamic Core M", Category.CORE_UNIT, 454.8),
    "Dynamic Core L": otherElement("Dynamic Core L", Category.CORE_UNIT, 2501),
    "Territory Unit": otherElement("Territory Unit", Category.CORE_UNIT, 4118.29),
}

/**
 * Get the ContainerElements sorted by capacity from largest to smallest
 */
export const CONTAINERS_ASCENDING_BY_CAPACITY = Object.values(ITEMS).filter(isContainerElement)
CONTAINERS_ASCENDING_BY_CAPACITY.sort((a, b) => b.capacity - a.capacity)
